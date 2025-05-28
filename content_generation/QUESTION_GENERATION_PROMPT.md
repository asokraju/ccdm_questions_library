# Clinical Data Management Quiz Question Generation Template

## Instructions for LLM

You are an expert in Clinical Data Management (CDM) education. Your task is to create comprehensive quiz questions from the provided chapter content following the 5-part methodology below.

## 5-Part Question Generation Methodology

### Part 1: Content Analysis
- Read and understand the entire chapter
- Identify key concepts, definitions, processes, and best practices
- Note regulatory requirements, industry standards, and practical applications
- Highlight critical information that practitioners must know

### Part 2: Learning Objectives Mapping
- Extract main learning objectives from the chapter
- Categorize content into:
  - Foundational knowledge (definitions, concepts)
  - Procedural knowledge (processes, workflows)
  - Applied knowledge (best practices, decision-making)
  - Regulatory/Compliance knowledge

### Part 3: Question Difficulty Distribution
Create a balanced mix of questions:
- **Easy (30%)**: Basic definitions, simple recall, fundamental concepts
- **Moderate (50%)**: Application of concepts, process understanding, standard procedures
- **Challenging (20%)**: Complex scenarios, critical thinking, integration of multiple concepts

### Part 4: Question Type Variety
Ensure diverse question formats:
- Definition-based questions
- Process/procedure questions
- Scenario-based questions
- Best practice questions
- Regulatory/compliance questions
- "Which of the following" questions
- "All of the following EXCEPT" questions

### Part 5: Quality Assurance
For each question ensure:
- Clear, unambiguous wording
- One definitively correct answer
- Plausible distractors (wrong answers)
- Comprehensive explanations
- Practical relevance to CDM work

## Output Format

Generate questions in YAML format:

```yaml
- question: "Clear, specific question text"
  difficulty: "easy|moderate|challenging"
  options:
    a: "First option"
    b: "Second option"
    c: "Third option"
    d: "Fourth option"
  answer: "a|b|c|d"
  explanation: "Detailed explanation of why the answer is correct and why others are incorrect"
  subtopic: "Specific subtopic within the chapter"
```

## Guidelines for High-Quality Questions

### CRITICAL: Never Use These Phrases
❌ **NEVER start questions with:**
- "According to the chapter..."
- "As stated in the text..."
- "The book mentions that..."
- "As given in the book..."
- "Based on the reading..."
- "The chapter states..."

✅ **INSTEAD, write questions as if testing real-world CDM knowledge:**
- "What is the primary purpose of..."
- "Which approach is most appropriate for..."
- "During [specific process], what should..."
- "In clinical data management, how is..."
- "When implementing [specific task], which..."

### 1. Question Stem Guidelines
- Write questions that test actual CDM knowledge, not reading recall
- Frame questions as if asking a CDM professional, not a student
- Be specific and clear
- Avoid negative phrasing unless necessary
- Include relevant context
- Focus on one concept per question

### 2. Answer Options Guidelines
- Make all options similar in length and complexity
- Avoid "all of the above" or "none of the above"
- Ensure distractors are plausible but clearly incorrect
- Don't use absolute terms (always, never) unless accurate

### 3. Explanation Guidelines
- Start with why the correct answer is right
- Explain why each incorrect option is wrong
- Reference relevant regulations or standards
- Provide practical context when applicable

### 4. Subtopic Assignment
Assign subtopics based on chapter sections, such as:
- Overview/Introduction
- Key Definitions
- Processes and Procedures
- Regulatory Requirements
- Best Practices
- Common Challenges
- Tools and Technologies

## Example Questions

