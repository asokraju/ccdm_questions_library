# Automated Question Generation & Validation System

## Overview
A comprehensive system that uses Docling for PDF content extraction and LLM APIs for intelligent question generation, validation, and grounding.

## System Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   PDF Chapters  │────▶│     Docling      │────▶│  Structured     │
│  (split_chapters│     │  Content Parser  │     │    Content      │
│    directory)   │     └──────────────────┘     └────────┬────────┘
└─────────────────┘                                        │
                                                          ▼
                        ┌──────────────────────────────────────────┐
                        │         Content Processor               │
                        │  - Chapter segmentation                 │
                        │  - Key concept extraction               │
                        │  - Learning objective identification   │
                        └────────────────┬─────────────────────────┘
                                        │
                  ┌─────────────────────┴─────────────────────┐
                  ▼                                           ▼
        ┌─────────────────┐                        ┌──────────────────┐
        │ Question Agent  │                        │ Validation Agent │
        │ - Generate Q&A  │                        │ - Check accuracy │
        │ - Apply rules  │                        │ - Verify grounding│
        │ - Format YAML  │                        │ - Score quality  │
        └────────┬────────┘                        └────────┬─────────┘
                 │                                           │
                 └─────────────┬─────────────────────────────┘
                               ▼
                    ┌───────────────────┐
                    │  Grounding Agent  │
                    │ - RAG validation  │
                    │ - Citation check  │
                    │ - Fact alignment │
                    └─────────┬─────────┘
                              ▼
                    ┌───────────────────┐
                    │ Quality Metrics   │
                    │ - Completeness    │
                    │ - Accuracy       │
                    │ - Difficulty     │
                    └─────────┬─────────┘
                              ▼
                    ┌───────────────────┐
                    │  Final Output     │
                    │ - questions.yaml  │
                    │ - validation.json │
                    └───────────────────┘
```

## Components

### 1. Docling Integration
- Extract structured content from PDFs
- Preserve formatting, tables, and hierarchies
- Generate searchable content index

### 2. Multi-Agent System

#### Content Processing Agent
```python
class ContentProcessor:
    def extract_key_concepts(content):
        # Identify definitions, processes, regulations
        pass
    
    def identify_learning_objectives(content):
        # Extract what professionals need to know
        pass
    
    def segment_by_topic(content):
        # Break into logical sections
        pass
```

#### Question Generation Agent
```python
class QuestionGenerator:
    def generate_questions(segment, difficulty_distribution):
        # Create questions following our rules
        # No "according to chapter" phrases
        # Professional framing
        pass
    
    def ensure_coverage(questions, key_concepts):
        # Verify all important topics covered
        pass
```

#### Validation Agent
```python
class ValidationAgent:
    def validate_factual_accuracy(question, source_content):
        # Check answer correctness
        pass
    
    def validate_distractors(options, correct_answer):
        # Ensure plausible but incorrect options
        pass
    
    def check_professional_framing(question):
        # No reference-based phrasing
        pass
```

#### Grounding Agent (RAG-based)
```python
class GroundingAgent:
    def __init__(self, vector_store):
        self.vector_store = vector_store
    
    def ground_question(question, chapter_content):
        # Find supporting evidence
        # Return relevance score
        pass
    
    def verify_explanation(explanation, source_chunks):
        # Ensure explanation aligns with source
        pass
```

### 3. RAG System Design

Yes, RAG is essential for:
- **Grounding validation**: Ensuring questions are based on actual content
- **Citation checking**: Verifying explanations reference correct information
- **Coverage analysis**: Identifying gaps in question coverage
- **Cross-reference validation**: Checking consistency across chapters

#### Vector Database Structure
```
Collections:
- chapter_content: Full text chunks with metadata
- key_concepts: Extracted important terms/definitions
- regulations: Specific regulatory references
- processes: Step-by-step procedures
```

### 4. Evaluation Metrics

#### Question Quality Metrics
```python
class QualityMetrics:
    def calculate_metrics(question_set):
        return {
            "content_coverage": 0.85,  # % of key concepts covered
            "difficulty_balance": {
                "easy": 0.30,
                "moderate": 0.50,
                "challenging": 0.20
            },
            "grounding_score": 0.92,  # Average RAG relevance
            "format_compliance": 1.0,  # YAML format correctness
            "professional_framing": 0.98  # No reference phrases
        }
