CREATE DATABASE language_learning_app;
USE language_learning_app;
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    progress INT DEFAULT 0
);

CREATE TABLE Lessons (
    lesson_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    content TEXT
);

CREATE TABLE Vocabulary (
    vocab_id INT AUTO_INCREMENT PRIMARY KEY,
    word VARCHAR(100) NOT NULL,
    translation VARCHAR(100) NOT NULL,
    lesson_id INT,
    FOREIGN KEY (lesson_id) REFERENCES Lessons(lesson_id) ON DELETE CASCADE
);

CREATE TABLE Exercises (
    exercise_id INT AUTO_INCREMENT PRIMARY KEY,
    lesson_id INT,
    question TEXT NOT NULL,
    options JSON,  -- Store options in JSON format for flexibility
    answer VARCHAR(100) NOT NULL,
    FOREIGN KEY (lesson_id) REFERENCES Lessons(lesson_id) ON DELETE CASCADE
);

SHOW TABLES;


