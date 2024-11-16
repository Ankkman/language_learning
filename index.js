const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());



// MySQL Connection
const db = mysql.createConnection({
  host: "localhost", // Replace with your database host
  user: "root", // Replace with your database user
  password: "", // Replace with your database password
  database: "language_learning", // Your database name
});

// Connect to Database
db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.stack);
    return;
  }
  console.log("Connected to database.");
});

// Routes

const cors = require("cors");
app.use(cors());  // Enable CORS for all routes


// Default route for the root URL
app.get("/", (req, res) => {
    res.send("Welcome to the Language Learning API!");
  });
  

// Get all lessons
app.get("/lessons", (req, res) => {
    const query = "SELECT * FROM Lessons";
    db.query(query, (err, results) => {
      if (err) throw err;
      res.json(results); // Send lessons as a JSON response
    });
  });
  

// Add a new lesson
app.post("/lessons", (req, res) => {
  const { lesson_title, lesson_content } = req.body;
  const query = "INSERT INTO Lessons (lesson_title, lesson_content) VALUES (?, ?)";
  db.query(query, [lesson_title, lesson_content], (err, results) => {
    if (err) throw err;
    res.send("Lesson added successfully.");
  });
});

// Get exercises for a lesson
app.get("/exercises/:lesson_id", (req, res) => {
  const { lesson_id } = req.params;
  const query = "SELECT * FROM Exercises WHERE lesson_id = ?";
  db.query(query, [lesson_id], (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

// Add a new exercise
app.post("/exercises", (req, res) => {
  const { lesson_id, question, option_a, option_b, option_c, option_d, correct_option } = req.body;
  const query = `
    INSERT INTO Exercises (lesson_id, question, option_a, option_b, option_c, option_d, correct_option)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(query, [lesson_id, question, option_a, option_b, option_c, option_d, correct_option], (err, results) => {
    if (err) throw err;
    res.send("Exercise added successfully.");
  });
});

// Track user progress
app.post("/progress", (req, res) => {
  const { user_id, lesson_id, exercise_id, is_completed } = req.body;
  const query = `
    INSERT INTO Progress (user_id, lesson_id, exercise_id, is_completed)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE is_completed = VALUES(is_completed)
  `;

  db.query(query, [user_id, lesson_id, exercise_id, is_completed], (err, results) => {
    if (err) throw err;
    res.send("Progress updated successfully.");
  });
});

// Get all progress entries
app.get("/progress", (req, res) => {
  const query = "SELECT * FROM Progress";
  db.query(query, (err, results) => {
    if (err) throw err;
    res.json(results); // Send progress data as a JSON response
  });
});


// Start Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// User Login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  const query = "SELECT user_id FROM Users WHERE username = ? AND password = ?";
  db.query(query, [username, password], (err, results) => {
    if (err) {
      console.error("Database error during login:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (results.length > 0) {
      res.json({ user_id: results[0].user_id });
    } else {
      res.status(401).json({ message: "Invalid username or password." });
    }
  });
});
