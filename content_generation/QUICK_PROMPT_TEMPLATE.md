# Quick Prompt Template for Question Generation

## Copy and Use This Prompt:

```
You are an expert in Clinical Data Management education. Please generate 25-30 quiz questions from the chapter I'll provide.

CRITICAL RULES:
- NEVER use phrases like "According to the chapter", "As stated in the text", "The book mentions", etc.
- Write questions as if testing real-world CDM knowledge, NOT reading comprehension
- Questions should stand alone without referencing the source material
- Frame questions as you would ask a CDM professional in practice

Follow this 5-part methodology:
1. **Analyze Content**: Identify key concepts, processes, regulations, and best practices
2. **Map Learning Objectives**: Categorize into foundational, procedural, applied, and regulatory knowledge
3. **Distribute Difficulty**: 30% easy, 50% moderate, 20% challenging
4. **Vary Question Types**: Include definitions, processes, scenarios, best practices, and regulatory questions
5. **Ensure Quality**: Clear wording, one correct answer, plausible distractors, detailed explanations

Output in this YAML format:
```yaml
- question: "Question text"
  difficulty: "easy|moderate|challenging"
  options:
    a: "Option A"
    b: "Option B"
    c: "Option C"
    d: "Option D"
  answer: "a|b|c|d"
  explanation: "Why this answer is correct and others are incorrect"
  subtopic: "Subtopic from chapter"
```

Requirements:
- Cover all major chapter topics
- Make questions practical and relevant to CDM work
- Reference current standards (ICH E6(R2), 21 CFR Part 11, etc.)
- Avoid trivia or minor details
- Ensure each question tests important knowledge

Chapter content:
[PASTE YOUR CHAPTER HERE]
```

## Example Usage:

1. Copy the prompt above
2. Replace `[PASTE YOUR CHAPTER HERE]` with your chapter content
3. Send to Claude, GPT-4, or another capable LLM
4. Review generated questions for accuracy
5. Save as `questions.yaml` in the appropriate chapter folder

## Quick Tips:
- For longer chapters, you may need to process in sections
- Review all questions for accuracy before adding to the quiz app
- Ensure explanations are educational and comprehensive
- Verify YAML formatting is correct before saving