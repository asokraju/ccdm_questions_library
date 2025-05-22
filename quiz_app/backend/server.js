const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const yaml = require('js-yaml');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// In-memory storage for user progress (in production, use a database)
let userProgress = {
  correct: 0,
  incorrect: 0,
  answerHistory: [],
  topicStats: {}, // stats by topic
  subtopicStats: {} // stats by subtopic
};

// Load questions from YAML files
async function loadQuestions() {
  const questionsData = [];
  const dataDir = path.join(__dirname, '../../data');
  
  try {
    const topics = await fs.readdir(dataDir);
    
    for (const topic of topics) {
      const topicPath = path.join(dataDir, topic);
      const stat = await fs.stat(topicPath);
      
      if (stat.isDirectory()) {
        const questionsFile = path.join(topicPath, 'questions.yaml');
        
        try {
          const fileContent = await fs.readFile(questionsFile, 'utf8');
          const questions = yaml.load(fileContent);
          
          // Normalize the questions to a common format and add topic
          const normalizedQuestions = questions.map((q, index) => {
            // Handle different key formats (answer vs correct_answer)
            const correctAnswer = q.answer || q.correct_answer;
            
            // Normalize options to always use lowercase keys
            let options = {};
            if (q.options.a !== undefined) {
              options = q.options;
            } else {
              // Convert A, B, C, D to a, b, c, d
              for (const key in q.options) {
                options[key.toLowerCase()] = q.options[key];
              }
            }
            
            return {
              id: `${topic}_${index}`,
              topic: topic.replace(/_/g, ' '),
              subtopic: q.subtopic,
              question: q.question,
              difficulty: q.difficulty,
              options,
              correctAnswer: correctAnswer.toLowerCase(),
              explanation: q.explanation
            };
          });
          
          questionsData.push(...normalizedQuestions);
        } catch (error) {
          console.error(`Error loading questions from ${questionsFile}:`, error);
        }
      }
    }
  } catch (error) {
    console.error('Error loading questions:', error);
  }
  
  return questionsData;
}

// Initialize questions on server start
let allQuestions = [];
loadQuestions().then(questions => {
  allQuestions = questions;
  console.log(`Loaded ${questions.length} questions`);
});

// API Endpoints

// Get all topics
app.get('/api/topics', (req, res) => {
  const topics = [...new Set(allQuestions.map(q => q.topic))];
  res.json(topics);
});

// Get questions by topic
app.get('/api/questions', (req, res) => {
  const { topic, difficulty, limit } = req.query;
  let filteredQuestions = [...allQuestions];
  
  if (topic && topic !== 'all') {
    filteredQuestions = filteredQuestions.filter(q => q.topic === topic);
  }
  
  if (difficulty) {
    filteredQuestions = filteredQuestions.filter(q => q.difficulty === difficulty);
  }
  
  // Shuffle questions
  filteredQuestions.sort(() => Math.random() - 0.5);
  
  if (limit) {
    filteredQuestions = filteredQuestions.slice(0, parseInt(limit));
  }
  
  res.json(filteredQuestions);
});

// Submit answer
app.post('/api/answer', (req, res) => {
  const { questionId, answer, topic, subtopic, isCorrect } = req.body;
  
  // Update overall progress
  if (isCorrect) {
    userProgress.correct++;
  } else {
    userProgress.incorrect++;
  }
  
  // Update topic stats
  if (!userProgress.topicStats[topic]) {
    userProgress.topicStats[topic] = { correct: 0, incorrect: 0 };
  }
  userProgress.topicStats[topic][isCorrect ? 'correct' : 'incorrect']++;
  
  // Update subtopic stats
  if (!userProgress.subtopicStats[subtopic]) {
    userProgress.subtopicStats[subtopic] = { correct: 0, incorrect: 0 };
  }
  userProgress.subtopicStats[subtopic][isCorrect ? 'correct' : 'incorrect']++;
  
  // Add to answer history
  userProgress.answerHistory.push({
    questionId,
    answer,
    isCorrect,
    timestamp: new Date().toISOString()
  });
  
  res.json({ success: true });
});

// Get user progress
app.get('/api/progress', (req, res) => {
  res.json(userProgress);
});

// Get reviews (questions answered incorrectly)
app.get('/api/reviews', (req, res) => {
  const incorrectQuestionIds = userProgress.answerHistory
    .filter(h => !h.isCorrect)
    .map(h => h.questionId);
  
  const reviewQuestions = allQuestions.filter(q => 
    incorrectQuestionIds.includes(q.id)
  );
  
  res.json(reviewQuestions);
});

// Reset progress
app.post('/api/reset', (req, res) => {
  userProgress = {
    correct: 0,
    incorrect: 0,
    answerHistory: [],
    topicStats: {},
    subtopicStats: {}
  };
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});