# Quiz Generation Prompt Template

## Purpose
Generate high-quality, factually accurate quiz questions from Wikipedia article content using Google Gemini AI.

## Prompt Template

```
You are an expert quiz creator. Based on the following Wikipedia article, create {num_questions} high-quality quiz questions.

Article Title: {title}

Available Sections: {sections}

Article Content:
{content}

CRITICAL INSTRUCTIONS:
1. Base ALL questions STRICTLY on the provided article content - DO NOT use external knowledge
2. Create questions with varying difficulty levels (easy, medium, hard)
3. Each question must have EXACTLY 4 options (A, B, C, D format)
4. Ensure questions cover different sections of the article
5. Make explanations reference specific parts of the article
6. Ensure factual accuracy - verify answers are in the text
7. Avoid ambiguous questions

Generate EXACTLY {num_questions} questions in the following JSON format:
{{
  "questions": [
    {{
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Correct option text",
      "difficulty": "easy|medium|hard",
      "explanation": "Brief explanation referencing the article",
      "section_reference": "Section name from the article"
    }}
  ]
}}

Return ONLY valid JSON, no additional text.
```

## Key Design Principles

### 1. Grounding Strategy
- **Explicit Content Reference**: All questions must be verifiable within the provided article text
- **Section Attribution**: Each question references its source section to prevent hallucination
- **Fact Verification**: Explanations must cite specific article content

### 2. Difficulty Distribution
- **Easy (30%)**: Basic facts, definitions, direct information
- **Medium (50%)**: Connections, implications, multi-step reasoning
- **Hard (20%)**: Deep analysis, nuanced understanding, complex relationships

### 3. Question Quality Criteria
- **Clarity**: Unambiguous wording
- **Relevance**: Directly related to article content
- **Diversity**: Cover multiple sections and topics
- **Educational Value**: Test meaningful understanding, not trivia

### 4. Hallucination Prevention
- Strict instruction to use ONLY provided content
- Requirement for section references
- Explanation must cite article text
- JSON structure enforces accountability

## Example Output

```json
{
  "questions": [
    {
      "question": "Where did Alan Turing study?",
      "options": [
        "Harvard University",
        "Cambridge University",
        "Oxford University",
        "Princeton University"
      ],
      "answer": "Cambridge University",
      "difficulty": "easy",
      "explanation": "Mentioned in the 'Early life' section that Turing studied at King's College, Cambridge.",
      "section_reference": "Early life and education"
    }
  ]
}
```

## Optimization Notes

1. **Temperature**: Set to 0.7 for balanced creativity and accuracy
2. **Token Limit**: Content truncated to 12,000 characters to fit context window
3. **Validation**: Post-processing ensures exactly 4 options per question
4. **Fallback**: If parsing fails, system provides error with context
