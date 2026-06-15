// view.js
class BlogView {
    constructor() {
        this.app = document.querySelector('main');
        
        // Знаходимо форму створення поста
        this.postForm = document.querySelector('form');
        this.titleInput = this.postForm.querySelector('input[type="text"]');
        this.contentInput = this.postForm.querySelector('textarea');
        this.submitButton = this.postForm.querySelector('button');

        // Знаходимо контейнер для стрічки новин
        this.feedContainer = document.querySelector('section.space-y-6');
    }

    // Очищення полів форми
    _resetInput() {
        this.titleInput.value = '';
        this.contentInput.value = '';
    }

    // Рендер усіх постів
    displayPosts(posts) {
        const titleH2 = this.feedContainer.querySelector('h2');
        this.feedContainer.innerHTML = '';
        if (titleH2) this.feedContainer.appendChild(titleH2);

        if (posts.length === 0) {
            const p = document.createElement('p');
            p.textContent = 'Поки що немає дописів. Створіть перший!';
            p.className = 'text-gray-500 italic mt-4';
            this.feedContainer.appendChild(p);
            return;
        }

        const currentUser = JSON.parse(localStorage.getItem('devblog_current_user'));
        const userEmail = currentUser ? currentUser.email : null;

        posts.forEach(post => {
            const article = document.createElement('article');
            article.className = 'bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-6';
            
            // Генерація коментарів (кнопка вилучення тільки для автора коментаря)
            const commentsHTML = post.comments.map(comment => {
                const canDelete = comment.authorEmail === userEmail;
                return `
                <li class="bg-gray-50 p-3 rounded text-sm flex justify-between">
                    <span><strong>${comment.authorName || 'Користувач'}:</strong> ${comment.text}</span>
                    ${canDelete ? `<button class="text-gray-400 hover:text-red-500 delete-comment-btn" data-post-id="${post.id}" data-comment-id="${comment.id}">×</button>` : ''}
                </li>`;
            }).join('');

            // Кнопка вилучення поста (тільки для автора поста)
            const canDeletePost = post.authorEmail === userEmail;

            article.innerHTML = `
                <div class="flex justify-between items-start">
                    <div>
                        <h3 class="text-xl font-bold text-indigo-600">${post.title}</h3>
                        <span class="text-xs text-gray-500">Автор: ${post.authorName || 'Невідомий'}</span>
                    </div>
                    ${canDeletePost ? `<button class="text-red-500 hover:text-red-700 text-sm delete-post-btn" data-id="${post.id}">Вилучити</button>` : ''}
                </div>
                <p class="text-gray-600 mt-2">${post.content}</p>
                
                <div class="mt-6 border-t pt-4">
                    <h4 class="font-semibold text-gray-700 mb-3">Коментарі:</h4>
                    <ul class="space-y-3 mb-4">
                        ${commentsHTML}
                    </ul>
                    ${currentUser ? `
                    <div class="flex gap-2">
                        <input type="text" class="flex-grow border border-gray-300 rounded-md px-3 py-1 text-sm comment-input" placeholder="Напишіть коментар...">
                        <button class="bg-gray-200 px-3 py-1 rounded-md text-sm hover:bg-gray-300 transition add-comment-btn" data-id="${post.id}">Додати</button>
                    </div>` : '<p class="text-sm text-gray-500 italic">Увійдіть у систему, щоб залишити коментар.</p>'}
                </div>
            `;
            this.feedContainer.appendChild(article);
        });
    }

    // Прив'язка подій для Контролера
    bindAddPost(handler) {
        this.submitButton.addEventListener('click', event => {
            event.preventDefault();
            if (this.titleInput.value && this.contentInput.value) {
                handler(this.titleInput.value, this.contentInput.value);
                this._resetInput();
            }
        });
    }

    bindDeletePost(handler) {
        this.feedContainer.addEventListener('click', event => {
            if (event.target.classList.contains('delete-post-btn')) {
                const id = event.target.getAttribute('data-id');
                handler(id);
            }
        });
    }

    bindAddComment(handler) {
        this.feedContainer.addEventListener('click', event => {
            if (event.target.classList.contains('add-comment-btn')) {
                const id = event.target.getAttribute('data-id');
                const input = event.target.previousElementSibling;
                if (input.value) {
                    handler(id, input.value);
                    input.value = '';
                }
            }
        });
    }

    bindDeleteComment(handler) {
        this.feedContainer.addEventListener('click', event => {
            if (event.target.classList.contains('delete-comment-btn')) {
                const postId = event.target.getAttribute('data-post-id');
                const commentId = event.target.getAttribute('data-comment-id');
                handler(postId, commentId);
            }
        });
    }
}