document.addEventListener('DOMContentLoaded', () => {
    const codeContainer = document.querySelector('.code-text');

    const cursor = document.createElement('span');
    cursor.textContent = '|';
    cursor.style.display = 'inline-block';
    cursor.style.animation = 'blink 1s infinite';
    codeContainer.appendChild(cursor);

    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        @keyframes blink {
            50% { opacity: 0; }
        }
    `;
    document.head.appendChild(styleSheet);

    const card = document.querySelector('.preview-card');
    const container = document.querySelector('.code-area');

    container.addEventListener('mousemove', (e) => {
        const xAxis = (window.innerWidth / 2 - e.pageX) / 50;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 50;

        card.style.transform = `translate(${xAxis}px, ${yAxis}px)`;
    });
});
