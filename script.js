const chooseBtnX = document.querySelector('.choose__btn--x');
const chooseBtnO = document.querySelector('.choose__btn--o');
const field = document.querySelectorAll('.field__item');
const startWindow = document.querySelector('.start-window__wrapper');
const resultWindow = document.querySelector('.result__wrapper');
const gameWindow = document.querySelector('.game__wrapper');
const resultImg = document.querySelector('.result__side');
const resultText = document.querySelector('.result__text');
const nextRoundBtn = document.querySelector('.next-round__btn');
const quitBtn = document.querySelector('.quit__btn');
const gameMenu = document.querySelector('.game__menu');
const resultBtns = document.querySelector('.result__btns');
const turnImg = document.querySelector('.current-player__img');
const playerXScore = document.querySelector('.score--x');
const playerOScore = document.querySelector('.score--o');
const tiesScore = document.querySelector('.score--ties');

const newGamePlayerBtn = document.querySelector('.start-window__btn--player');
const newGameCPUBtn = document.querySelector('.start-window__btn--cpu');

const cancelBtn = document.createElement('div');
const restartBtn = document.createElement('div');

const playerX = 'X';
const playerO = 'O';
const statistics = {
    playerX: 0,
    playerO: 0,
    ties: 0
}
let playWithCPU = false;

let currentPlayer = playerX;
let gameEnded = false;
let board = ['', '', '', '', '', '', '', '', ''];
let filledField = [];

addHover();

function checkRandom() {
    if (filledField.length === 9) {
        return;
    }

    const random = Math.floor((Math.random() * 9));

    if (filledField.includes(random)) {
        return checkRandom();
    }

    return random;
}

newGameCPUBtn.addEventListener('click', () => {
    newGame();
    // currentPlayer -> X
    playWithCPU = true;

    if (chooseBtnX.classList.contains('active-x')) {
        currentPlayer = playerX; // currentPlayer -> O
    } else if (chooseBtnO.classList.contains('active-o')) {
        cpuAction('x');
        currentPlayer = playerO; // currentPlayer -> X
    }

    startWindow.style.display = 'none';
    gameWindow.style.display = 'block';
    addHover();
});

newGamePlayerBtn.addEventListener('click', () => {
    startWindow.style.display = 'none';
    gameWindow.style.display = 'block';
    newGame();
    playWithCPU = false;
});

function addHover() {
     if (currentPlayer === playerX) {
        field.forEach(item => {
            item.classList.add('field__item--activeX');
            item.classList.remove('field__item--activeO');
        });

    } else if (currentPlayer === playerO) {
        field.forEach(item => {
            item.classList.add('field__item--activeO');
            item.classList.remove('field__item--activeX');
        });
    }
}

function clearTurnBtns(...btns) {
    btns.forEach(item => item.remove());
    quitBtn.style.display = 'flex';
    nextRoundBtn.style.display = 'flex';
    resultImg.style.display = 'block';
    resultText.textContent = 'takes the round';
}

function calcStatistics() {
    playerXScore.textContent = `${statistics.playerX}`;
    playerOScore.textContent = `${statistics.playerO}`;
    tiesScore.textContent = `${statistics.ties}`;
}

function showSureWindow(titleText, buttonText) {
    cancelBtn.classList.add('cancel');
    restartBtn.classList.add('restart');

    quitBtn.style.display = 'none';
    nextRoundBtn.style.display = 'none';
    resultImg.style.display = 'none';
    resultText.textContent = titleText;
    resultText.style.color = '#A8BFC9';
    cancelBtn.textContent = 'NO, CANCEL';
    restartBtn.textContent = buttonText;

    resultBtns.append(cancelBtn);
    resultBtns.append(restartBtn);

    // resultWindow.style.paddingTop = '60px';
    resultWindow.style.display = 'flex';
    gameWindow.classList.add('non-active');
}

gameMenu.addEventListener('click', (e) => {
    if (e.target.classList.contains('game__turn-btn')) {
        showSureWindow('RESTART GAME?','YES, RESTART' );
    } else if (e.target.classList.contains('game__exit-btn')) {
        showSureWindow('QUIT THE GAME?','YES, QUIT' );
    }
});

function goStartPage() {
    resultWindow.style.display = 'none';
    gameWindow.style.display = 'none';
    startWindow.style.display = 'block';
    for (const key in statistics) {
        statistics[key] = 0;
    }
    calcStatistics();
}

resultWindow.addEventListener('click', (e) => {
    if (e.target.classList.contains('cancel')) {
        resultWindow.style.display = 'none';
        gameWindow.classList.remove('non-active');
        clearTurnBtns(cancelBtn, restartBtn);
    }

    if (e.target.classList.contains('restart') && e.target.textContent === 'YES, RESTART') {
        newGame();
        addHover();
        turnImg.src = 'images/icon-x-gray.svg';

        if (playWithCPU && chooseBtnO.classList.contains('active-o')) {
            cpuAction('x');
            swapCurrentPlayer();
            addHover();
        }
        clearTurnBtns(cancelBtn, restartBtn);
    } else if (e.target.classList.contains('restart') && e.target.textContent === 'YES, QUIT') {
        goStartPage();
        clearTurnBtns(cancelBtn, restartBtn);
    }

   
});

