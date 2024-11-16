const API_URL = "http://localhost:3000";

let currentLessonId = null;

// Fetch all lessons and display them
function fetchLessons() {
  fetch(`${API_URL}/lessons`)
    .then((response) => response.json())
    .then((lessons) => {
      const lessonsList = document.getElementById("lessons-list");
      lessonsList.innerHTML = "";
      lessons.forEach((lesson) => {
        const listItem = document.createElement("li");
        listItem.textContent = lesson.lesson_title;
        listItem.onclick = () => loadLessonContent(lesson.lesson_id);
        lessonsList.appendChild(listItem);
      });
    });
}

// Load the content of a specific lesson
function loadLessonContent(lessonId) {
  currentLessonId = lessonId; // Save the lesson ID
  fetch(`${API_URL}/lessons`)
    .then((response) => response.json())
    .then((lessons) => {
      const lesson = lessons.find(l => l.lesson_id === lessonId);
      document.getElementById("lesson-content").innerHTML = lesson.lesson_content;
      document.getElementById("mark-complete-btn").style.display = "inline-block";
      document.getElementById("lesson-view").style.display = "block";
      document.getElementById("lessons").style.display = "none";
    });
}

// Mark lesson as complete and unlock the exercise button
function markLessonComplete() {
  document.getElementById("mark-complete-btn").style.display = "none";
  document.getElementById("exercise-btn").style.display = "inline-block";

  // Update progress
  updateProgress(currentLessonId, true);
}

// Fetch exercises for the completed lesson
let userAnswers = {}; // Object to store user-selected answers
function fetchExercisesForCompletedLesson() {
  fetch(`${API_URL}/exercises/${currentLessonId}`)
    .then((response) => response.json())
    .then((exercises) => {
      document.getElementById("lesson-view").style.display = "none";
      document.getElementById("exercises").style.display = "block";

      const exercisesList = document.getElementById("exercises-list");
      const submitButton = document.getElementById("submit-exercises");
      const backToLessonsButton = document.getElementById("back-to-lessons");

      exercisesList.innerHTML = "";
      userAnswers = {}; // Reset user answers

      exercises.forEach((exercise, index) => {
        const listItem = document.createElement("li");

        // Create options
        const options = ["option_a", "option_b", "option_c", "option_d"].map((opt) => {
          return `<button class="exercise-option" data-exercise-id="${exercise.exercise_id}" data-option="${opt}">
                    ${exercise[opt]}
                  </button>`;
        });

        listItem.innerHTML = `
          <strong>Question ${index + 1}:</strong> ${exercise.question}
          <div>${options.join(" ")}</div>
        `;
        exercisesList.appendChild(listItem);
      });

      // Show the Submit button
      submitButton.style.display = "block";
      backToLessonsButton.style.display = "none";

      // Add click handlers for options
      document.querySelectorAll(".exercise-option").forEach((button) => {
        button.addEventListener("click", (e) => {
          const exerciseId = e.target.dataset.exercise_id;
          const selectedOption = e.target.dataset.option;

          // Mark the selected option and update userAnswers
          userAnswers[exerciseId] = selectedOption;

          // Reset the colors of all options for the question
          document
            .querySelectorAll(`.exercise-option[data-exercise-id="${exerciseId}"]`)
            .forEach((btn) => (btn.style.backgroundColor = ""));

          // Highlight the selected option
          e.target.style.backgroundColor = "gray";
        });
      });

      // Add click handler for Submit button
      submitButton.addEventListener("click", () => {
        // Disable all buttons to prevent further interaction
        document.querySelectorAll(".exercise-option").forEach((btn) => (btn.disabled = true));
        submitButton.style.display = "none";

        // Compare answers and show feedback
        exercises.forEach((exercise) => {
          const userAnswer = userAnswers[exercise.exercise_id]; // User's selected option
          const correctAnswer = exercise.correct_option; // Correct answer value (e.g., "A", "ZH")

          // Get the buttons for the current question
          const buttons = document.querySelectorAll(`.exercise-option[data-exercise-id="${exercise.exercise_id}"]`);

          buttons.forEach((btn) => {
            const isSelected = btn.dataset.option === userAnswer; // Check if this button is selected
            const isCorrect = btn.textContent.trim() === correctAnswer; // Compare text value with the correct answer

            if (isSelected) {
              // If user's answer matches correct answer
              btn.style.backgroundColor = isCorrect ? "green" : "red";
            }

            if (isCorrect && !isSelected) {
              // Highlight the correct answer in green if not selected
              btn.style.backgroundColor = "green";
            }
          });
        });

        // Show Back to Lessons button
        backToLessonsButton.style.display = "block";
      });

      // Add click handler for Back to Lessons button
      backToLessonsButton.addEventListener("click", () => {
        // Hide all other sections
        document.getElementById("exercises").style.display = "none";
        document.getElementById("lessons").style.display = "block";
      });
    });
}

// Show the lessons list
document.getElementById("lessons").style.display = "block";

