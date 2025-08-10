document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('lessons-list');

  fetch('data/lessons.json')
    .then(res => res.json())
    .then(data => {
      // Render lesson cards
      const renderLessonCards = () => {
        container.innerHTML = '';
        data.forEach(lesson => {
          const card = document.createElement('div');
          card.className = 'lesson-card';
          card.innerHTML = `<h3>${lesson.title}</h3>`;
          card.addEventListener('click', () => showLessonDetail(lesson));
          container.appendChild(card);
        });
      };

      // Show lesson detail
      const showLessonDetail = (lesson) => {
        container.innerHTML = `
          <div class="lesson-detail">
            <button class="btn" id="back-to-lessons">← Back</button>
            <h2>${lesson.title}</h2>
            <p>${lesson.content}</p>
            <button class="btn" id="start-quiz">Start Quiz</button>
          </div>
        `;

        document.getElementById('back-to-lessons').addEventListener('click', renderLessonCards);
        document.getElementById('start-quiz').addEventListener('click', () => {
          location.href = `quiz.html?lesson=${lesson.id}`;
        });
      };

      renderLessonCards();
    })
    .catch(err => {
      console.error('Error loading lessons:', err);
      container.innerHTML = '<p>Error loading lessons.</p>';
    });
});
