# Automated Question Generation System

## Overview
This system automates the generation, validation, and grounding of CDM quiz questions using:
- **Docling**: For PDF content extraction
- **LLM APIs**: For intelligent question generation
- **ChromaDB**: For RAG-based grounding
- **Multi-Agent Architecture**: For specialized tasks

## Quick Start

### 1. Installation
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Configuration
```bash
# Create .env file
cp .env.example .env

# Add your API keys
OPENAI_API_KEY=your_key_here
# Or for local models:
LLM_API_BASE=http://localhost:8080/v1
```

### 3. Generate Questions
```bash
# Process all chapters
python pipeline.py generate split_chapters/ data/

# Process specific chapters
python pipeline.py generate split_chapters/ data/ --chapters 07_Project_Management 08_Vendor_Selection

# Evaluate existing questions
python pipeline.py evaluate data/

# Fix issues in existing questions
python pipeline.py evaluate data/ --fix
```

## Architecture

### Multi-Agent System
1. **Content Processor**: Extracts and structures PDF content
2. **Question Generator**: Creates questions following CDM best practices
3. **Validator**: Ensures accuracy and quality
4. **Grounder**: Verifies questions are based on source content

### RAG System
- Uses ChromaDB for vector storage
- Grounds every question in source material
- Enables citation and fact-checking

### Quality Metrics
- Content coverage score
- Grounding score (RAG relevance)
- Difficulty distribution
- Professional framing compliance

## Key Features

### ✅ Prevents Common Issues
- No "according to the chapter" phrasing
- No reading comprehension questions
- Professional, exam-style framing

### 📊 Comprehensive Reporting
- Generation metrics per chapter
- Quality scores for each question
- Coverage analysis
- Issue identification

### 🔄 Continuous Improvement
- Evaluate existing questions
- Automatically fix common issues
- Track quality over time

## Example Output

### Generated Question
```yaml
- question: "What is the primary purpose of risk-based monitoring in clinical trials?"
  difficulty: "moderate"
  options:
    a: "To reduce overall study costs by limiting site visits"
    b: "To focus monitoring resources on critical data and processes"
    c: "To eliminate the need for on-site monitoring visits"
    d: "To increase the frequency of central monitoring activities"
  answer: "b"
  explanation: "Risk-based monitoring aims to focus monitoring resources on critical data and processes that affect patient safety and data quality. While it may reduce costs (option A), this is a secondary benefit. It doesn't eliminate on-site visits (option C) but optimizes them. Option D is incorrect as frequency depends on identified risks."
  subtopic: "Risk-Based Monitoring"
  validation_score: 0.95
  grounding_score: 0.88
```

### Generation Report
```json
{
  "chapter_id": "07_Project_Management",
  "total_questions": 28,
  "difficulty_distribution": {
    "easy": 0.32,
    "moderate": 0.50,
    "challenging": 0.18
  },
  "avg_validation_score": 0.92,
  "avg_grounding_score": 0.85,
  "subtopic_coverage": [
    "Project Planning",
    "Risk Management",
    "Resource Allocation",
    "Timeline Management"
  ]
}
```

## Development

### Running Tests
```bash
pytest tests/ -v
```

### Adding New Agents
1. Extend `BaseAgent` class
2. Implement `_get_system_prompt()`
3. Add agent-specific methods
4. Integrate into pipeline

### Customizing Prompts
Edit system prompts in `agents/` to adjust:
- Question style
- Difficulty criteria
- Validation rules
- Grounding thresholds

## Deployment Options

### 1. CLI Tool (Current)
- Run locally via command line
- Process chapters on-demand
- Suitable for development

### 2. API Service
```bash
# Coming soon
uvicorn api:app --reload
```

### 3. GitHub Actions
- Automated validation on PR
- Scheduled quality checks
- See `.github/workflows/`

## Troubleshooting

### Common Issues

1. **"No module named 'docling'"**
   - Ensure you're in the virtual environment
   - Run `pip install -r requirements.txt`

2. **API Rate Limits**
   - Implement retry logic (included)
   - Use local models for high volume

3. **Low Grounding Scores**
   - Check if content is properly indexed
   - Adjust chunk size in vector store

4. **Memory Issues**
   - Process chapters individually
   - Reduce batch size in settings

## Future Enhancements

- [ ] Web UI for question review
- [ ] Support for multiple LLM providers
- [ ] Advanced analytics dashboard
- [ ] Integration with quiz app
- [ ] Collaborative review workflow
- [ ] Multi-language support

## Contributing

1. Create feature branch
2. Add tests for new functionality
3. Ensure all tests pass
4. Submit PR with description

## License

Part of the CCDM Questions Library project.