### Easy Example:
```yaml
- question: "What is the primary purpose of a Data Management Plan (DMP)?"
  difficulty: "easy"
  options:
    a: "To describe how data will be collected, processed, and managed throughout a clinical trial"
    b: "To track patient enrollment numbers"
    c: "To calculate study budget requirements"
    d: "To schedule monitoring visits"
  answer: "a"
  explanation: "A Data Management Plan (DMP) is a comprehensive document that describes how data will be collected, processed, and managed throughout a clinical trial. It serves as a roadmap for all data management activities. Option B is incorrect as patient enrollment tracking is just one component. Options C and D relate to project management rather than data management specifically."
  subtopic: "DMP Overview"
```

### Moderate Example:
```yaml
- question: "During database design, which approach is most appropriate for handling protocol amendments?"
  difficulty: "moderate"
  options:
    a: "Create an entirely new database for each amendment"
    b: "Design flexible structures that can accommodate minor changes without database modifications"
    c: "Ignore potential amendments during initial design"
    d: "Wait for all amendments before starting database design"
  answer: "b"
  explanation: "Designing flexible database structures that can accommodate minor protocol changes is best practice. This approach minimizes the need for database modifications and reduces validation efforts. Creating new databases (A) is inefficient, ignoring amendments (C) is poor planning, and waiting for all amendments (D) would significantly delay study startup."
  subtopic: "Database Design Principles"
```

### Challenging Example:
```yaml
- question: "A sponsor wants to implement risk-based monitoring for a global Phase III oncology trial with 200 sites. Which combination of factors should primarily drive the risk assessment for individual sites?"
  difficulty: "challenging"
  options:
    a: "Site location, principal investigator experience, and local regulatory requirements only"
    b: "Patient enrollment targets, site infrastructure, and historical audit findings"
    c: "Protocol complexity, site performance metrics, patient safety indicators, and data quality trends"
    d: "Budget constraints, CRO recommendations, and competitive enrollment pressures"
  answer: "c"
  explanation: "Risk-based monitoring should be driven by factors that directly impact data quality and patient safety. Protocol complexity, site performance metrics, patient safety indicators, and data quality trends provide comprehensive risk assessment. While options A and B include relevant factors, they're incomplete. Option D focuses on business factors rather than quality and safety considerations required by ICH E6(R2) guidelines."
  subtopic: "Risk-Based Monitoring"
```

## Prompt to Use:

```
I will provide you with a chapter from the Good Clinical Data Management Practices (GCDMP) guide. Please generate 25-30 high-quality quiz questions following the 5-part methodology above.

Requirements:
1. Follow the exact YAML format provided
2. Ensure difficulty distribution: ~30% easy, ~50% moderate, ~20% challenging
3. Cover all major topics in the chapter
4. Include various question types
5. Write clear, educational explanations
6. Assign appropriate subtopics based on chapter sections

Chapter content:
[PASTE CHAPTER CONTENT HERE]

Please generate the questions in the specified YAML format.
```

## Common Mistakes to Avoid

1. **Reference-Based Questions**: Never use "according to the chapter" or similar phrases
2. **Reading Comprehension**: Don't test if someone read the text, test if they understand CDM
3. **Source Attribution**: Avoid "the book says" or "as mentioned in the text"
4. **Chapter-Specific Framing**: Questions should apply to CDM broadly, not just the chapter

## Additional Tips for Question Generation

1. **Focus on Practical Application**: Questions should test understanding that's relevant to daily CDM work
2. **Avoid Trivia**: Don't create questions about minor details that aren't critical to job performance
3. **Use Current Standards**: Reference current regulations (ICH E6(R2), 21 CFR Part 11, etc.)
4. **Consider Global Perspective**: Include considerations for different regulatory regions when applicable
5. **Test Critical Thinking**: Challenging questions should require synthesis of information, not just recall
6. **Professional Framing**: Write as if for a certification exam, not a reading quiz

## Quality Checklist
Before finalizing questions, verify:
- [ ] Clear, unambiguous question text
- [ ] Exactly one correct answer
- [ ] Plausible distractors
- [ ] Comprehensive explanations
- [ ] Appropriate difficulty level
- [ ] Correct YAML formatting
- [ ] Relevant subtopic assignment
- [ ] Practical relevance to CDM work