let scene = 1; // 1 for Snake, 2 for Bouncing Ball
let mic;
let clapThreshold = 0.2; // Threshold for detecting a clap/noise
let lastSwitchTime = 0;
let switchCooldown = 1000;

// Snake Game Variables
let gridSize = 30; // Square grid
let gameStarted = false;
let startingSegments = 10;
let startDirection = 'right';
let direction = startDirection;
let segments = [];
let score = 0;
let fruit;
let snakeSpeed = 2; // Adjust this value to change speed (in milliseconds)
let lastMoveTime = 0; // Tracks the last move time
let eatingSound;





// Bouncing Ball Game Variables
let ball1,ball2,ball3,ball4, ballR;

// Grid Scaling
let cellSize;

function setup() {
  createCanvas(windowWidth, windowHeight);
  bg= loadImage("wp2409705.jpg")
  bg2 = loadImage("wp11165475.webp")
  mic = new p5.AudioIn();
  mic.start();
  eatingSound = loadSound('eating-chips-81092.mp3');


  cellSize = 15; // Fixed cell size for clarity
  gridWidth = floor(width / cellSize);
  gridHeight = floor(height / cellSize);
 // Ensure square cells
 frameRate(120)
  initializeScene();
  textAlign(CENTER, CENTER);
  noLoop();
}

function draw() {
  background(0);

  // Get the overall volume
  let vol = mic.getLevel();

  // Detect sound to switch scenes
  if (vol > clapThreshold && millis() - lastSwitchTime > switchCooldown) {
    switchScene();
    lastSwitchTime = millis();
  }

  if (scene === 1) {
    drawSnake();
  } else if (scene === 2) {
    drawBouncingBall();
  }

  displayInstructions();
}

function displayInstructions() {
  fill(255);
  textSize(16);
  text(
    `Make a noise to switch scenes `,
    width / 2,
    height - 30
  );
}

///////////////////////
// Scene Management
///////////////////////
function switchScene() {
  scene = scene === 1 ? 2 : 1;
  initializeScene();
}

function initializeScene() {
  if (scene === 1) {
    setupSnake();
  } else if (scene === 2) {
    setupBouncingBall();
  }
}

///////////////////////
// Snake Game Functions
///////////////////////
function setupSnake() {
  startGame();
}


function drawSnake() {
  background(bg);
  if (gameStarted === false) {
    showStartScreen();
  } else {
    showFruit();
    showSegments();
   
  if (millis() - lastMoveTime >= snakeSpeed) {
  updateSegments();
  checkForCollision();
  checkForFruit();
  lastMoveTime = millis(); // Reset the timer
  text(`Score: ${score}`, width / 1.5, height - 30); 
}

  }
}

function showStartScreen() {
  noStroke();
  fill(32);
  rectMode(CENTER);
  rect(width / 2, height / 2, 300, 100, 10);
  fill(255);
  textSize(24);
  text('Click to play.\nUse arrow keys to move.', width / 2, height / 2);
  noLoop();
}

function mousePressed() {
  if (scene === 1 && !gameStarted) {
    startGame();
  } else if (!isLooping()) {
    loop();
  }
}

function startGame() {
  updateFruitCoordinates();
  segments = [];
  for (let i = 0; i < startingSegments; i++) {
    segments.unshift(createVector(i, gridSize / 2));
  }
  direction = startDirection;
  score = 0;
  gameStarted = true;
  loop();
}

function showFruit() {
  fill(255, 0, 0);
  ellipse(fruit.x * cellSize + cellSize / 2, fruit.y * cellSize + cellSize / 2, cellSize * 1 );
}

function showSegments() {
  fill(0, 255, 0);
  for (let segment of segments) {
    rect(segment.x * cellSize, segment.y * cellSize, cellSize, cellSize);
  }
}

function updateSegments() {
  segments.pop();
  let head = segments[0].copy();
  switch (direction) {
    case 'right': head.x++; break;
    case 'left': head.x--; break;
    case 'up': head.y--; break;
    case 'down': head.y++; break;
  }
  segments.unshift(head);
}

function checkForCollision() {
  let head = segments[0];

  // Check against dynamic grid boundaries
  if (
    head.x < 0 || 
    head.y < 0 || 
    head.x >= gridWidth || 
    head.y >= gridHeight || 
    selfColliding()
  ) {
    gameOver();
  }
}


function selfColliding() {
  let head = segments[0];
  for (let i = 1; i < segments.length; i++) {
    if (segments[i].equals(head)) return true;
  }
  return false;
}

function checkForFruit() {
  let head = segments[0];
  if (head.equals(fruit)) {
    eatingSound.play();
    score++;
    segments.push(segments[segments.length - 1].copy());
    updateFruitCoordinates();
  }
}

function updateFruitCoordinates() {
  fruit = createVector(floor(random(gridWidth)), floor(random(gridHeight)));
}

function gameOver() {
  fill(255, 0, 0);
  textSize(32);
  text('Game Over! Click to restart.', width / 2, height / 2.2);
  text(` Score: ${score}`, width / 2, height / 2 + 22);
  gameStarted = false;
  noLoop();
}

///////////////////////
// Bouncing Ball Game
///////////////////////
function setupBouncingBall() {
  ball1 = width / 2;
  ball2 = height / 2;
  ball3 = 4;
  ball4 = 3;
  ballR = min(width, height) / 19;
}

function drawBouncingBall() {
  background(bg2);
  ellipse(ball1, ball2, ballR * 2);
  fill(128, 0, 128);
  

  ball1 += ball3;
  ball2 += ball4;


  if (ball1 - ballR < 0 || ball1 + ballR > width) ball3 *= -1;
  if (ball2 - ballR < 0 || ball2 + ballR > height) ball4 *= -1;
  
  
}

///////////////////////
// Input Handling
///////////////////////
function keyPressed() {
  if (scene === 1) {
    switch (keyCode) {
      case LEFT_ARROW: if (direction !== 'right') direction = 'left'; break;
      case RIGHT_ARROW: if (direction !== 'left') direction = 'right'; break;
      case UP_ARROW: if (direction !== 'down') direction = 'up'; break;
      case DOWN_ARROW: if (direction !== 'up') direction = 'down'; break;
    }
  }
}
