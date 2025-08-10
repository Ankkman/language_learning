document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(location.search);
  const lessonId = Number(params.get('lesson'));

  const quizContainer = document.getElementById('quiz-container');
  const quizResult = document.getElementById('quiz-result');
  const scoreText = document.getElementById('score-text');
  const quizTitle = document.getElementById('quiz-title');

  // Set lesson title
  fetch('data/lessons.json')
    .then(res => res.json())
    .then(lessons => {
      const lesson = lessons.find(l => l.id === lessonId);
      if (lesson) quizTitle.textContent = `${lesson.title} - Quiz`;
    })
    .catch(err => console.error('Error loading lesson title:', err));

  // Load quiz data
  fetch('data/quiz.json')
    .then(res => res.json())
    .then(quizzes => {
      const lessonQuiz = quizzes.find(q => q.lessonId === lessonId);
      if (!lessonQuiz) {
        quizContainer.innerHTML = '<p>No quiz available for this lesson.</p>';
        return;
      }

      let score = 0;
      let currentQuestion = 0;

      const showQuestion = () => {
        const q = lessonQuiz.quizzes[currentQuestion];
        quizContainer.innerHTML = `
          <h3>${q.question}</h3>
          <div class="quiz-options">
            ${q.options.map((opt, i) => `
              <button class="quiz-option btn" data-index="${i}">${opt}</button>
            `).join('')}
          </div>
        `;

        document.querySelectorAll('.quiz-option').forEach(btn => {
          btn.addEventListener('click', () => {
            const chosenIndex = Number(btn.dataset.index);

            document.querySelectorAll('.quiz-option').forEach(option => {
              option.disabled = true;
              option.style.cursor = 'not-allowed';
            });

            if (chosenIndex === q.answer) {
              btn.style.backgroundColor = '#4CAF50';
              score++;
            } else {
              btn.style.backgroundColor = '#f44336';
              const correctBtn = document.querySelector(`.quiz-option[data-index="${q.answer}"]`);
              if (correctBtn) correctBtn.style.backgroundColor = '#4CAF50';
            }

            setTimeout(() => {
              currentQuestion++;
              currentQuestion < lessonQuiz.quizzes.length ? showQuestion() : showResult();
            }, 1000);
          });
        });
      };

      const showResult = () => {
        quizContainer.classList.add('hidden');
        quizResult.classList.remove('hidden');
        scoreText.textContent = `${score} out of ${lessonQuiz.quizzes.length}`;
      };

      showQuestion();
    })
    .catch(err => {
      console.error('Error loading quiz:', err);
      quizContainer.innerHTML = '<p>Error loading quiz.</p>';
    });
});
