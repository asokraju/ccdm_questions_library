# Implementation Plan for Automated Question Generation

## Phase 1: Foundation (Week 1-2)

### 1.1 Environment Setup
```bash
# Create Python environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install docling openai chromadb pydantic pytest rich typer
```

### 1.2 Docling Integration
```python
# docling_processor.py
from docling import Document
from typing import List, Dict

class DoclingProcessor:
    def __init__(self):
        self.parser = Document()
    
    def extract_chapter_content(self, pdf_path: str) -> Dict:
        """Extract structured content from PDF"""
        doc = self.parser.load(pdf_path)
        
        return {
            "title": doc.title,
            "sections": self._extract_sections(doc),
            "tables": self._extract_tables(doc),
            "key_points": self._extract_key_points(doc),
            "metadata": {
                "page_count": doc.page_count,
                "chapter_number": self._extract_chapter_number(pdf_path)
            }
        }
    
    def _extract_sections(self, doc) -> List[Dict]:
        """Extract hierarchical sections with content"""
        sections = []
        for section in doc.sections:
            sections.append({
                "title": section.title,
                "content": section.text,
                "level": section.level,
                "subsections": self._extract_subsections(section)
            })
        return sections
```

### 1.3 Vector Store Setup
```python
# vector_store.py
import chromadb
from chromadb.utils import embedding_functions

class CDMVectorStore:
    def __init__(self, persist_directory="./chroma_db"):
        self.client = chromadb.PersistentClient(path=persist_directory)
        self.embedding_function = embedding_functions.OpenAIEmbeddingFunction(
            api_key="your-api-key",
            model_name="text-embedding-ada-002"
        )
        
        # Create collections
        self.collections = {
            "content": self._create_collection("chapter_content"),
            "concepts": self._create_collection("key_concepts"),
            "questions": self._create_collection("generated_questions")
        }
    
    def _create_collection(self, name: str):
        return self.client.get_or_create_collection(
            name=name,
            embedding_function=self.embedding_function
        )
    
    def index_chapter(self, chapter_id: str, content: Dict):
        """Index chapter content for RAG"""
        # Index main content
        for section in content["sections"]:
            self.collections["content"].add(
                documents=[section["content"]],
                metadatas=[{
                    "chapter_id": chapter_id,
                    "section_title": section["title"],
                    "type": "section"
                }],
                ids=[f"{chapter_id}_{section['title']}"]
            )
```

## Phase 2: Agent Development (Week 2-3)

### 2.1 Base Agent Class
```python
# agents/base_agent.py
from abc import ABC, abstractmethod
from openai import OpenAI

class BaseAgent(ABC):
    def __init__(self, model="gpt-4-turbo-preview"):
        self.client = OpenAI()
        self.model = model
        self.system_prompt = self._get_system_prompt()
    
    @abstractmethod
    def _get_system_prompt(self) -> str:
        pass
    
    def _call_llm(self, user_prompt: str, temperature=0.3) -> str:
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": self.system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=temperature
        )
        return response.choices[0].message.content
```

### 2.2 Question Generation Agent
```python
# agents/question_generator.py
from typing import List, Dict
import yaml

class QuestionGeneratorAgent(BaseAgent):
    def _get_system_prompt(self) -> str:
        return """You are an expert Clinical Data Management educator.
        Generate quiz questions that:
        1. Test real-world CDM knowledge (never use "according to the chapter")
        2. Follow professional framing suitable for certification exams
        3. Include clear explanations
        4. Have plausible but incorrect distractors
        
        Output in YAML format with fields: question, difficulty, options (a,b,c,d), answer, explanation, subtopic"""
    
    def generate_questions(self, content_chunk: str, num_questions: int = 5) -> List[Dict]:
        prompt = f"""Generate {num_questions} CDM quiz questions from this content:
        
        {content_chunk}
        
        Ensure:
        - Mix of difficulty levels (easy/moderate/challenging)
        - No reference to source material
        - Professional language
        - Practical relevance"""
        
        response = self._call_llm(prompt)
        return yaml.safe_load(response)
```

