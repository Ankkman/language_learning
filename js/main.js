document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('site-nav');

  // Mobile nav toggle
  menuToggle?.addEventListener('click', () => {
    nav.classList.toggle('open');
  });

  // Close mobile nav when clicking a link
  document.querySelectorAll('.nav-list a').forEach(link => {
    link.addEventListener('click', () => nav.classList.remove('open'));
  });
});