```

#### Validation Criteria
1. **Factual Accuracy**: Answer must be verifiably correct
2. **Grounding Score**: >0.8 relevance to source content
3. **Distractor Quality**: All options plausible but clearly wrong
4. **Coverage Completeness**: All learning objectives addressed
5. **Professional Language**: No academic/reference phrasing

### 5. Implementation Pipeline

```python
class QuestionGenerationPipeline:
    def __init__(self, llm_client, vector_store):
        self.docling = DoclingParser()
        self.content_processor = ContentProcessor(llm_client)
        self.question_generator = QuestionGenerator(llm_client)
        self.validator = ValidationAgent(llm_client)
        self.grounder = GroundingAgent(vector_store)
    
    def process_chapter(self, pdf_path):
        # 1. Extract content
        content = self.docling.parse(pdf_path)
        
        # 2. Process and index
        structured_content = self.content_processor.process(content)
        self.vector_store.index(structured_content)
        
        # 3. Generate questions
        questions = self.question_generator.generate(structured_content)
        
        # 4. Validate and ground
        validated_questions = []
        for q in questions:
            if self.validator.validate(q):
                grounding = self.grounder.ground(q, content)
                if grounding.score > 0.8:
                    validated_questions.append(q)
        
        # 5. Calculate metrics
        metrics = QualityMetrics.calculate(validated_questions)
        
        return validated_questions, metrics
```

### 6. Existing Question Evaluation

```python
class ExistingQuestionEvaluator:
    def evaluate_and_improve(self, existing_questions, chapter_content):
        improved_questions = []
        
        for q in existing_questions:
            # Check for reference-based phrasing
            if self.has_reference_phrasing(q):
                q = self.reframe_professionally(q)
            
            # Validate grounding
            grounding = self.grounder.ground(q, chapter_content)
            if grounding.score < 0.8:
                q = self.improve_grounding(q, grounding.suggestions)
            
            # Verify answer accuracy
            if not self.validator.validate_answer(q, chapter_content):
                q = self.correct_answer(q, chapter_content)
            
            improved_questions.append(q)
        
        return improved_questions
```

## Technology Stack

### Core Dependencies
```toml
[dependencies]
docling = "^1.0.0"          # PDF parsing
openai = "^1.0.0"           # LLM API
chromadb = "^0.4.0"         # Vector store
pydantic = "^2.0.0"         # Data validation
pytest = "^7.0.0"           # Testing
rich = "^13.0.0"            # CLI interface
```

### LLM Configuration
```python
LLM_CONFIG = {
    "model": "gpt-4-turbo-preview",  # or local model
    "temperature": 0.3,  # Lower for consistency
    "max_tokens": 2000,
    "system_prompts": {
        "generator": "You are a CDM education expert...",
        "validator": "You validate CDM questions...",
        "grounder": "You verify factual grounding..."
    }
}
```

## Deployment Options

### 1. CLI Tool
```bash
# Generate questions for a chapter
python generate_questions.py --chapter "07_Project_Management.pdf" --output "data/07_Project_Management/questions.yaml"

# Evaluate existing questions
python evaluate_questions.py --input "data/*/questions.yaml" --fix-issues

# Run full pipeline
python pipeline.py --input-dir "split_chapters/" --output-dir "data/"
```

### 2. API Service
```python
from fastapi import FastAPI

app = FastAPI()

@app.post("/generate")
async def generate_questions(chapter_path: str):
    # Process and return questions
    pass

@app.post("/evaluate")
async def evaluate_questions(questions: List[dict]):
    # Evaluate and return improvements
    pass
```

### 3. GitHub Action
```yaml
name: Question Quality Check
on:
  pull_request:
    paths:
      - 'data/**/questions.yaml'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Validate Questions
        run: |
          python evaluate_questions.py --check-only
```

## Benefits of This Approach

1. **Consistency**: All questions follow the same high standards
2. **Grounding**: Every question traceable to source content
3. **Scalability**: Process entire books automatically
4. **Quality Assurance**: Automated validation catches issues
5. **Continuous Improvement**: Existing questions can be enhanced
6. **Metrics**: Quantifiable quality measurements

## Next Steps

1. Set up development environment
2. Implement Docling integration
3. Create LLM agent classes
4. Build RAG system with ChromaDB
5. Develop evaluation metrics
6. Create CLI interface
7. Test with sample chapters
8. Deploy as service/tool