if (location.hash === "#continue-reading") {

// Ascii Art by Joan G. Stark (https://www.asciiart.eu/people/occupations/police)

const soldier = String.raw`
             ,
        _.-"   '-.
       '._ __{}_(
         |'--.__\
        (   ^_\^
         |   _ |
         )\___/
     .--' :._]
    /  \      '-.
`;

const soldierBlock = String.raw`
              ,
     __  _.-"   '-.
    /||\'._ __{}_(
    ||||  |'--.__\
    |  L.(   ^_\^
    \ .-' |   _ |
    | |   )\___/
    |  \-' :._]
    \__/;      '-.
`;

let soldierHtml;
let soldierBR;
let soldierWidth, soldierHeight;
let soldierPosX, soldierPosY;

const urlHtml = document.getElementById("url");
urlHtml.style.cursor = "not-allowed";

document.addEventListener('DOMContentLoaded', createSoldier);

function createSoldier() {
  soldierHtml = document.createElement("pre");
  soldierHtml.innerHTML = soldier;
  soldierHtml.style.display = "block";
  soldierHtml.style.fontSize = "12px";
  soldierHtml.setAttribute("id", "soldier");
  soldierHtml.style.backgroundColor = "white";
  soldierHtml.style.cursor = "not-allowed";
  document.body.append(soldierHtml);

  positionSoldier();
  window.addEventListener("resize", positionSoldier);
}

function positionSoldier() {
  if (window.innerWidth < 840) {
    soldierHtml.style.display = "none";
    return;
  } else {
    soldierHtml.style.display = "block";
  }

  soldierBR = soldierHtml.getBoundingClientRect();
  [soldierWidth, soldierHeight] = [soldierBR.width, soldierBR.height];

  const urlBoundingRect = urlHtml.getBoundingClientRect();

  soldierPosX =
    urlBoundingRect.x - 150;

  soldierPosY =
    urlBoundingRect.y +
    document.documentElement.scrollTop -
    soldierHeight +
    30;

  soldierHtml.style.position = "absolute";
  soldierHtml.style.left = `${soldierPosX}px`;
  soldierHtml.style.top = `${soldierPosY}px`;
}

urlHtml.addEventListener("mouseover", e => {
  soldierHtml.style.left = `${e.clientX - 100}px`;
  soldierHtml.innerHTML = soldierBlock;
});
urlHtml.addEventListener("mouseleave", () => {
  soldierHtml.style.left = `${soldierPosX}px`;
  soldierHtml.innerHTML = soldier;
});
}