### 2.3 Validation Agent
```python
# agents/validator.py
class ValidationAgent(BaseAgent):
    def _get_system_prompt(self) -> str:
        return """You are a CDM question quality validator.
        Check for:
        1. Factual accuracy
        2. No reference-based phrasing
        3. Clear single correct answer
        4. Plausible distractors
        5. Professional language"""
    
    def validate_question(self, question: Dict, source_content: str) -> Dict:
        prompt = f"""Validate this CDM question against the source content:
        
        Question: {question}
        
        Source: {source_content}
        
        Return validation results with scores for:
        - accuracy (0-1)
        - professional_framing (0-1)
        - distractor_quality (0-1)
        - explanation_quality (0-1)
        - issues (list of problems if any)"""
        
        response = self._call_llm(prompt)
        return json.loads(response)
```

### 2.4 Grounding Agent
```python
# agents/grounder.py
class GroundingAgent:
    def __init__(self, vector_store: CDMVectorStore):
        self.vector_store = vector_store
    
    def ground_question(self, question: Dict, chapter_id: str) -> Dict:
        """Find supporting evidence for question in source"""
        # Search for relevant content
        query = f"{question['question']} {question['explanation']}"
        results = self.vector_store.collections["content"].query(
            query_texts=[query],
            n_results=3,
            where={"chapter_id": chapter_id}
        )
        
        # Calculate grounding score
        if results['distances'][0]:
            # Lower distance = higher relevance
            avg_distance = sum(results['distances'][0]) / len(results['distances'][0])
            grounding_score = 1 - min(avg_distance, 1)  # Convert to 0-1 score
        else:
            grounding_score = 0
        
        return {
            "score": grounding_score,
            "evidence": results['documents'][0] if results['documents'] else [],
            "metadata": results['metadatas'][0] if results['metadatas'] else []
        }
```

## Phase 3: Pipeline Integration (Week 3-4)

