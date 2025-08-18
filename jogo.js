const cardsArray = ['🍎', '🍌', '🍇', '🍓', '🍍', '🥝', '🍉', '🍒']; 
let cards = [...cardsArray, ...cardsArray];

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let matchedPairs = 0;

const gameBoard = document.getElementById('gameBoard');
const restartButton = document.getElementById('restartButton');
const scoreDisplay = document.getElementById('score');
const finalMessage = document.getElementById('finalMessage');
const finalMoves = document.getElementById('finalMoves');
const finalPoints = document.getElementById('finalPoints');

const btnStart = document.getElementById('btnStart');
const btnRules = document.getElementById('btnRules');
const btnScores = document.getElementById('btnScores');
const btnMenuFromGame = document.getElementById('btnMenuFromGame');
const btnBackMenu = document.querySelectorAll('.btnBackMenu');

const menu = document.getElementById('menu');
const gameScreen = document.getElementById('gameScreen');
const rulesScreen = document.getElementById('rulesScreen');
const scoresScreen = document.getElementById('scoresScreen');
const scoresList = document.getElementById('scoresList');

// Recupera histórico do localStorage
let scoresHistory = JSON.parse(localStorage.getItem("scoresHistory")) || [];

// Embaralhar
function shuffle(array) {
  return array.sort(() => 0.5 - Math.random());
}

// Criar tabuleiro
function createBoard() {
  gameBoard.innerHTML = '';
  finalMessage.classList.add('hidden');
  cards = shuffle(cardsArray.concat(cardsArray));
  moves = 0;
  matchedPairs = 0;
  updateScore();

  cards.forEach((emoji) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.emoji = emoji;
    card.innerText = '';
    card.addEventListener('click', flipCard);
    gameBoard.appendChild(card);
  });
}

// Virar carta
function flipCard() {
  if (lockBoard || this === firstCard || this.classList.contains('matched')) return;

  this.innerText = this.dataset.emoji;
  this.classList.add('flipped');

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  moves++;
  updateScore();
  checkForMatch();
}

// Verifica se é par
function checkForMatch() {
  const isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;

  if (isMatch) {
    disableCards();
  } else {
    unflipCards();
  }
}

// Desativa cartas iguais
function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  firstCard.classList.add('matched');
  secondCard.classList.add('matched');
  matchedPairs++;
  resetBoard();

  if (matchedPairs === cardsArray.length) {
    endGame();
  }
}

// Vira cartas erradas
function unflipCards() {
  lockBoard = true;
  setTimeout(() => {
    firstCard.innerText = '';
    secondCard.innerText = '';
    firstCard.classList.remove('flipped');
    secondCard.classList.remove('flipped');
    resetBoard();
  }, 1000);
}

// Resetar jogada
function resetBoard() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

// Atualiza o placar
function updateScore() {
  scoreDisplay.textContent = `Movimentos: ${moves}`;
}

// Calcula pontos
function calculatePoints(moves) {
  const maxScore = 100;
  const penalty = moves - cardsArray.length;
  const final = maxScore - penalty * 5;
  return final < 0 ? 0 : final;
}

// Fim de jogo
function endGame() {
  const points = calculatePoints(moves);
  finalMoves.textContent = moves;
  finalPoints.textContent = points;
  finalMessage.classList.remove('hidden');

  // Salva no histórico
  scoresHistory.push({ moves, points, date: new Date().toLocaleString() });
  localStorage.setItem("scoresHistory", JSON.stringify(scoresHistory));
}

// Renderiza pontuações
function renderScores() {
  scoresList.innerHTML = "";
  scoresHistory
    .sort((a, b) => b.points - a.points) // Ranking por pontos
    .forEach((score, i) => {
      const li = document.createElement("li");
      li.textContent = `#${i + 1} - ${score.points} pontos (${score.moves} movimentos) em ${score.date}`;
      scoresList.appendChild(li);
    });
}

// ==== Troca de telas ==== //
btnStart.addEventListener('click', () => {
  menu.classList.add('hidden');
  gameScreen.classList.remove('hidden');
  createBoard();
});

btnRules.addEventListener('click', () => {
  menu.classList.add('hidden');
  rulesScreen.classList.remove('hidden');
});

btnScores.addEventListener('click', () => {
  menu.classList.add('hidden');
  scoresScreen.classList.remove('hidden');
  renderScores();
});

btnMenuFromGame.addEventListener('click', () => {
  gameScreen.classList.add('hidden');
  menu.classList.remove('hidden');
});

btnBackMenu.forEach(btn => {
  btn.addEventListener('click', () => {
    rulesScreen.classList.add('hidden');
    scoresScreen.classList.add('hidden');
    menu.classList.remove('hidden');
  });
});

restartButton.addEventListener('click', createBoard);

// Inicia no menu
menu.classList.remove('hidden');
gameScreen.classList.add('hidden');
rulesScreen.classList.add('hidden');
scoresScreen.classList.add('hidden');

btnScores.addEventListener('click', () => {
    menu.classList.add('hidden');
    scoresScreen.classList.remove('hidden');
    renderScores();
  
    // Calcula a pontuação final
    const finalScore = 100 - moves; // Substitua "moves" pela variável que rastreia os movimentos
  
    // Cria e exibe o texto com a pontuação final
    const finalScoreText = document.createElement('p');
    finalScoreText.textContent = `Sua pontuação foi ${finalScore}`;
    scoresScreen.appendChild(finalScoreText); // Adiciona o texto à tela de pontuação
  });