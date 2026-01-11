# Related Topics Generation Prompt Template

## Purpose
Generate relevant Wikipedia topics for further reading based on the article content.

## Prompt Template

```
Based on the following Wikipedia article, suggest 5-8 related Wikipedia topics that would be interesting for further reading.

Article Title: {title}
Sections: {sections}
Content Summary: {content}

INSTRUCTIONS:
1. Suggest topics that are directly related to the article
2. Topics should be specific enough to have their own Wikipedia pages
3. Provide diverse topics covering different aspects mentioned in the article
4. Return ONLY a JSON array of topic names

Format:
{{
  "topics": ["Topic 1", "Topic 2", "Topic 3", "Topic 4", "Topic 5"]
}}

Return ONLY valid JSON, no additional text.
```

## Design Principles

### 1. Relevance
- Topics must be mentioned or implied in the article
- Avoid generic or overly broad topics
- Focus on specific entities, concepts, or events

### 2. Diversity
- Cover different aspects: people, places, events, concepts
- Mix historical and contemporary topics
- Include both well-known and niche subjects

### 3. Educational Value
- Topics should deepen understanding of the main subject
- Provide context and background
- Enable exploration of related fields

## Example Output

```json
{
  "topics": [
    "Cryptography",
    "Enigma machine",
    "Computer science history",
    "Artificial intelligence",
    "Bletchley Park",
    "Turing machine",
    "Church-Turing thesis"
  ]
}
```

## Fallback Strategy

If LLM fails to generate topics, system provides default related topics based on:
- Article title + " history"
- "Related figures to " + article title
- "Historical context"
- "Modern impact"
