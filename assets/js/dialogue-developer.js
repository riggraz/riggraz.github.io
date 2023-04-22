const yesButton = document.getElementById('yesInteractive');
const noButton = document.getElementById('noInteractive');
const responseLabel = document.getElementById('response');

const gameCanvas = document.getElementById('gameCanvas');

function hideButtons() {
  yesButton.style.display = 'none';
  noButton.style.display = 'none';
}

yesButton.onclick = function() {
  hideButtons();
  responseLabel.innerHTML = 'Yes';
  gameCanvas.innerHTML = 'YES';
};

noButton.onclick = function() {
  hideButtons();
  responseLabel.innerHTML = 'No';
  gameCanvas.innerHTML = 'NO';
};