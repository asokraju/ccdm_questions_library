# Pydantic AI Architecture for Question Generation

## Why Pydantic AI?

Pydantic AI provides several key advantages for our use case:
- **Type Safety**: Structured outputs with Pydantic models
- **Built-in Validation**: Automatic validation of LLM responses
- **Streaming Support**: Handle large content efficiently
- **Multiple LLM Support**: Easy switching between providers
- **Dependency Injection**: Clean agent composition
- **Testing Support**: Built-in testing utilities

## Updated Architecture

### Core Models

```python
# models.py
from pydantic import BaseModel, Field, validator
from typing import List, Literal, Optional
from datetime import datetime

class QuizOption(BaseModel):
    key: Literal["a", "b", "c", "d"]
    text: str = Field(..., min_length=1, max_length=500)

class QuizQuestion(BaseModel):
    question: str = Field(..., min_length=10, max_length=1000)
    difficulty: Literal["easy", "moderate", "challenging"]
    options: dict[str, str] = Field(..., min_items=4, max_items=4)
    answer: Literal["a", "b", "c", "d"]
    explanation: str = Field(..., min_length=50, max_length=2000)
    subtopic: str = Field(..., min_length=3, max_length=100)
    
    @validator('question')
    def no_reference_phrases(cls, v):
        forbidden_phrases = [
            "according to the chapter",
            "as stated in the text",
            "the book mentions",
            "as given in the book",
            "based on the reading"
        ]
        lower_v = v.lower()
        for phrase in forbidden_phrases:
            if phrase in lower_v:
                raise ValueError(f"Question contains forbidden phrase: '{phrase}'")
        return v
    
    @validator('options')
    def validate_options_keys(cls, v):
        required_keys = {'a', 'b', 'c', 'd'}
        if set(v.keys()) != required_keys:
            raise ValueError("Options must have exactly keys: a, b, c, d")
        return v

class ValidationResult(BaseModel):
    is_valid: bool
    accuracy_score: float = Field(..., ge=0, le=1)
    grounding_score: float = Field(..., ge=0, le=1)
    professional_score: float = Field(..., ge=0, le=1)
    issues: List[str] = Field(default_factory=list)
    suggestions: List[str] = Field(default_factory=list)

class ChapterContent(BaseModel):
    chapter_id: str
    title: str
    sections: List['Section']
    key_concepts: List[str]
    learning_objectives: List[str]
    
class Section(BaseModel):
    title: str
    content: str
    level: int
    subsections: List['Section'] = Field(default_factory=list)

# Update forward refs
ChapterContent.model_rebuild()
Section.model_rebuild()

class GenerationReport(BaseModel):
    chapter_id: str
    timestamp: datetime
    total_questions: int
    valid_questions: int
    difficulty_distribution: dict[str, float]
    avg_validation_score: float
    avg_grounding_score: float
    coverage_topics: List[str]
    generation_time_seconds: float
```

### Pydantic AI Agents

