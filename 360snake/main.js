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
let record = 0;
let camAngle;


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
      // add to end of snake
      let old = snake;
      snake = new Segment(2 * scl, old.posI(0).x, old.posI(0).y);
      snake.child = old;
    }
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
  stroke(155);
  strokeCap(PROJECT);
  noFill();
  strokeWeight(4 * scl);
  push();
  let target = atan2(pos.x, pos.y);
  let delta = target - camAngle;
  if (delta > PI) camAngle += TWO_PI;
  else if (delta < -PI) camAngle -= TWO_PI;
  delta = lerp(camAngle, target, .03) - camAngle;
  delta = constrain(delta, -.1, .1);
  camAngle += delta;
  rotate(camAngle);

  ellipse(0, 0, radius * 2, radius * 2);
  for (let a = -PI; a < PI - 0.01; a += TWO_PI / 6) {
    let dx = cos(a) * (radius),
      dy = sin(a) * (radius);
    line(0, 0, dx, dy);
  }
  stroke(0);
  strokeCap(ROUND);
  snake.show();
  strokeWeight(8 * scl);
  point(pos.x, pos.y);
  snake.follow(pos.x, pos.y);
  pos.add(vel);

  stroke(155, 185, 105);
  point(food.x, food.y);

  pop();
  noFill();
  strokeWeight(5);
  for (let i = -radius * 1.1; i <= 0; i++) {
    let inter = map(i, -radius, 0, 0, 1);
    let c = lerpColor(color(255, 100), color(255, 0), inter);
    stroke(c);
    line(-radius, i, radius, i);
  }
  fill(0);
  noStroke();
  textSize(12 * scl);
  let score = (snakeLength * 10) - 100;
  record = max(score, record);
  let mytext = "360 SNAKE\nCreated by Yoav Sarfaty\nPoints: " + score + "\nRecord: " + record;
  textAlign(CENTER);
  text(mytext, 0, -2 * radius / 3);
}

function restart() {
  camAngle = HALF_PI;
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