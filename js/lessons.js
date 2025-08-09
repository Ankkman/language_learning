document.addEventListener('DOMContentLoaded', () => {
    const lessonsContainer = document.getElementById('lessons-list');
  
    fetch('data/lessons.json')
      .then(res => res.json())
      .then(lessons => {
        lessonsContainer.innerHTML = lessons.map(lesson => `
          <div class="lesson-card">
            ${lesson.image ? `<img src="${lesson.image}" alt="${lesson.title}" style="max-width:100%;border-radius:8px;margin-bottom:0.75rem;">` : ''}
            <div class="lesson-title">${lesson.title}</div>
            <div class="lesson-desc">${lesson.description}</div>
            <a class="btn primary lesson-btn" href="quiz.html?lesson=${lesson.id}">Start Quiz →</a>
          </div>
        `).join('');
      })
      .catch(err => {
        lessonsContainer.innerHTML = `<p class="muted">Error loading lessons.</p>`;
        console.error(err);
      });
  });
  