// Go back to home page (lessons)
function goToHomePage() {
  document.getElementById("lesson-view").style.display = "none";
  document.getElementById("lessons").style.display = "block";
}

// Update user progress
async function updateProgress(lessonId, isCompleted) {
  try {
    const userId = 1; // Example user ID, replace with dynamic user ID if available
    const progressData = { user_id: userId, lesson_id: lessonId, exercise_id: null, is_completed: isCompleted };

    await fetch(`${API_URL}/progress`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(progressData),
    });

    console.log("Progress updated successfully.");
  } catch (error) {
    console.error("Error updating progress:", error);
  }
}

// Fetch user progress and update the progress bar
async function fetchProgress() {
  try {
    const response = await fetch(`${API_URL}/progress`);
    const progressData = await response.json();
    console.log(progressData); // Log or display the progress data

    // Assuming progressData contains completed lessons count and total lessons count
    const completedLessons = progressData.completedLessons; // Example: 3
    const totalLessons = progressData.totalLessons; // Example: 10

    // Calculate the percentage of progress
    const progressPercentage = (completedLessons / totalLessons) * 100;

    // Update the progress bar
    const progressBar = document.getElementById("progress-bar");
    const progressPercentText = document.getElementById("progress-percent");

    progressBar.value = progressPercentage;
    progressPercentText.textContent = `${Math.round(progressPercentage)}%`; // Update the percentage text
  } catch (error) {
    console.error("Error fetching progress:", error);
  }
}

// Call the function to fetch progress
fetchProgress();

// Initialize the app
fetchLessons();

// Fetch progress data
fetchProgress();



document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const loginMessage = document.getElementById("login-message");
  const loginSection = document.getElementById("login");
  const lessonsSection = document.getElementById("lessons");
  const progressSection = document.getElementById("progress");

  // Handle Login Form Submission
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();  // Prevent form from reloading the page

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Login successful:", data);

        // Hide login section and show lessons and progress sections
        loginSection.style.display = "none";
        lessonsSection.style.display = "block";
        progressSection.style.display = "block";

        // Load lessons (assuming a function fetchLessons exists)
        fetchLessons();
      } else {
        const error = await response.json();
        loginMessage.textContent = error.message || "Login failed. Please try again.";
      }
    } catch (err) {
      console.error("Error during login:", err);
      loginMessage.textContent = "An error occurred. Please try again.";
    }
  });



  // Example function to fetch lessons (replace with actual implementation)
  async function fetchLessons() {
    try {
      const response = await fetch("http://localhost:3000/lessons");
      if (response.ok) {
        const lessons = await response.json();
        const lessonsList = document.getElementById("lessons-list");
        lessonsList.innerHTML = lessons.map((lesson) => `<li>${lesson.lesson_title}</li>`).join("");
      } else {
        console.error("Failed to fetch lessons");
      }
    } catch (err) {
      console.error("Error fetching lessons:", err);
    }
  }
});



// Assume user data is already set after login (can be from localStorage or session)

document.addEventListener('DOMContentLoaded', () => {
  // Initialize progress from localStorage if available
  let userProgress = localStorage.getItem('userProgress') || 0;
  updateProgress(userProgress);

  // Handle lesson completion
  const markCompleteBtn = document.getElementById('mark-complete-btn');
  if (markCompleteBtn) {
    markCompleteBtn.addEventListener('click', () => {
      // Assume that each lesson completion increases progress by 10%
      userProgress = Math.min(parseInt(userProgress) + 10, 100); // Ensure it doesn't go over 100
      localStorage.setItem('userProgress', userProgress);
      updateProgress(userProgress);
    });
  }
});

// Function to update the progress bar and percentage
function updateProgress(progress) {
  const progressBar = document.getElementById('progress-bar');
  const progressPercent = document.getElementById('progress-percent');
  
  // Update the progress bar
  if (progressBar) {
    progressBar.value = progress;
  }

  // Update the progress text
  if (progressPercent) {
    progressPercent.textContent = `${progress}%`;
  }
}






// Assuming login success is checked somewhere
document.getElementById('login-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // Assume a successful login
  if (username && password) {
    // Hide the login form and show the other sections
    document.getElementById('login').style.display = 'none';
    document.getElementById('lessons').style.display = 'block';
    document.getElementById('progress').style.display = 'block';
    
    // Initialize the progress bar based on stored progress
    let userProgress = localStorage.getItem('userProgress') || 0;
    updateProgress(userProgress);
  }
});


// Update progress function
function updateProgress(lessonId, isComplete) {
  let progress = localStorage.getItem('userProgress') || 0;
  
  if (isComplete) {
    // Increment progress by 10% for each lesson completed
    progress = Math.min(parseInt(progress) + 10, 100); // Don't let it exceed 100%
    localStorage.setItem('userProgress', progress); // Store progress
  }

  // If the progress reaches 100%, show the completion message
  if (progress === 100) {
    displayCompletionMessage(); // Call this function to show a message and the reset button
  }
  
  updateProgressBar(progress);
}

