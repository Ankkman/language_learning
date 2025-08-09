// main.js — small utilities: theme + mobile nav + small helpers
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const menuToggle = document.getElementById('menu-toggle');
    const nav = document.getElementById('site-nav');
    const year = document.getElementById('year');
  
    // set year in footer
    if (year) year.textContent = new Date().getFullYear();
  
    // theme: read saved or use system pref
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = saved || (prefersDark ? 'dark' : 'light');
    setTheme(initial);
  
    themeToggle?.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      setTheme(current);
    });
  
    // mobile nav
    menuToggle?.addEventListener('click', () => {
      nav.classList.toggle('open');
      // close when clicking outside (optional)
    });
  
    // close mobile nav on nav link click
    document.querySelectorAll('.nav-list a').forEach(a => {
      a.addEventListener('click', () => nav.classList.remove('open'));
    });
  });
  
  // helper: set theme
  function setTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('theme', t);
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.setAttribute('aria-pressed', t === 'dark' ? 'true' : 'false');
      btn.textContent = t === 'dark' ? '🌙' : '🌓';
    }
  }
  