chooseBtnX.addEventListener('click', () => {
    chooseBtnX.classList.add('active-x');
    chooseBtnO.classList.remove('active-o');
});

chooseBtnO.addEventListener('click', () => {
    chooseBtnO.classList.add('active-o');
    chooseBtnX.classList.remove('active-x');
});

quitBtn.addEventListener('click', (e) => {
    goStartPage();
});

field.forEach(item => {
    item.addEventListener('click', (e) => {

        if (currentPlayer === 'X' && !gameEnded && !item.classList.contains('game__field')) {
            handleFieldClick(e, "icon-x");

            if (checkWin(currentPlayer)) {
                showWinWindow("#31C3BD");
                calcStatistics();
                return;
            } else if (checkDraw() && checkWin() === false) {
                showTiesWindow();
                calcStatistics();
                return;
            }

            turnImg.src = 'images/icon-x-gray.svg';
            calcStatistics();
            swapCurrentPlayer();
            addHover();
        } else if (currentPlayer === 'O' && !gameEnded && !item.classList.contains('game__field')) {
            handleFieldClick(e, "icon-o");

            if (checkWin(currentPlayer)) {
                showWinWindow("#F2B137");
                calcStatistics();
                return;
            } else if (checkDraw() && checkWin() === false) {
                showTiesWindow();
                calcStatistics();
                return;
            }

            turnImg.src = 'images/icon-o-gray.svg';
            calcStatistics();
            swapCurrentPlayer();
            addHover();
        }

        if (playWithCPU && currentPlayer === playerO && !board.every((field) => field !== '')) {
            cpuAction('o');

            if (checkWin(currentPlayer)) {
                showWinWindow("#F2B137");
            } else if (checkDraw() && checkWin() === false) {
                showTiesWindow();
            }

            swapCurrentPlayer();
            addHover();
            calcStatistics();
    } else if (playWithCPU && currentPlayer === playerX && !board.every((field) => field !== '')) {
            cpuAction('x');

            if (checkWin(currentPlayer)) {
                showWinWindow("#31C3BD");
            } else if (checkDraw() && checkWin() === false) {
                showTiesWindow();
            }

            swapCurrentPlayer();
            addHover();
            calcStatistics();

        }
    });
});

nextRoundBtn.addEventListener('click', () => {
    newGame();
    if (playWithCPU && chooseBtnO.classList.contains('active-o')) {
        // currentPlayer = playerO;
        cpuAction('x');
        swapCurrentPlayer();
        addHover();
    }
});

function cpuAction(image) {
    let randomField = checkRandom();

    if (filledField.length !== 9) {
        field[randomField].style.background = `url("images/icon-${image}.svg") center no-repeat, #1F3641`;
        field[randomField].style.pointerEvents = 'none';
    }
    board[randomField] = currentPlayer;
    console.log(board);
    filledField.push(randomField);
}

function checkWin(player) {
    return (
        (board[0] === player && board[1] === player && board[2] === player) ||
        (board[3] === player && board[4] === player && board[5] === player) ||
        (board[6] === player && board[7] === player && board[8] === player) ||
        (board[0] === player && board[3] === player && board[6] === player) ||
        (board[1] === player && board[4] === player && board[7] === player) ||
        (board[2] === player && board[5] === player && board[8] === player) ||
        (board[0] === player && board[4] === player && board[8] === player) ||
        (board[2] === player && board[4] === player && board[6] === player)
    );
}

function checkDraw() {
    return board.every((field) => field !== '');
}

function newGame() {
    currentPlayer = playerX;
    gameEnded = false;
    board = ['', '', '', '', '', '', '', '', ''];
    resultImg.style.display = 'block';
    resultText.style.color = '#31C3BD';
    resultText.textContent = 'takes the round';

    field.forEach(item => {
        item.style.pointerEvents = 'auto';
        item.style.background = '';
    });

    if (gameWindow.classList.contains('non-active')) {
        gameWindow.classList.remove('non-active');
    }

    resultWindow.style.display = 'none';
    filledField = [];
}

function handleFieldClick(e, images) {
    const item = e.target;
    const itemIndex = e.target.id;
    item.style.background = `url("images/${images}.svg") center no-repeat, #1F3641`;
    item.style.pointerEvents = 'none';
    board[itemIndex] = currentPlayer;
    filledField.push(+itemIndex);
}

function showWinWindow(color) {
    resultImg.src = `images/icon-${currentPlayer.toLowerCase()}.svg`;
    resultText.style.color = color;

    if (currentPlayer === 'X') {
        statistics.playerX += 1;
    } else if (currentPlayer === 'O') {
        statistics.playerO += 1;
    }

    resultWindow.style.display = 'flex';
    gameWindow.classList.add('non-active');
    gameEnded = true;
}

function showTiesWindow() {
    gameWindow.classList.add('non-active');
    resultImg.style.display = 'none';
    resultText.style.color = '#A8BFC9';
    resultText.textContent = 'ROUND TIED';
    resultWindow.style.display = 'flex';
    gameEnded = true;
    statistics.ties += 1;
}

function swapCurrentPlayer() {
    if (currentPlayer === 'X') {
        currentPlayer = playerO;
    } else {
        currentPlayer = playerX;
    }
}



