const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./User');
const Project = require('./Project');

const app = express();
const PORT = 5000;

// MongoDB connection string (replace with your real URI)
const MONGODB_URI = 'mongodb+srv://madhunj040415_db_user:IEG5h4bhMreEb4kT@nj.6klbdp8.mongodb.net/freelancer?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB successfully!'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Test route
app.get('/', (req, res) => {
  res.send('Backend server is running successfully!');
});

// Signup route
app.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists!' });
    }
    const newUser = new User({ name, email, password });
    await newUser.save();
    console.log('New user created:', email);
    res.json({ message: 'Signup successful! User saved to database.', name, email });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// Login route
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }
    if (user.password !== password) {
      return res.status(401).json({ message: 'Incorrect password!' });
    }
    console.log('User logged in:', email);
    res.json({ message: 'Login successful!', name: user.name, email: user.email });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Post Project route
app.post('/post-project', async (req, res) => {
  try {
    const { title, description, skills, fileUrls, projectType, budget, location } = req.body;
    const newProject = new Project({ title, description, skills, fileUrls, projectType, budget, location });
    await newProject.save();
    res.json({ message: "Project posted successfully!" });
  } catch (error) {
    console.error("Post project error:", error);
    res.status(500).json({ message: "Server error during posting project" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
