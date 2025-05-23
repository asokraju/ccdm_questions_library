const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const yaml = require('js-yaml');
const database = require('./db/database');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize database on startup
database.initialize().catch(console.error);

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
  const { questionId, answer, topic, subtopic, isCorrect, comment } = req.body;
  
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
  
  // Add to answer history with comment
  userProgress.answerHistory.push({
    questionId,
    answer,
    isCorrect,
    comment: comment || '',
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
  const incorrectAnswers = userProgress.answerHistory
    .filter(h => !h.isCorrect);
  
  const reviewQuestions = incorrectAnswers.map(answer => {
    const question = allQuestions.find(q => q.id === answer.questionId);
    if (question) {
      return {
        ...question,
        userAnswer: answer.answer,
        userComment: answer.comment,
        answeredAt: answer.timestamp
      };
    }
    return null;
  }).filter(q => q !== null);
  
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

// Notes API endpoints
app.get('/api/notes/topics', async (req, res) => {
  try {
    const dataDir = path.join(__dirname, '../../data');
    const topics = [];
    
    const topicDirs = await fs.readdir(dataDir);
    
    for (const topicDir of topicDirs) {
      const topicPath = path.join(dataDir, topicDir);
      const stat = await fs.stat(topicPath);
      
      if (stat.isDirectory()) {
        const notesFile = path.join(topicPath, 'notes.md');
        
        try {
          await fs.access(notesFile);
          
          // Read the notes file to get metadata
          const content = await fs.readFile(notesFile, 'utf8');
          const wordCount = content.split(/\s+/).length;
          const readTime = Math.ceil(wordCount / 200); // Average reading speed
          
          // Extract description from first paragraph
          const lines = content.split('\n');
          let description = '';
          for (const line of lines) {
            if (line.trim() && !line.startsWith('#')) {
              description = line.trim().substring(0, 150) + '...';
              break;
            }
          }
          
          topics.push({
            name: topicDir.replace(/_/g, ' '),
            wordCount,
            readTime,
            description: description || 'Comprehensive study material and exam preparation notes.'
          });
        } catch (error) {
          // notes.md doesn't exist for this topic, skip it
          console.log(`No notes.md found for topic: ${topicDir}`);
        }
      }
    }
    
    res.json(topics);
  } catch (error) {
    console.error('Error loading notes topics:', error);
    res.status(500).json({ error: 'Failed to load topics' });
  }
});

app.get('/api/notes/:topic', async (req, res) => {
  try {
    const topicName = req.params.topic.replace(/ /g, '_');
    const notesFile = path.join(__dirname, '../../data', topicName, 'notes.md');
    
    const content = await fs.readFile(notesFile, 'utf8');
    
    res.json({
      topic: topicName.replace(/_/g, ' '),
      content: content
    });
  } catch (error) {
    console.error(`Error loading notes for topic ${req.params.topic}:`, error);
    res.status(404).json({ error: 'Notes not found for this topic' });
  }
});

// ========== USER API ENDPOINTS ==========

// Create new user
app.post('/api/users', async (req, res) => {
  try {
    const { username } = req.body;
    if (!username || username.trim().length === 0) {
      return res.status(400).json({ error: 'Username cannot be empty' });
    }
    
    const user = await database.createUser(username.trim());
    res.json(user);
  } catch (error) {
    if (error.message === 'User already exists') {
      return res.status(409).json({ error: error.message });
    }
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await database.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// Get user by username
app.get('/api/users/:username', async (req, res) => {
  try {
    const user = await database.getUser(req.params.username);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Delete user
app.delete('/api/users/:username', async (req, res) => {
  try {
    await database.deleteUser(req.params.username);
    res.json({ success: true });
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({ error: error.message });
    }
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Get user comments
app.get('/api/users/:username/comments', async (req, res) => {
  try {
    const comments = await database.getComments(req.params.username);
    res.json(comments);
  } catch (error) {
    console.error('Error getting comments:', error);
    res.status(500).json({ error: 'Failed to get comments' });
  }
});

// Save/update comment
app.post('/api/users/:username/comments', async (req, res) => {
  try {
    const { questionId, comment } = req.body;
    if (!questionId) {
      return res.status(400).json({ error: 'Question ID is required' });
    }
    
    await database.saveComment(req.params.username, questionId, comment || '');
    res.json({ success: true });
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({ error: error.message });
    }
    console.error('Error saving comment:', error);
    res.status(500).json({ error: 'Failed to save comment' });
  }
});

// Delete comment
app.delete('/api/users/:username/comments/:questionId', async (req, res) => {
  try {
    await database.deleteComment(req.params.username, req.params.questionId);
    res.json({ success: true });
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({ error: error.message });
    }
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

// Get user progress
app.get('/api/users/:username/progress', async (req, res) => {
  try {
    const progress = await database.getProgress(req.params.username);
    res.json(progress);
  } catch (error) {
    console.error('Error getting progress:', error);
    res.status(500).json({ error: 'Failed to get progress' });
  }
});

// Update user progress
app.post('/api/users/:username/progress', async (req, res) => {
  try {
    await database.saveProgress(req.params.username, req.body);
    res.json({ success: true });
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({ error: error.message });
    }
    console.error('Error saving progress:', error);
    res.status(500).json({ error: 'Failed to save progress' });
  }
});

// Export user data
app.get('/api/users/:username/export', async (req, res) => {
  try {
    const data = await database.exportUserData(req.params.username);
    res.json(data);
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({ error: error.message });
    }
    console.error('Error exporting user data:', error);
    res.status(500).json({ error: 'Failed to export user data' });
  }
});

// Import user data
app.post('/api/users/:username/import', async (req, res) => {
  try {
    await database.importUserData(req.params.username, req.body);
    res.json({ success: true });
  } catch (error) {
    console.error('Error importing user data:', error);
    res.status(500).json({ error: 'Failed to import user data' });
  }
});

// Get local network IP address
function getNetworkIP() {
  const os = require('os');
  const interfaces = os.networkInterfaces();
  
  for (const interfaceName in interfaces) {
    const networkInterface = interfaces[interfaceName];
    for (const connection of networkInterface) {
      if (connection.family === 'IPv4' && !connection.internal) {
        return connection.address;
      }
    }
  }
  return 'localhost';
}

app.listen(PORT, '0.0.0.0', () => {
  const networkIP = getNetworkIP();
  console.log(`🚀 CCDM Quiz Backend Server Started`);
  console.log(`📊 Backend API: http://localhost:${PORT}`);
  console.log(`🌐 Network Access: http://${networkIP}:${PORT}`);
  console.log(`📱 Mobile Access: Use network IP on same WiFi`);
  console.log(`Loaded ${allQuestions.length} questions`);
});