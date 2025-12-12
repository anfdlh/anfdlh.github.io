// Custom Notification Function
function showNotification(message) {
    const toast = document.getElementById('notification-toast');
    const messageEl = document.getElementById('notification-message');

    messageEl.textContent = message;
    toast.classList.add('show');

    // Auto hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Open Quiz - Redirect to dedicated quiz pages
document.querySelectorAll('.skill-tags span').forEach(tag => {
    const skillName = tag.innerText.trim();

    // Map skills to their quiz pages
    const quizPages = {
        "HTML5": "quiz/quiz-html.html",
        "CSS3": "quiz/quiz-css.html"
    };

    // Add 'no-quiz' class to skill tags without quizzes
    if (!quizPages[skillName]) {
        tag.classList.add('no-quiz');
    }

    tag.addEventListener('click', () => {
        // Check if quiz page exists for this skill
        if (quizPages[skillName]) {
            window.location.href = quizPages[skillName];
        } else {
            // Show custom notification instead of alert
            showNotification(`Quiz for ${skillName} is coming soon! 🚀`);
        }
    });
});