```python
# agents/question_generator_agent.py
from pydantic_ai import Agent, RunContext
from pydantic_ai.dependencies import Depends
from typing import List
import chromadb

from models import QuizQuestion, ChapterContent, Section

# Define dependencies
class QuestionGeneratorDeps:
    def __init__(self, vector_store: chromadb.Client):
        self.vector_store = vector_store
        self.chapter_context: Optional[ChapterContent] = None

question_generator = Agent(
    'openai:gpt-4-turbo-preview',
    result_type=List[QuizQuestion],
    system_prompt=(
        "You are an expert Clinical Data Management educator creating quiz questions. "
        "Rules:\n"
        "1. NEVER use phrases like 'according to the chapter' or reference the source\n"
        "2. Write questions testing real-world CDM knowledge\n"
        "3. Ensure professional framing suitable for certification exams\n"
        "4. Create plausible but clearly incorrect distractors\n"
        "5. Provide comprehensive explanations"
    ),
    deps_type=QuestionGeneratorDeps,
)

@question_generator.tool
async def get_key_concepts(ctx: RunContext[QuestionGeneratorDeps]) -> List[str]:
    """Get key concepts that must be covered in questions"""
    if ctx.deps.chapter_context:
        return ctx.deps.chapter_context.key_concepts
    return []

@question_generator.tool
async def search_similar_content(
    ctx: RunContext[QuestionGeneratorDeps], 
    query: str
) -> List[str]:
    """Search vector store for similar content to ensure variety"""
    results = ctx.deps.vector_store.query(
        query_texts=[query],
        n_results=3
    )
    return results['documents'][0] if results['documents'] else []

async def generate_questions_for_section(
    section: Section,
    num_questions: int = 5,
    deps: QuestionGeneratorDeps = None
) -> List[QuizQuestion]:
    """Generate questions for a specific section"""
    
    prompt = f"""
    Generate {num_questions} quiz questions from this Clinical Data Management content:
    
    Section: {section.title}
    Content: {section.content}
    
    Requirements:
    - Distribute difficulties: ~30% easy, ~50% moderate, ~20% challenging
    - Cover different aspects of the content
    - Ensure questions are practical and relevant to CDM professionals
    - Each question must have exactly 4 options (a, b, c, d)
    """
    
    result = await question_generator.run(prompt, deps=deps)
    return result.data
```

### Validation Agent with Pydantic AI

```python
# agents/validation_agent.py
from pydantic_ai import Agent, RunContext
from models import QuizQuestion, ValidationResult

class ValidationDeps:
    def __init__(self, source_content: str):
        self.source_content = source_content

validation_agent = Agent(
    'openai:gpt-4-turbo-preview',
    result_type=ValidationResult,
    system_prompt=(
        "You are a CDM question quality validator. "
        "Evaluate questions for:\n"
        "1. Factual accuracy against source content\n"
        "2. Professional framing (no reference-based language)\n"
        "3. Clear single correct answer\n"
        "4. Plausible but incorrect distractors\n"
        "5. Comprehensive and accurate explanations"
    ),
    deps_type=ValidationDeps,
)

@validation_agent.tool
async def check_factual_accuracy(
    ctx: RunContext[ValidationDeps],
    question: str,
    answer: str,
    explanation: str
) -> dict:
    """Verify the answer is factually correct based on source"""
    # This tool helps the agent verify facts
    source_excerpt = ctx.deps.source_content[:1000]  # Relevant portion
    return {
        "source_excerpt": source_excerpt,
        "instruction": "Verify if the answer and explanation align with this source"
    }

async def validate_question(
    question: QuizQuestion,
    source_content: str
) -> ValidationResult:
    """Validate a single question"""
    
    prompt = f"""
    Validate this CDM quiz question:
    
    Question: {question.question}
    Options: {question.options}
    Correct Answer: {question.answer}
    Explanation: {question.explanation}
    
    Source content is available in context.
    
    Provide detailed validation with scores (0-1) for:
    - accuracy_score: Is the answer factually correct?
    - grounding_score: Is it well-grounded in the source?
    - professional_score: Is it professionally framed?
    
    List any issues found and suggestions for improvement.
    """
    
    deps = ValidationDeps(source_content=source_content)
    result = await validation_agent.run(prompt, deps=deps)
    return result.data
```

### Grounding Agent with RAG

