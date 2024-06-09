document.addEventListener('DOMContentLoaded', () => {
    const playButton = document.getElementById('playButton');
    const playButtonContainer = document.querySelector('.play-button-container');
    const gameContainer = document.querySelector('.game-container');
    const gridContainer = document.querySelector('.grid-container');
    const scoreDisplay = document.getElementById('score');
    const bestScoreDisplay = document.getElementById('bestScore');
    const restartButton = document.getElementById('restartButton');
    const gameOver = document.getElementById('gameOver');
    const overlay = document.getElementById('overlay');
    const gridSize = 5;
    let sequence = [];
    let playerSequence = [];
    let level = 1;
    let clickable = false;
    let score = 0;
    let bestScore = localStorage.getItem('bestScore') ? parseInt(localStorage.getItem('bestScore')) : 0;

    const colors = ['#ffcc00', '#ff5733', '#33ff57', '#3357ff', '#f033ff'];

    for (let i = 0; i < gridSize * gridSize; i++) {
        const button = document.createElement('button');
        button.addEventListener('click', () => handleButtonClick(i));
        gridContainer.appendChild(button);
    }

    const buttons = document.querySelectorAll('.grid-container button');

    playButton.addEventListener('click', () => {
        playButtonContainer.style.display = 'none';
        gameContainer.style.display = 'flex';
        startGame();
    });

    restartButton.addEventListener('click', () => {
        overlay.style.display = 'none';
        buttons.forEach(button => {
            button.style.visibility = 'visible';
        });
        startGame();
    });

    function startGame() {
        sequence = [];
        playerSequence = [];
        level = 1;
        score = 0;
        updateScore();
        nextSequence();
    }

    function nextSequence() {
        playerSequence = [];
        const randomIndex = Math.floor(Math.random() * buttons.length);
        sequence.push(randomIndex);
        animateSequence();
    }

    function animateSequence() {
        clickable = false;
        let i = 0;

        const interval = setInterval(() => {
            if (i > 0) {
                buttons[sequence[i - 1]].style.backgroundColor = '';
            }

            if (i === sequence.length) {
                clearInterval(interval);
                clickable = true;
                return;
            }

            const button = buttons[sequence[i]];
            const color = colors[i % colors.length];
            button.style.backgroundColor = color;

            setTimeout(() => {
                button.style.backgroundColor = '';
                i++;
            }, 400);

        }, 800);
    }

    function handleButtonClick(index) {
        if (!clickable) return;

        playerSequence.push(index);
        if (playerSequence[playerSequence.length - 1] !== sequence[playerSequence.length - 1]) {
            buttons[index].style.backgroundColor = 'black';
            setTimeout(() => buttons[index].style.backgroundColor = '', 400);

            buttons.forEach(button => {
                button.style.visibility = 'hidden';
            });

            if (score > bestScore) {
                bestScore = score;
                localStorage.setItem('bestScore', bestScore);
                updateBestScore();
            }
            showOverlay();
            return;
        }

        buttons[index].classList.add('correct');
        setTimeout(() => buttons[index].classList.remove('correct'), 400);

        if (playerSequence.length === sequence.length) {
            level++;
            score++;
            updateScore();
            setTimeout(() => {
                buttons.forEach(button => {
                    button.style.visibility = 'visible';
                    button.style.backgroundColor = '#a8a8a8';
                });
                nextSequence();
            }, 400);
        }
    }

    function updateScore() {
        scoreDisplay.textContent = score;
    }

    function updateBestScore() {
        bestScoreDisplay.textContent = bestScore;
    }

    function showOverlay() {
        overlay.style.display = 'flex';
    }

    updateBestScore();
});
