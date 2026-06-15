// profile.js
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('devblog_current_user'));
    
    if (!currentUser) {
        alert('Будь ласка, увійдіть у систему!');
        return window.location.href = 'login.html';
    }

    // Оновлюємо візуальну частину
    const profileHeader = document.querySelector('.bg-indigo-50 h2');
    const profileInitials = document.querySelector('.bg-indigo-50 .w-24');
    const tdElements = document.querySelectorAll('tbody td:nth-child(2)');
    const editBtn = document.querySelector('main button');

    function renderProfileInfo() {
        profileHeader.textContent = currentUser.name;
        const initials = currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase();
        profileInitials.textContent = initials.substring(0, 2);

        tdElements[0].textContent = currentUser.name;
        tdElements[1].textContent = currentUser.email;
        tdElements[2].textContent = currentUser.gender === 'male' ? 'Чоловіча' : (currentUser.gender === 'female' ? 'Жіноча' : 'Не вказано');
        tdElements[3].textContent = currentUser.dob;
    }

    renderProfileInfo(); // Первинне заповнення

    // Логіка редагування
    let isEditing = false;
    editBtn.addEventListener('click', () => {
        if (!isEditing) {
            // Перетворюємо поля Ім'я та Дата народження на інпути
            tdElements[0].innerHTML = `<input type="text" id="edit-name" value="${currentUser.name}" class="border rounded px-2 py-1 w-full text-sm">`;
            tdElements[3].innerHTML = `<input type="date" id="edit-dob" value="${currentUser.dob}" class="border rounded px-2 py-1 w-full text-sm">`;
            
            editBtn.textContent = 'Зберегти зміни';
            editBtn.classList.replace('bg-indigo-600', 'bg-green-600');
            isEditing = true;
        } else {
            // Зберігаємо зміни
            currentUser.name = document.getElementById('edit-name').value;
            currentUser.dob = document.getElementById('edit-dob').value;
            
            // Оновлюємо поточного юзера
            localStorage.setItem('devblog_current_user', JSON.stringify(currentUser));
            
            // Оновлюємо його в загальній базі користувачів
            const users = JSON.parse(localStorage.getItem('devblog_users')) || [];
            const userIndex = users.findIndex(u => u.email === currentUser.email);
            if (userIndex !== -1) {
                users[userIndex] = currentUser;
                localStorage.setItem('devblog_users', JSON.stringify(users));
            }

            renderProfileInfo(); // Повертаємо текстовий вигляд
            
            editBtn.textContent = 'Редагувати профіль';
            editBtn.classList.replace('bg-green-600', 'bg-indigo-600');
            isEditing = false;
            
            // Оновлюємо ім'я в навігації
            document.querySelector('nav span').textContent = `Привіт, ${currentUser.name}!`;
        }
    });
});