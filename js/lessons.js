document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('lessons-container');

  fetch('data/lessons.json')
    .then(response => response.json())
    .then(data => {
      data.forEach(lesson => {
        const lessonCard = document.createElement('div');
        lessonCard.className = 'lesson-card';
        lessonCard.innerHTML = `<h3>${lesson.title}</h3>`;
        lessonCard.addEventListener('click', () => showLessonDetail(lesson));
        container.appendChild(lessonCard);
      });

      function showLessonDetail(lesson) {
        container.innerHTML = `
          <div class="lesson-detail">
            <h2>${lesson.title}</h2>
            <p>${lesson.content}</p>
            <button id="start-quiz">Start Quiz</button>
            <div id="quiz-container"></div>
          </div>
        `;

        document.getElementById('start-quiz').addEventListener('click', () => {
          loadQuiz(lesson.id);
        });
      }

      function loadQuiz(lessonId) {
        fetch('data/quiz.json')
          .then(response => response.json())
          .then(quizData => {
            const lessonQuiz = quizData.find(q => q.lessonId === lessonId);
            const quizContainer = document.getElementById('quiz-container');

            if (!lessonQuiz) {
              quizContainer.innerHTML = "<p>No quiz available.</p>";
              return;
            }

            let score = 0;
            let currentQuestion = 0;

            function showQuestion() {
              const q = lessonQuiz.quizzes[currentQuestion];
              quizContainer.innerHTML = `
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
                    quizContainer.innerHTML = `<p>You scored ${score} out of ${lessonQuiz.quizzes.length}</p>`;
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
      }
    })
    .catch(error => {
      console.error('Error loading lessons:', error);
      container.innerHTML = "<p>Error loading lessons.</p>";
    });
});