### 3.1 Main Pipeline
```python
# pipeline.py
import typer
from pathlib import Path
from rich.progress import track
from rich.console import Console

app = typer.Typer()
console = Console()

class QuestionGenerationPipeline:
    def __init__(self):
        self.docling = DoclingProcessor()
        self.vector_store = CDMVectorStore()
        self.generator = QuestionGeneratorAgent()
        self.validator = ValidationAgent()
        self.grounder = GroundingAgent(self.vector_store)
    
    def process_chapter(self, pdf_path: Path, output_dir: Path):
        console.print(f"[bold blue]Processing {pdf_path.name}...[/bold blue]")
        
        # 1. Extract content
        content = self.docling.extract_chapter_content(str(pdf_path))
        chapter_id = pdf_path.stem
        
        # 2. Index in vector store
        self.vector_store.index_chapter(chapter_id, content)
        
        # 3. Generate questions for each section
        all_questions = []
        for section in track(content["sections"], description="Generating questions"):
            questions = self.generator.generate_questions(
                section["content"],
                num_questions=5
            )
            
            # 4. Validate and ground each question
            for q in questions:
                validation = self.validator.validate_question(q, section["content"])
                grounding = self.grounder.ground_question(q, chapter_id)
                
                if validation["accuracy"] > 0.8 and grounding["score"] > 0.7:
                    q["validation_score"] = validation["accuracy"]
                    q["grounding_score"] = grounding["score"]
                    all_questions.append(q)
        
        # 5. Save results
        output_file = output_dir / chapter_id / "questions.yaml"
        output_file.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_file, 'w') as f:
            yaml.dump(all_questions, f, default_flow_style=False)
        
        console.print(f"[green]✓ Generated {len(all_questions)} questions[/green]")
        
        # 6. Generate report
        self._generate_report(chapter_id, all_questions, output_dir)
    
    def _generate_report(self, chapter_id: str, questions: List[Dict], output_dir: Path):
        """Generate quality metrics report"""
        report = {
            "chapter_id": chapter_id,
            "total_questions": len(questions),
            "difficulty_distribution": self._calculate_difficulty_dist(questions),
            "avg_validation_score": sum(q["validation_score"] for q in questions) / len(questions),
            "avg_grounding_score": sum(q["grounding_score"] for q in questions) / len(questions),
            "subtopic_coverage": self._calculate_coverage(questions)
        }
        
        report_file = output_dir / chapter_id / "generation_report.json"
        with open(report_file, 'w') as f:
            json.dump(report, f, indent=2)

@app.command()
def generate(
    input_dir: Path = typer.Argument(..., help="Directory with PDF chapters"),
    output_dir: Path = typer.Argument(..., help="Output directory for questions"),
    chapters: List[str] = typer.Option(None, help="Specific chapters to process")
):
    """Generate questions for CDM chapters"""
    pipeline = QuestionGenerationPipeline()
    
    pdf_files = list(input_dir.glob("*.pdf"))
    if chapters:
        pdf_files = [f for f in pdf_files if f.stem in chapters]
    
    for pdf_file in pdf_files:
        pipeline.process_chapter(pdf_file, output_dir)
    
    console.print("[bold green]✓ Question generation complete![/bold green]")

@app.command()
def evaluate(
    questions_dir: Path = typer.Argument(..., help="Directory with existing questions"),
    fix: bool = typer.Option(False, help="Fix issues found")
):
    """Evaluate and optionally fix existing questions"""
    evaluator = ExistingQuestionEvaluator()
    
    yaml_files = list(questions_dir.glob("**/questions.yaml"))
    
    for yaml_file in yaml_files:
        console.print(f"[bold blue]Evaluating {yaml_file}...[/bold blue]")
        
        with open(yaml_file, 'r') as f:
            questions = yaml.safe_load(f)
        
        issues = evaluator.evaluate_questions(questions)
        
        if issues and fix:
            fixed_questions = evaluator.fix_questions(questions, issues)
            
            # Backup original
            backup_file = yaml_file.with_suffix('.yaml.bak')
            yaml_file.rename(backup_file)
            
            # Save fixed version
            with open(yaml_file, 'w') as f:
                yaml.dump(fixed_questions, f, default_flow_style=False)
            
            console.print(f"[green]✓ Fixed {len(issues)} issues[/green]")
        elif issues:
            console.print(f"[yellow]⚠ Found {len(issues)} issues[/yellow]")
            for issue in issues[:5]:  # Show first 5
                console.print(f"  - {issue}")

if __name__ == "__main__":
    app()
```

## Phase 4: Testing & Deployment (Week 4)

### 4.1 Unit Tests
```python
# tests/test_agents.py
import pytest
from agents.question_generator import QuestionGeneratorAgent

def test_question_generation():
    generator = QuestionGeneratorAgent()
    content = "The Data Management Plan (DMP) is a comprehensive document..."
    
    questions = generator.generate_questions(content, num_questions=2)
    
    assert len(questions) == 2
    assert all(q.get("question") for q in questions)
    assert all(q.get("difficulty") in ["easy", "moderate", "challenging"] for q in questions)
    assert all("according to" not in q["question"].lower() for q in questions)
```

### 4.2 GitHub Action
```yaml
# .github/workflows/question_quality.yml
name: Question Quality Check

on:
  pull_request:
    paths:
      - 'data/**/questions.yaml'
  workflow_dispatch:

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.10'
      
      - name: Install dependencies
        run: |
          pip install -r requirements.txt
      
      - name: Run validation
        run: |
          python pipeline.py evaluate data/ --no-fix
      
      - name: Upload report
        uses: actions/upload-artifact@v3
        with:
          name: validation-report
          path: validation_report.json
```

## Benefits Summary

1. **Automated Generation**: Process entire books in hours vs weeks
2. **Quality Assurance**: Every question validated and grounded
3. **Consistency**: Eliminates "according to chapter" issues
4. **Scalability**: Handle hundreds of chapters efficiently
5. **Continuous Improvement**: Existing questions enhanced automatically
6. **Metrics & Reporting**: Track quality over time
7. **Version Control**: All changes tracked in Git

This system provides a robust, scalable solution for generating high-quality CDM quiz questions while maintaining consistency and accuracy.