// Function to display a completion message with a reset button when progress reaches 100%
function displayCompletionMessage() {
  // Hide the progress bar and show the congratulatory message with a reset button
  document.getElementById('progress-info').style.display = 'none'; // Hide progress bar
  const completionMessage = document.createElement('div');
  completionMessage.id = 'completion-message';
  completionMessage.innerHTML = `
    <h3>Congratulations! You've completed all lessons!</h3>
    <button id="reset-progress-btn">Reset Progress</button>
  `;
  document.getElementById('progress').appendChild(completionMessage);

  // Attach event listener to the reset button
  document.getElementById('reset-progress-btn').addEventListener('click', resetProgress);
}

// Reset progress to 0 and update the UI
function resetProgress() {
  localStorage.setItem('userProgress', 0); // Reset progress in localStorage
  updateProgressBar(0); // Reset progress bar
  document.getElementById('progress-info').style.display = 'block'; // Show progress bar again

  // Remove the completion message and button
  document.getElementById('completion-message').remove();
}

// Update the progress bar UI
function updateProgressBar(progress) {
  const progressBar = document.getElementById('progress-bar');
  const progressPercent = document.getElementById('progress-percent');
  
  if (progressBar) {
    progressBar.value = progress;
  }
  
  if (progressPercent) {
    progressPercent.textContent = `${progress}%`;
  }
}

// When the page loads, check for progress and set the progress bar accordingly
document.addEventListener('DOMContentLoaded', () => {
  let progress = localStorage.getItem('userProgress') || 0;
  updateProgressBar(progress);
});

let exerciseSubmitted = false; // Track if exercise is already submitted
const totalExercises = 5; // Total number of exercises
let currentExerciseIndex = 0; // Track the current exercise number (lesson index)

// Load the content of a specific lesson
function loadLessonContent(lessonId) {
  currentLessonId = lessonId; // Save the lesson ID
  fetch(`${API_URL}/lessons`)
    .then((response) => response.json())
    .then((lessons) => {
      const lesson = lessons.find(l => l.lesson_id === lessonId);
      document.getElementById("lesson-content").innerHTML = lesson.lesson_content;

      // Hide the Mark as Complete button (as per the new requirement)
      document.getElementById("mark-complete-btn").style.display = "none";

      // Show the Exercise button
      document.getElementById("exercise-btn").style.display = "inline-block";

      document.getElementById("lesson-view").style.display = "block";
      document.getElementById("lessons").style.display = "none";
    });
}

// Update the progress bar UI
function updateProgressBar(progress) {
  const progressBar = document.getElementById('progress-bar');
  const progressPercent = document.getElementById('progress-percent');

  if (progressBar) {
    progressBar.value = progress;
  }

  if (progressPercent) {
    progressPercent.textContent = `${progress}%`;
  }

  // Check if progress reaches 100% and refresh the state
  if (progress === 100) {
    displayCompletionMessage();
  }
}

// Exercise Submission logic (only updates progress)
function submitExercise() {
  if (exerciseSubmitted) {
    // If the exercise is already completed, show a message instead of updating progress
    document.getElementById('submit-exercises').style.display = 'none'; // Hide submit button
    document.getElementById('exercise-completed-message').style.display = 'block';
    return;
  }

  // Calculate the progress increment based on the total number of exercises
  let progress = parseInt(localStorage.getItem('userProgress')) || 0;
  let increment = 100 / totalExercises; // Increment value based on the total exercises
  progress = Math.min(progress + increment, 100); // Increment progress, but don't exceed 100%
  localStorage.setItem('userProgress', progress); // Store progress

  // Update progress bar
  updateProgressBar(progress);

  // Show completion message for the exercise and hide the submit button
  document.getElementById('submit-exercises').style.display = 'none';
  document.getElementById('exercise-completed-message').style.display = 'block';

  exerciseSubmitted = true; // Mark that the exercise has been completed
}

// Function to display a completion message with a reset button when progress reaches 100%
function displayCompletionMessage() {
  // Hide the progress bar and show the congratulatory message with a reset button
  document.getElementById('progress-info').style.display = 'none'; // Hide progress bar
  const completionMessage = document.createElement('div');
  completionMessage.id = 'completion-message';
  completionMessage.innerHTML = `
    <h3>Congratulations! You've completed all lessons!</h3>
    <button id="reset-progress-btn">Reset Progress</button>
  `;
  document.getElementById('progress').appendChild(completionMessage);

  // Attach event listener to the reset button
  document.getElementById('reset-progress-btn').addEventListener('click', resetProgress);
}

// Reset progress to 0 and update the UI
function resetProgress() {
  localStorage.setItem('userProgress', 0); // Reset progress in localStorage
  updateProgressBar(0); // Reset progress bar
  document.getElementById('progress-info').style.display = 'block'; // Show progress bar again

  // Remove the completion message and button
  const completionMessage = document.getElementById('completion-message');
  if (completionMessage) {
    completionMessage.remove();
  }


  // Reset exercise completion state
  exerciseSubmitted = false;
  document.getElementById('exercise-completed-message').style.display = 'none';
  document.getElementById('submit-exercises').style.display = 'inline-block';
}
