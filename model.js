// model.js
class BlogModel {
    constructor() {
        // Ініціалізуємо пости з localStorage або створюємо порожній масив 
        this.posts = JSON.parse(localStorage.getItem('devblog_posts')) || [];
    }

    _commit(posts) {
        this.posts = posts;
        localStorage.setItem('devblog_posts', JSON.stringify(posts));
    }

    addPost(title, content) {
        const currentUser = JSON.parse(localStorage.getItem('devblog_current_user'));
        if (!currentUser) return alert("Необхідно увійти в систему, щоб створювати дописи!");

        const post = {
            id: Date.now().toString(),
            title: title,
            content: content,
            authorName: currentUser.name, // Прив'язка імені
            authorEmail: currentUser.email, // Прив'язка email для перевірки прав
            comments: []
        };
        this.posts.push(post);
        this._commit(this.posts);
    }

    deletePost(id) {
        this.posts = this.posts.filter(post => post.id !== id);
        this._commit(this.posts);
    }

    addComment(postId, text) {
        const currentUser = JSON.parse(localStorage.getItem('devblog_current_user'));
        if (!currentUser) return alert("Необхідно увійти в систему для коментування!");

        this.posts = this.posts.map(post => {
            if (post.id === postId) {
                post.comments.push({
                    id: Date.now().toString(),
                    text: text,
                    authorName: currentUser.name,
                    authorEmail: currentUser.email
                });
            }
            return post;
        });
        this._commit(this.posts);
    }

    deleteComment(postId, commentId) {
        this.posts = this.posts.map(post => {
            if (post.id === postId) {
                post.comments = post.comments.filter(comment => comment.id !== commentId);
            }
            return post;
        });
        this._commit(this.posts);
    }
}