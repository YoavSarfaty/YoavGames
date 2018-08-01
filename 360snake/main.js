let snake;
let pos;
let vel;
let food;
let angle;
let radius;
let scl;
let snakeLength;
let foodtime;
let restarttime;


function setup() {
  createCanvas(windowWidth, windowHeight);
  radius = min(width, height) / 2.1;
  scl = min(width, height) / 500 * 2;
  restart();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  radius = min(width, height) / 2.1;
  scl = min(width, height) / 500 * 2;
}

function draw() {
  background(255);
  let hit = false;
  for (let i = 10; i < snakeLength; i++) {
    let tail = snake.posI(snakeLength - i);
    if (p5.Vector.dist(pos, tail) < scl) {
      hit = true;
    }
  }

  if (hit && frameCount - restarttime > 100) restart();

  else if (p5.Vector.dist(pos, createVector(0, 0)) > radius) {
    restart();
  } else if (p5.Vector.dist(pos, food) < 8 * scl) {
    snakeLength += 10;
    createFood();
    for (let i = 0; i < 10; i++) {
      // snake.addSegment(2 * scl);
      let old = snake;
      snake = new Segment(2 * scl, old.posI(0).x, old.posI(0).y);
      snake.child = old;
    }
    // pos.add(p5.Vector.mult(vel, 10 * scl));
    // snake.follow(pos.x, pos.y);
  }
  if (keyCode == RIGHT_ARROW && keyIsPressed) {
    angle += 0.1;
  }
  if (keyCode == LEFT_ARROW && keyIsPressed) {
    angle -= 0.1;
  }
  vel.x = cos(angle) * scl;
  vel.y = sin(angle) * scl;

  translate(width / 2, height / 2);
  stroke(0, 0, 0, 100);
  noFill();
  strokeWeight(4 * scl);
  push();
  rotate(atan2(pos.x, pos.y));

  ellipse(0, 0, radius * 2, radius * 2);
  for (let a = -PI; a < PI - 0.01; a += TWO_PI / 6) {
    let dx = cos(a) * (radius - (4 * scl)),
      dy = sin(a) * (radius - (4 * scl));
    line(0, 0, dx, dy);
  }
  stroke(0);
  snake.show();
  strokeWeight(8 * scl);
  point(pos.x, pos.y);
  snake.follow(pos.x, pos.y);
  pos.add(vel);

  stroke(155, 185, 105);
  point(food.x, food.y);

  pop();
  fill(0);
  noStroke();
  textSize(15 * scl);
  let mytext = "360 SNAKE \n Created by Yoav Sarfaty \n Points: " + ((snakeLength * 10) - 100);
  textAlign(CENTER);
  text(mytext, 0, -radius / 2);
}

function restart() {
  snakeLength = 10;
  snake = new Segment(2 * scl, 0, 0);
  pos = createVector(0, 0);
  vel = createVector(0, 1);
  vel.mult(scl);
  angle = 0;
  for (let i = 1; i < 10; i++) {
    snake.addSegment(2 * scl);
  }
  createFood();
  restarttime = frameCount;
}

function createFood() {
  food = p5.Vector.random2D();
  food.mult(random(radius * 0.2, radius * 0.8));
  foodtime = frameCount;
}