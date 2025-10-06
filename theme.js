const themeButton = document.getElementById('themeToggle');

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    themeButton.textContent = '💫';
} else {
    themeButton.textContent = '🌞';
}

themeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    themeButton.textContent = isDark ? '💫' : '🌞';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});