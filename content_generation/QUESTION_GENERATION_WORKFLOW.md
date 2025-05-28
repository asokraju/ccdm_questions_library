# Question Generation Workflow

## Step-by-Step Process for Creating Questions

### 1. Prepare the Chapter
- Extract chapter text from PDF (use `pdf_splitter.py` if needed)
- Clean up any formatting issues
- Ensure all important content is included

### 2. Use the Prompt Template
- Open `QUICK_PROMPT_TEMPLATE.md`
- Copy the entire prompt
- Paste your chapter content where indicated
- Send to your preferred LLM (Claude, GPT-4, etc.)

### 3. Review Generated Questions
Check each question for:
- **Accuracy**: Is the content correct?
- **Clarity**: Is the question clear and unambiguous?
- **Difficulty**: Is it appropriately categorized?
- **Options**: Are distractors plausible but clearly wrong?
- **Explanation**: Is it comprehensive and educational?

### 4. Format and Save
1. Create folder: `data/[Chapter_Number]_[Chapter_Name]/`
2. Save as: `questions.yaml`
3. Verify YAML syntax is correct
4. Test in the quiz app

### 5. Quality Assurance
- Take the quiz yourself
- Verify all questions display correctly
- Check that explanations are helpful
- Ensure difficulty feels appropriate

## Example Folder Structure:
```
data/
├── 07_Project_Management_for_the_Clinical_Data_Manager/
│   ├── questions.yaml
│   └── notes.md (optional study notes)
├── 08_Vendor_Selection_and_Management/
│   ├── questions.yaml
│   └── notes.md
```

## Common Issues and Solutions:

### Issue: LLM output is not in correct YAML format
**Solution**: Ask the LLM to reformat, or manually adjust the formatting

### Issue: Questions are too easy or too difficult
**Solution**: Specify the target audience (e.g., "entry-level CDM professionals" or "experienced data managers")

### Issue: Not enough variety in question types
**Solution**: Explicitly request specific question types you want more of

### Issue: Explanations are too brief
**Solution**: Ask for more detailed explanations that reference specific guidelines or provide practical examples

## Tips for Better Results:

1. **Process in Chunks**: For very long chapters, process sections separately
2. **Provide Context**: Tell the LLM about your target audience
3. **Iterate**: Don't hesitate to ask for revisions or improvements
4. **Cross-Reference**: Verify regulatory references are current
5. **Peer Review**: Have another CDM professional review questions if possible

## Sample Chapter Processing:

```bash
# 1. Extract chapter (if needed)
python pdf_splitter.py

# 2. Create folder
mkdir -p data/09_Data_Management_Standards_in_Clinical_Research

# 3. Generate questions using the prompt template
# (Copy prompt, add chapter content, send to LLM)

# 4. Save questions
nano data/09_Data_Management_Standards_in_Clinical_Research/questions.yaml

# 5. Test in app
cd quiz_app
./start.sh
```