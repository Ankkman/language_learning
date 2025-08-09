document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const lessonId = params.get('lesson');
    const quizContainer = document.getElementById('quiz-container');
    const quizTitle = document.getElementById('quiz-title');
    const resultBox = document.getElementById('quiz-result');
    const scoreText = document.getElementById('score-text');
  
    let currentQuestion = 0;
    let score = 0;
    let quizData = [];
  
    if (!lessonId) {
      quizContainer.innerHTML = `<p class="muted">No lesson selected.</p>`;
      return;
    }
  
    fetch('data/quiz.json')
      .then(res => res.json())
      .then(data => {
        quizData = data[lessonId];
        if (!quizData) {
          quizContainer.innerHTML = `<p class="muted">No quiz available for this lesson.</p>`;
          return;
        }
        quizTitle.textContent = `Lesson ${lessonId} Quiz`;
        loadQuestion();
      })
      .catch(err => {
        quizContainer.innerHTML = `<p class="muted">Error loading quiz.</p>`;
        console.error(err);
      });
  
    function loadQuestion() {
      const q = quizData[currentQuestion];
      quizContainer.innerHTML = `
        <div class="quiz-question">
          <h2>${q.question}</h2>
          <ul class="quiz-options">
            ${q.options.map((opt, i) => `<li><button class="option-btn" data-index="${i}">${opt}</button></li>`).join('')}
          </ul>
        </div>
      `;
      document.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', () => handleAnswer(parseInt(btn.dataset.index)));
      });
    }
  
    function handleAnswer(selected) {
      const correct = quizData[currentQuestion].answer;
      if (selected === correct) {
        score++;
        alert('✅ Correct!');
      } else {
        alert(`❌ Incorrect! Correct answer: ${quizData[currentQuestion].options[correct]}`);
      }
  
      currentQuestion++;
      if (currentQuestion < quizData.length) {
        loadQuestion();
      } else {
        showResult();
      }
    }
  
    function showResult() {
      quizContainer.classList.add('hidden');
      resultBox.classList.remove('hidden');
      scoreText.textContent = `${score} / ${quizData.length}`;
      localStorage.setItem(`lesson-${lessonId}-score`, score);
    }
  });
  