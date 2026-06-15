// auth.js
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('devblog_current_user'));
}

function logout() {
    localStorage.removeItem('devblog_current_user');
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Оновлення навігації (для всіх сторінок)
    const currentUser = getCurrentUser();
    const navDiv = document.querySelector('nav .flex.gap-2'); // Знаходимо блок з кнопками входу
    if (navDiv && currentUser) {
        navDiv.innerHTML = `
            <span class="text-sm font-medium flex items-center mr-3 text-indigo-900">Привіт, ${currentUser.name}!</span>
            <button onclick="logout()" class="border border-indigo-400 px-4 py-1.5 rounded-lg text-sm hover:bg-white hover:text-indigo-600 transition">Вихід</button>
        `;
    }

    // 2. Логіка сторінки реєстрації
    const isRegistrationPage = document.querySelector('input[value="male"]');
    if (isRegistrationPage) {
        const form = document.querySelector('form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const inputs = form.querySelectorAll('input');
            const name = inputs[0].value;
            const email = inputs[1].value;
            const gender = document.querySelector('input[name="gender"]:checked')?.value || 'Не вказано';
            const dob = inputs[4].value;
            const password = inputs[5].value;

            const users = JSON.parse(localStorage.getItem('devblog_users')) || [];
            if (users.find(u => u.email === email)) {
                return alert('Користувач з таким email вже існує!');
            }

            users.push({ name, email, gender, dob, password });
            localStorage.setItem('devblog_users', JSON.stringify(users));
            alert('Реєстрація успішна! Тепер увійдіть.');
            window.location.href = 'login.html';
        });
    }

    // 3. Логіка сторінки входу
    const isLoginPage = document.querySelector('input[id="remember-me"]');
    if (isLoginPage) {
        const form = document.querySelector('form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const users = JSON.parse(localStorage.getItem('devblog_users')) || [];
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                localStorage.setItem('devblog_current_user', JSON.stringify(user));
                window.location.href = 'index.html';
            } else {
                alert('Неправильний email або пароль!');
            }
        });
    }
});