```python
# agents/grounding_agent.py
from pydantic_ai import Agent
from pydantic import BaseModel, Field
import chromadb
import numpy as np

class GroundingResult(BaseModel):
    score: float = Field(..., ge=0, le=1)
    evidence_chunks: List[str] = Field(default_factory=list)
    confidence: Literal["high", "medium", "low"]
    missing_concepts: List[str] = Field(default_factory=list)

class GroundingAgent:
    def __init__(self, vector_store: chromadb.Client):
        self.vector_store = vector_store
        self.collection = vector_store.get_collection("chapter_content")
    
    async def ground_question(
        self, 
        question: QuizQuestion,
        chapter_id: str
    ) -> GroundingResult:
        """Check if question is grounded in source content"""
        
        # Create comprehensive query
        query_text = f"{question.question} {question.explanation}"
        
        # Search vector store
        results = self.collection.query(
            query_texts=[query_text],
            n_results=5,
            where={"chapter_id": chapter_id}
        )
        
        if not results['distances'][0]:
            return GroundingResult(
                score=0.0,
                confidence="low",
                missing_concepts=self._extract_concepts(question)
            )
        
        # Calculate grounding score
        distances = results['distances'][0]
        # Convert distances to similarity scores (assuming cosine distance)
        similarities = [1 - d for d in distances]
        avg_similarity = np.mean(similarities)
        
        # Determine confidence
        if avg_similarity > 0.8:
            confidence = "high"
        elif avg_similarity > 0.6:
            confidence = "medium"
        else:
            confidence = "low"
        
        return GroundingResult(
            score=avg_similarity,
            evidence_chunks=results['documents'][0][:3],  # Top 3 chunks
            confidence=confidence,
            missing_concepts=self._identify_missing_concepts(
                question, results['documents'][0]
            )
        )
    
    def _extract_concepts(self, question: QuizQuestion) -> List[str]:
        """Extract key concepts from question"""
        # Simple implementation - could use NER or keyword extraction
        concepts = []
        # Extract from question and explanation
        text = f"{question.question} {question.explanation}"
        # Basic concept extraction logic here
        return concepts
    
    def _identify_missing_concepts(
        self, 
        question: QuizQuestion,
        evidence_chunks: List[str]
    ) -> List[str]:
        """Identify concepts in question not found in evidence"""
        # Compare question concepts with evidence
        missing = []
        # Implementation here
        return missing
```

### Main Pipeline with Pydantic AI

