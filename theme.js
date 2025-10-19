class ThemeManager {
  constructor() {
    this.themeToggle = document.getElementById('themeToggle');
    this.init();
  }

  init() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.setTheme(savedTheme);
    
    this.themeToggle.addEventListener('click', () => {
      this.toggleTheme();
    });
  }

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this.themeToggle.textContent = theme === 'dark' ? '💫' : '🌞';
    localStorage.setItem('theme', theme);
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  new ThemeManager();
});