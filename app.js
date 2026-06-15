// app.js
document.addEventListener('DOMContentLoaded', () => {
    // Ініціалізуємо наш додаток, передаючи екземпляри Моделі та View у Контролер
    const app = new BlogController(new BlogModel(), new BlogView());
});