```python
# pipeline.py
import asyncio
from typing import List
from pathlib import Path
import typer
from rich.console import Console
from pydantic_ai import Agent
import chromadb
from datetime import datetime
import time

from models import QuizQuestion, ChapterContent, GenerationReport
from agents.question_generator_agent import (
    generate_questions_for_section, 
    QuestionGeneratorDeps
)
from agents.validation_agent import validate_question
from agents.grounding_agent import GroundingAgent

console = Console()
app = typer.Typer()

class QuestionPipeline:
    def __init__(self, llm_model: str = "openai:gpt-4-turbo-preview"):
        self.llm_model = llm_model
        self.vector_store = chromadb.PersistentClient(path="./chroma_db")
        self.grounder = GroundingAgent(self.vector_store)
        
    async def process_chapter(
        self, 
        chapter_content: ChapterContent
    ) -> tuple[List[QuizQuestion], GenerationReport]:
        """Process a chapter and generate validated questions"""
        
        start_time = time.time()
        all_questions = []
        
        # Create dependencies
        deps = QuestionGeneratorDeps(self.vector_store)
        deps.chapter_context = chapter_content
        
        # Generate questions for each section
        for section in chapter_content.sections:
            console.print(f"[blue]Generating questions for: {section.title}[/blue]")
            
            # Generate questions
            questions = await generate_questions_for_section(
                section=section,
                num_questions=5,
                deps=deps
            )
            
            # Validate and ground each question
            for q in questions:
                # Validate
                validation = await validate_question(q, section.content)
                
                if validation.is_valid and validation.accuracy_score > 0.8:
                    # Ground the question
                    grounding = await self.grounder.ground_question(
                        q, chapter_content.chapter_id
                    )
                    
                    if grounding.score > 0.7:
                        all_questions.append(q)
                        console.print(f"[green]✓ Added question: {q.question[:50]}...[/green]")
                    else:
                        console.print(f"[yellow]⚠ Low grounding score: {q.question[:50]}...[/yellow]")
                else:
                    console.print(f"[red]✗ Invalid question: {validation.issues}[/red]")
        
        # Generate report
        report = self._generate_report(
            chapter_content.chapter_id,
            all_questions,
            time.time() - start_time
        )
        
        return all_questions, report
    
    def _generate_report(
        self,
        chapter_id: str,
        questions: List[QuizQuestion],
        generation_time: float
    ) -> GenerationReport:
        """Generate quality report"""
        
        # Calculate difficulty distribution
        difficulty_counts = {"easy": 0, "moderate": 0, "challenging": 0}
        for q in questions:
            difficulty_counts[q.difficulty] += 1
        
        total = len(questions)
        difficulty_dist = {
            k: v/total if total > 0 else 0 
            for k, v in difficulty_counts.items()
        }
        
        # Get unique topics
        topics = list(set(q.subtopic for q in questions))
        
        return GenerationReport(
            chapter_id=chapter_id,
            timestamp=datetime.now(),
            total_questions=total,
            valid_questions=total,
            difficulty_distribution=difficulty_dist,
            avg_validation_score=0.9,  # Would calculate from actual scores
            avg_grounding_score=0.85,   # Would calculate from actual scores
            coverage_topics=topics,
            generation_time_seconds=generation_time
        )

@app.command()
def generate(
    pdf_path: Path = typer.Argument(..., help="PDF chapter to process"),
    output_dir: Path = typer.Argument(..., help="Output directory")
):
    """Generate questions for a chapter"""
    
    async def _run():
        # 1. Parse PDF with Docling
        from docling import Document
        doc = Document()
        parsed = doc.load(str(pdf_path))
        
        # 2. Convert to our ChapterContent model
        chapter_content = ChapterContent(
            chapter_id=pdf_path.stem,
            title=parsed.title,
            sections=[],  # Would populate from parsed content
            key_concepts=[],  # Would extract
            learning_objectives=[]  # Would extract
        )
        
        # 3. Run pipeline
        pipeline = QuestionPipeline()
        questions, report = await pipeline.process_chapter(chapter_content)
        
        # 4. Save outputs
        import yaml
        import json
        
        output_path = output_dir / chapter_content.chapter_id
        output_path.mkdir(parents=True, exist_ok=True)
        
        # Save questions
        questions_data = [q.model_dump() for q in questions]
        with open(output_path / "questions.yaml", 'w') as f:
            yaml.dump(questions_data, f, default_flow_style=False)
        
        # Save report
        with open(output_path / "report.json", 'w') as f:
            json.dump(report.model_dump(), f, indent=2)
        
        console.print(f"[bold green]✓ Generated {len(questions)} questions![/bold green]")
        console.print(f"[blue]Report saved to: {output_path / 'report.json'}[/blue]")
    
    asyncio.run(_run())

if __name__ == "__main__":
    app()
```

### Key Benefits of Pydantic AI Approach

1. **Type Safety**: All inputs/outputs are validated Pydantic models
2. **Structured Outputs**: Guaranteed valid question format
3. **Built-in Validation**: Automatic checking of constraints
4. **Clean Testing**: Easy to test with mock agents
5. **Streaming**: Can handle large documents efficiently
6. **Multi-LLM**: Easy to switch between providers

### Testing with Pydantic AI

```python
# tests/test_agents.py
import pytest
from pydantic_ai.testing import TestModel

from agents.question_generator_agent import question_generator
from models import QuizQuestion

@pytest.mark.asyncio
async def test_question_generation():
    """Test question generation with mock model"""
    
    mock_questions = [
        QuizQuestion(
            question="What is the primary purpose of a DMP?",
            difficulty="easy",
            options={
                "a": "To manage data",
                "b": "To track costs", 
                "c": "To schedule visits",
                "d": "To recruit patients"
            },
            answer="a",
            explanation="A DMP manages clinical trial data...",
            subtopic="Data Management Planning"
        )
    ]
    
    with TestModel(question_generator) as mock_model:
        mock_model.set_result(mock_questions)
        
        result = await question_generator.run("Generate questions about DMP")
        
        assert len(result.data) == 1
        assert result.data[0].question == "What is the primary purpose of a DMP?"
        assert "according to" not in result.data[0].question.lower()
```

This Pydantic AI approach provides much better structure, type safety, and maintainability for the agent system!