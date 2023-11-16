let ghostSprite = new Image();
ghostSprite.src = '/assets/images/dialogue-developer/ghost.png';

let ballSprite = new Image();
ballSprite.src = '/assets/images/dialogue-developer/ball.png'

const boyPleas = [
  'Please!',
  'You <i>have</i> to play it!',
  'I\'d really like to show it to somebody...',
  'C\'mon...',
  undefined,
  'Hey! It wasn\'t a bug! Play my game!',
  'PLAY. MY. GAME!!!',
  'An small asteroid fell from the sky, destroying the \'No\' button...',
];

// Get DOM elements
const decisionDiv = document.getElementById('decision');

const gameDiv = document.getElementById('game');
gameDiv.style.display = 'none';

const gameCanvas = document.getElementById('gameCanvas');
gameCanvas.style.border = 'thin solid black';
gameCanvas.style.display = 'block';
gameCanvas.style.margin = '32px auto';
const ctx = gameCanvas.getContext('2d');

function scaleGameCanvas() {
  const gameCanvasAR = 4/3;
  const parentWidth = gameCanvas.parentNode.offsetWidth;
  gameCanvas.width = Math.min(parentWidth, 480);
  gameCanvas.height = gameCanvas.width / gameCanvasAR;
}

// Hide all successive paragraphs of text
let hide = false;
for (let i = 0; i < gameDiv.parentNode.children.length; i++) {
  let child = gameDiv.parentNode.children[i];

  if (child === gameDiv) hide = true;
  if (hide) child.style.display = 'none';
}

// Method to create elements to ask question 'Yes' 'No'
function askQuestion(n) {
  const developerAnswer = document.createElement('p');

  const developerLabel = document.createElement('label');
  developerLabel.innerHTML = '<b>Developer</b>: ';
  developerAnswer.appendChild(developerLabel);

  const yesButton = document.createElement('button');
  yesButton.innerHTML = 'Yes';
  yesButton.style.marginRight = '8px';
  developerAnswer.appendChild(yesButton);

  const noButton = document.createElement('button');
  // If shown all possible boy pleas, don't show the 'No' button
  if (n < boyPleas.length) {
    noButton.innerHTML = 'No';
    developerAnswer.appendChild(noButton);
  }

  const responseLabel = document.createElement('label');
  developerAnswer.appendChild(responseLabel);

  yesButton.onclick = function() {
    responseLabel.innerHTML = 'Yes';
    yesButton.style.display = 'none';
    noButton.style.display = 'none';
    
    // Start game
    gameDiv.style.display = 'block';
    scaleGameCanvas();

    let gameStarted = false;
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Hover mouse to start playing', gameCanvas.width / 2, gameCanvas.height / 2);
    gameCanvas.addEventListener('mouseover', function(e) {
      if (!gameStarted) {
        ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        play();
        gameStarted = true;
      }
    });
  };

  noButton.onclick = function() {
    responseLabel.innerHTML = 'No';
    yesButton.style.display = 'none';
    noButton.style.display = 'none';

    // Ask again
    const boyPlea = document.createElement('p');
    if (n !== boyPleas.length - 1)
      boyPlea.innerHTML = '<b>Young boy</b>: ' + boyPleas[n];
    else
      boyPlea.innerHTML = '<i>' + boyPleas[n] + '</i>';
    decisionDiv.appendChild(boyPlea);

    askQuestion(n+1);
  };

  decisionDiv.appendChild(developerAnswer);
}

function play() {
  let ball = { x: 0, y: 0, width: 56, height: 56, radius: 10 };
  let ghost = { x: 200, y: 200, width: 72, height: 56, speed: 1 };
  let timer = 0;
  let gameInterval;

  function handleBallMove(e) {
    let rect = gameCanvas.getBoundingClientRect();
    ball.x = e.clientX - rect.left - ball.width / 2;
    ball.y = e.clientY - rect.top - ball.height / 2;
  }

  gameCanvas.addEventListener('mousemove', handleBallMove);
  gameCanvas.addEventListener('touchmove', handleBallMove);

  function updateGhost() {
    // Update ghost speed
    ghost.speed = Math.ceil(timer / 500) + 1;
    let dx = ball.x - ghost.x;
    let dy = ball.y - ghost.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    ghost.x += dx / distance * ghost.speed;
    ghost.y += dy / distance * ghost.speed;
  }

  function checkCollision() {
    let dx = Math.abs(ball.x + ball.width / 2 - (ghost.x + ghost.width / 2));
    let dy = Math.abs(ball.y + ball.height / 2 - (ghost.y + ghost.height / 2));

    if (dx < (ball.width / 2 + ghost.width / 2)) {
      if (dy < (ball.height / 2 + ghost.height / 2)) {
        return true;
      }
    }

    return false;
  }

  function draw() {
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    // Ball
    ctx.drawImage(ballSprite, ball.x, ball.y, ball.width, ball.height);

    // Ghost
    ctx.drawImage(ghostSprite, ghost.x, ghost.y, ghost.width, ghost.height);

    // Timer
    ctx.font = '20px Arial';
    ctx.fillText(timer, 30, 30);
  }

  function update() {
    updateGhost();
    draw();
    timer++;
    if (checkCollision()) {
      clearInterval(gameInterval);

      const boyScore = document.getElementById('boyScore');
      boyScore.innerHTML = timer + 9; // sorry :)

      // Show all successive paragraphs of text
      let show = false;
      for (let i = 0; i < gameDiv.parentNode.children.length; i++) {
        let child = gameDiv.parentNode.children[i];

        if (child === gameDiv) show = true;
        if (show) child.style.display = 'block';
      }
    }
  }

  function startGame() {
    gameInterval = setInterval(update, 1000 / 60);
  }

  startGame();
}

askQuestion(0);
