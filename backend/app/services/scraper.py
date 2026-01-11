import requests
from bs4 import BeautifulSoup
from typing import Dict, List, Optional
import re

class WikipediaScraper:
    
    @staticmethod
    def validate_wikipedia_url(url: str) -> bool:
        pattern = r'^https?://(en\.)?wikipedia\.org/wiki/.+'
        return bool(re.match(pattern, url))
    
    @staticmethod
    def scrape_article(url: str) -> Dict:
        if not WikipediaScraper.validate_wikipedia_url(url):
            raise ValueError("Invalid Wikipedia URL. Must be a valid English Wikipedia article URL.")
        
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            title = WikipediaScraper._extract_title(soup)
            summary = WikipediaScraper._extract_summary(soup)
            sections = WikipediaScraper._extract_sections(soup)
            key_entities = WikipediaScraper._extract_entities(soup)
            content_text = WikipediaScraper._extract_full_text(soup)
            
            return {
                'title': title,
                'summary': summary,
                'sections': sections,
                'key_entities': key_entities,
                'content_text': content_text,
                'raw_html': str(soup)
            }
            
        except requests.RequestException as e:
            raise Exception(f"Failed to fetch Wikipedia article: {str(e)}")
    
    @staticmethod
    def _extract_title(soup: BeautifulSoup) -> str:
        title_elem = soup.find('h1', class_='firstHeading')
        if title_elem:
            return title_elem.get_text().strip()
        title_elem = soup.find('title')
        if title_elem:
            return title_elem.get_text().replace(' - Wikipedia', '').strip()
        return "Unknown Title"
    
    @staticmethod
    def _extract_summary(soup: BeautifulSoup) -> str:
        content_div = soup.find('div', id='bodyContent')
        if not content_div:
            content_div = soup.find('div', class_='mw-parser-output')
        if not content_div:
            return ""
        
        paragraphs = []
        for elem in content_div.find_all('p'):
            text = elem.get_text().strip()
            if text and len(text) > 50:
                paragraphs.append(text)
                if len(paragraphs) >= 3:
                    break
        
        return ' '.join(paragraphs)
    
    @staticmethod
    def _extract_sections(soup: BeautifulSoup) -> List[str]:
        sections = []
        content_div = soup.find('div', id='bodyContent')
        if not content_div:
            content_div = soup.find('div', class_='mw-parser-output')
        
        if content_div:
            for heading in content_div.find_all(['h2', 'h3']):
                headline = heading.find('span', class_='mw-headline')
                if headline:
                    section_text = headline.get_text().strip()
                    if section_text and section_text not in ['Contents', 'References', 'External links', 'See also', 'Notes', 'Bibliography', 'Further reading']:
                        sections.append(section_text)
        return sections[:15]
    
    @staticmethod
    def _extract_entities(soup: BeautifulSoup) -> Dict[str, List[str]]:
        people = set()
        organizations = set()
        locations = set()
        
        content_div = soup.find('div', id='bodyContent')
        if not content_div:
            content_div = soup.find('div', class_='mw-parser-output')
        
        if content_div:
            for link in content_div.find_all('a', href=True, limit=150):
                href = link.get('href', '')
                text = link.get_text().strip()
                
                if '/wiki/' in href and ':' not in href and text and len(text) > 2:
                    if any(word in href.lower() for word in ['university', 'institute', 'organization', 'company', 'corporation', 'laboratory']):
                        organizations.add(text)
                    elif any(word in href.lower() for word in ['city', 'country', 'state', 'kingdom', 'empire', 'united']):
                        locations.add(text)
                    elif len(text.split()) <= 3 and text[0].isupper() and not text.isupper():
                        people.add(text)
        
        return {
            'people': list(people)[:15],
            'organizations': list(organizations)[:15],
            'locations': list(locations)[:15]
        }
    
    @staticmethod
    def _extract_full_text(soup: BeautifulSoup) -> str:
        content_div = soup.find('div', id='bodyContent')
        if not content_div:
            content_div = soup.find('div', class_='mw-parser-output')
        if not content_div:
            return ""
        
        for unwanted in content_div.find_all(['table', 'script', 'style', 'sup', 'div.navbox', 'div.reflist']):
            unwanted.decompose()
        
        for unwanted in content_div.find_all('span', class_='mw-editsection'):
            unwanted.decompose()
        
        paragraphs = []
        for elem in content_div.find_all(['p', 'h2', 'h3']):
            text = elem.get_text().strip()
            if text and len(text) > 30:
                if elem.name in ['h2', 'h3']:
                    headline = elem.find('span', class_='mw-headline')
                    if headline:
                        text = f"\n## {headline.get_text().strip()}\n"
                paragraphs.append(text)
        
        full_text = '\n\n'.join(paragraphs)
        return full_text[:15000] if full_text else ""
