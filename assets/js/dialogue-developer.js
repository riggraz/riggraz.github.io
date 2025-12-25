// i swear i usually write better code...

// Hide newsletter section and bottom back link button
const newsletterHr = document.getElementById('newsletter-hr');
const newsletter = document.getElementById('newsletter');
newsletterHr.style.display = 'none';
newsletter.style.display = 'none';

const allLinks = Array.from(document.querySelectorAll('a'));
const backLinks = allLinks.filter(link => link.textContent.trim().toLowerCase().includes('back'));
backLinks[1].style.display = 'none';

// Game data
let gameStarted = false;

const ghostSpriteL = new Image();
ghostSpriteL.src = '/assets/images/dialogue-developer/ghost-l.png';
const ghostSpriteR = new Image();
ghostSpriteR.src = '/assets/images/dialogue-developer/ghost-r.png';
let ghostSprite = ghostSpriteL;

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

// Game elements
let ball = { width: 56, height: 56, radius: 10 };
let ghost = { width: 72, height: 56, speed: 1 };
let timer = 0;

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
    gameDiv.style.marginBottom = '128px';
    scaleGameCanvas();

    // Set initial position for ball
    ball.x = 50;
    ball.y = gameCanvas.height - ball.height * 1.5;

    // Set initial position for ghost
    ghost.x = gameCanvas.width - ghost.width * 1.5;
    ghost.y = 50;

    ctx.font = '25px Arial';
    ctx.textAlign = 'center';

    gameCanvas.addEventListener('ontouchstart' in window ? 'touchstart' : 'mouseover', startGame);

    gameCanvas.scrollIntoView({
      behavior: "auto",
      block: "start",
      inline: "nearest"
    });

    draw();

    if ('ontouchstart' in window)
      ctx.fillText('Tap and drag to play', gameCanvas.width / 2, gameCanvas.height / 2);
    else
      ctx.fillText('Hover mouse to play', gameCanvas.width / 2, gameCanvas.height / 2);

    // Sometimes in Safari the canvas is blank
    // This timeout forces a redraw of the canvas
    setTimeout(function() {
      if (!gameStarted) {
        draw();

        if ('ontouchstart' in window)
          ctx.fillText('Tap and drag to play', gameCanvas.width / 2, gameCanvas.height / 2);
        else
          ctx.fillText('Hover mouse to play', gameCanvas.width / 2, gameCanvas.height / 2);
      }
    }, 100);
  };

  noButton.onclick = function() {
    responseLabel.innerHTML = 'No';
    yesButton.style.display = 'none';
    noButton.style.display = 'none';

    // Ask again
    const boyPlea = document.createElement('p');
    if (n !== boyPleas.length - 1)
      boyPlea.innerHTML = '<b>Kid</b>: ' + boyPleas[n];
    else
      boyPlea.innerHTML = '<i>' + boyPleas[n] + '</i>';
    decisionDiv.appendChild(boyPlea);

    askQuestion(n+1);
  };

  decisionDiv.appendChild(developerAnswer);
}

function startGame() {
  if (!gameStarted) {
    draw();
    play();
    gameStarted = true;
  }
}

function draw() {
  ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

  // Ball
  ctx.drawImage(ballSprite, ball.x, ball.y, ball.width, ball.height);

  // Ghost
  ctx.drawImage(ghostSprite, ghost.x, ghost.y, ghost.width, ghost.height);

  // Timer
  ctx.font = '25px Arial';
  ctx.fillText((timer / 1000).toFixed(2), 50, 40);
}

function handleBallMove(e) {
  const maxMovement = 100;
  
  if (e.type === 'touchmove')
    e.preventDefault(); // disable page scroll on touchscreens

  let rect = gameCanvas.getBoundingClientRect();
  let clientX, clientY;

  if (e.type === 'touchmove') {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  } else {
    clientX = e.clientX;
    clientY = e.clientY;
  }

  let newX = clientX - rect.left - ball.width / 2;
  let newY = clientY - rect.top - ball.height / 2;

  let dx = newX - ball.x;
  let dy = newY - ball.y;

  if (Math.abs(dx) > maxMovement) {
    newX = ball.x + (dx > 0 ? maxMovement : -maxMovement);
  }

  if (Math.abs(dy) > maxMovement) {
    newY = ball.y + (dy > 0 ? maxMovement : -maxMovement);
  }

  ball.x = newX;
  ball.y = newY;
}

function play() {
  let gameInterval;

  gameCanvas.addEventListener('mousemove', handleBallMove, { passive: false });
  gameCanvas.addEventListener('touchmove', handleBallMove, { passive: false });

  function updateGhost() {
    // Update ghost speed
    ghost.speed = Math.ceil(timer / 8000) + 1;
    let dx = ball.x - ghost.x;
    let dy = ball.y - ghost.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    
    // Update ghost position
    ghost.x += dx / distance * ghost.speed;
    ghost.y += dy / distance * ghost.speed;

    // Flip the image based on the direction of the ball
    if (ball.x < ghost.x)
      ghostSprite = ghostSpriteL;
    else
      ghostSprite = ghostSpriteR;
  }

  function checkCollision() {
    let dx = Math.abs(ball.x + ball.width / 2 - (ghost.x + ghost.width / 2));
    let dy = Math.abs(ball.y + ball.height / 2 - (ghost.y + ghost.height / 2));

    if (dx < (ball.width / 3 + ghost.width / 3)) {
      if (dy < (ball.height / 3 + ghost.height / 3)) {
        return true;
      }
    }

    return false;
  }

  function update() {
    updateGhost();
    draw();
    timer += 1000 / 60;
    if (checkCollision()) {
      clearInterval(gameInterval);

      ctx.font = '50px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Game Over!', gameCanvas.width / 2, gameCanvas.height / 2);

      const boyScore = document.getElementById('boyScore');
      boyScore.innerHTML = Math.ceil((timer / 1000) + 0.00000001).toFixed(2); // sorry :)

      // Enable scrolling the page by tapping on the canvas
      gameCanvas.style.touchAction = 'pan-y';
      gameCanvas.removeEventListener('ontouchstart' in window ? 'touchstart' : 'mouseover', startGame);
      gameCanvas.removeEventListener('mousemove', handleBallMove);
      gameCanvas.removeEventListener('touchmove', handleBallMove);

      // Restore game canvas margin bottom
      gameDiv.style.marginBottom = '0px';
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
