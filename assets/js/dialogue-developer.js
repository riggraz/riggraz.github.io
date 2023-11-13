const possibleChildPleas = [
  'Please!',
  'You <i>have</i> to play it!',
  'I\'d really like to show it to somebody...',
  'C\'mon...',
  undefined,
  'Hey! It wasn\'t a bug! Play my game!',
  'PLAY',
  'MY',
  'GAME',
  '!!!',
  '...',
  'I\'m the ruler of this world and you <i>must</i> play my game.',
];

const decisionDiv = document.getElementById('decision');

const responseYesDiv = document.getElementById('responseYes');
const afterGameDiv = document.getElementById('afterGame');
responseYesDiv.style.display = 'none';
afterGameDiv.style.display = 'none';

const gameCanvas = document.getElementById('gameCanvas');
gameCanvas.style.border = 'thin solid black';

function askQuestion(n) {
  const developerAnswer = document.createElement('p');

  const developerLabel = document.createElement('label');
  developerLabel.innerHTML = '<b>Developer</b>: ';
  developerAnswer.appendChild(developerLabel);

  const yesButton = document.createElement('button');
  yesButton.innerHTML = 'Yes';
  developerAnswer.appendChild(yesButton);

  const noButton = document.createElement('button');
  if (n < possibleChildPleas.length) {
    noButton.innerHTML = 'No';
    developerAnswer.appendChild(noButton);
  }

  const responseLabel = document.createElement('label');
  developerAnswer.appendChild(responseLabel);

  yesButton.onclick = function() {
    responseLabel.innerHTML = 'Yes';
    yesButton.style.display = 'none';
    noButton.style.display = 'none';
    responseYesDiv.style.display = 'block';
  };

  noButton.onclick = function() {
    yesButton.style.display = 'none';
    noButton.style.display = 'none';
    responseLabel.innerHTML = 'No';

    // Ask again
    const childPlea = document.createElement('p');
    childPlea.innerHTML = '<b>Young boy</b>: ' + possibleChildPleas[n];
    decisionDiv.appendChild(childPlea);

    askQuestion(n+1);
  };

  decisionDiv.appendChild(developerAnswer);
}

askQuestion(0);