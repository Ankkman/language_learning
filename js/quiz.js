const urlParams = new URLSearchParams(window.location.search);
const lessonId = parseInt(urlParams.get('lessonId'));

fetch('data/quiz.json')
  .then(response => response.json())
  .then(data => {
    const lessonQuiz = data.find(q => q.lessonId === lessonId);
    if (!lessonQuiz) {
      document.getElementById('quiz-container').innerHTML = "<p>No quiz available.</p>";
      return;
    }

    let score = 0;
    let currentQuestion = 0;
    const container = document.getElementById('quiz-container');

    function showQuestion() {
      const q = lessonQuiz.quizzes[currentQuestion];
      container.innerHTML = `
        <h3>${q.question}</h3>
        ${q.options.map((opt, i) => `
          <button class="quiz-option" data-index="${i}">${opt}</button>
        `).join('')}
      `;

      document.querySelectorAll('.quiz-option').forEach(btn => {
        btn.addEventListener('click', () => {
          if (parseInt(btn.dataset.index) === q.answer) {
            score++;
          }
          currentQuestion++;
          if (currentQuestion < lessonQuiz.quizzes.length) {
            showQuestion();
          } else {
            container.innerHTML = `<p>You scored ${score} out of ${lessonQuiz.quizzes.length}</p>`;
          }
        });
      });
    }

    showQuestion();
  })
  .catch(error => {
    console.error('Error loading quiz:', error);
    document.getElementById('quiz-container').innerHTML = "<p>Error loading quiz.</p>";
  });
