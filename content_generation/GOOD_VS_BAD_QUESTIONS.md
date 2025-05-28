# Good vs Bad Question Examples

## ❌ BAD Questions (Never Write These)

### Example 1 - Reference-Based
**BAD:**
```yaml
- question: "According to the chapter, what are the three phases of database development?"
```
**Why it's bad:** References the source material instead of testing knowledge

**GOOD:**
```yaml
- question: "What are the three primary phases of clinical database development?"
```

### Example 2 - Reading Comprehension
**BAD:**
```yaml
- question: "As stated in the text, when should data validation rules be implemented?"
```
**Why it's bad:** Tests whether someone read the text, not CDM knowledge

**GOOD:**
```yaml
- question: "At which stage of database development should data validation rules be implemented?"
```

### Example 3 - Book Reference
**BAD:**
```yaml
- question: "The book mentions four types of edit checks. Which of the following is NOT one of them?"
```
**Why it's bad:** References "the book" and tests memorization

**GOOD:**
```yaml
- question: "Which of the following is NOT a standard type of edit check used in clinical databases?"
```

### Example 4 - Chapter Specific
**BAD:**
```yaml
- question: "Based on this chapter's description, what is the role of a Clinical Data Manager?"
```
**Why it's bad:** Limits the answer to chapter content rather than industry knowledge

**GOOD:**
```yaml
- question: "What is the primary role of a Clinical Data Manager in clinical trials?"
```

## ✅ GOOD Questions (Write Like These)

### Professional Knowledge Testing
```yaml
- question: "What is the primary purpose of a Data Management Plan (DMP) in clinical trials?"
  difficulty: "easy"
  options:
    a: "To outline how clinical data will be collected, processed, and managed throughout the trial"
    b: "To track patient enrollment milestones"
    c: "To calculate study budget allocations"
    d: "To schedule site monitoring visits"
  answer: "a"
  explanation: "A DMP is a comprehensive document that outlines all data management activities for a clinical trial, serving as the roadmap for data collection, processing, and quality control. The other options represent different study documents - enrollment projections, budget plans, and monitoring plans respectively."
  subtopic: "Data Management Planning"
```

### Practical Application
```yaml
- question: "When implementing edit checks for laboratory data, which type of check would best identify potential transcription errors?"
  difficulty: "moderate"
  options:
    a: "Univariate range checks"
    b: "Logical consistency checks"
    c: "Protocol deviation checks"
    d: "Missing data checks"
  answer: "a"
  explanation: "Univariate range checks are most effective for identifying transcription errors in lab data by flagging values outside the expected physiological range. Logical consistency checks compare related fields, protocol deviation checks identify non-compliance, and missing data checks only identify absent values."
  subtopic: "Edit Check Design"
```

### Scenario-Based
```yaml
- question: "A clinical data manager discovers that a site has been entering dates in DD/MM/YYYY format instead of the required MM/DD/YYYY format. What is the most appropriate first action?"
  difficulty: "moderate"
  options:
    a: "Immediately lock the database to prevent further entries"
    b: "Issue a query to the site to clarify and correct all affected dates"
    c: "Modify the database to accept both date formats"
    d: "Report the site to the study monitor for retraining"
  answer: "b"
  explanation: "Issuing queries to clarify and correct the dates is the appropriate first step, allowing the site to fix the errors while maintaining data integrity. Locking the database is too extreme, modifying the database compromises standardization, and reporting for retraining should come after addressing the immediate data issues."
  subtopic: "Data Quality Management"
```

## Key Principles for Good Questions

1. **Test Knowledge, Not Memory**: Questions should assess understanding of CDM concepts, not ability to recall specific passages

2. **Stand-Alone Questions**: Each question should make sense without any reference to source material

3. **Professional Context**: Frame questions as they would appear in certification exams or job interviews

4. **Real-World Relevance**: Focus on situations CDM professionals actually encounter

5. **Clear and Direct**: Use industry-standard terminology without referencing "the chapter" or "the text"

## Quick Checklist

Before finalizing any question, ask:
- ✓ Could this question appear on a CDM certification exam?
- ✓ Does it test practical knowledge rather than reading recall?
- ✓ Would the question make sense to someone who hasn't read this specific chapter?
- ✓ Is it phrased professionally without source references?
- ✓ Does it reflect real-world CDM scenarios?

If any answer is "no", revise the question!