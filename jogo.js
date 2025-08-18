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

function shuffle(array) {
  return array.sort(() => 0.5 - Math.random());
}

function createBoard() {
  gameBoard.innerHTML = '';
  finalMessage.classList.add('hidden');
  cards = shuffle(cards);
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

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

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

function checkForMatch() {
  const isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;

  if (isMatch) {
    disableCards();
  } else {
    unflipCards();
  }
}

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

function resetBoard() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

function updateScore() {
  scoreDisplay.textContent = `Movimentos: ${moves}`;
}

function calculatePoints(moves) {
  const maxScore = 100;
  const minMoves = cardsArray.length; // Mínimo possível de movimentos = 8 pares = 8 movimentos
  let penalty = ( maxScore - moves )
  let final = maxScore - penalty;
  return final < 0 ? 0 : final;
}

function endGame() {
  finalMoves.textContent = moves;
  finalPoints.textContent = 100 - (calculatePoints(moves));
  finalMessage.classList.remove('hidden');
}

restartButton.addEventListener('click', createBoard);

createBoard();

function mostrarFinalMessage() {
  document.getElementById('finalMessage').classList.remove('hidden');
  document.getElementById('showScoresButton').classList.remove('hidden');
}

// Chame mostrarFinalMessage() quando o jogo for completado