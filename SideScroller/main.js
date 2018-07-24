// Made by Yoav Sarfaty

let player = {
  x: 0,
  y: -1000,
  xvel: 0,
  yvel: 0,
  up: true,
  down: false
};

let camera = {
  x: 0,
  y: 0,
  scl: 0.1
};

let keyboard = {
  w: false,
  a: false,
  s: false,
  d: false
};

let targetscale = 1;

function setup() {
  createCanvas(500, 500);
}

function draw() {
  background(0, 127, 200);
  player.move(calculateFloor(player.x));
  camera.move();
  push();
  translate(width / 2, height - 100);
  scale(camera.scl);
  translate(-camera.x, -camera.y);
  drawLevel(camera.x);
  player.draw();
  pop();
  textSize(20);
  text(round(frameRate()), 10, 30);
}

function drawLevel(x) {
  //level is 4000x1000px
  noStroke();
  for (let i = x - 2000; i < x + 2000; i += 5) {
    if (floor(i / 100) % 2 == 0) {
      fill(120, 50, 0);
    } else {
      fill(60, 25, 0);
    }
    let f = calculateFloor(i);
    rect(i, f[0], 6, 500);
    for (let j = 1; j < f.length; j++) {
      rect(i, f[j], 6, 10);
    }
  }
}

function calculateFloor(x) {
  let h = noise(x / 1000, 0);
  if (h < .5) {
    return [0];
  } else if (h < .8) {
    return [0, -noise(x / 1000, 1000) * 80];
  } else {
    return [0, -noise(x / 1000, 1000) * 80, -noise(x / 1000, 1000) * 160];
  }
}

player.draw = function () {
  // player is 50x100px
  fill(255);
  noStroke();
  if (!this.down) {
    rect(this.x - 25, this.y - 100, 50, 100);
  } else {
    rect(this.x - 25, this.y - 50, 50, 50);
  }
}

player.move = function (f) {
  let floor = 0;
  for (let i = 0; i < f.length; i++) {
    if (player.y - 10 <= f[i]) {
      floor = f[i];
    }
  }
  if (this.down) floor = f[0];

  // console.log(f, player.y, floor);

  if (keyIsDown(UP_ARROW) || keyboard["w"] && keyIsPressed) {
    // console.log("up!");
    if (this.y > -50 + floor && this.up && !this.down) {
      this.yvel -= 2;
    } else {
      this.up = this.y >= floor;
      this.yvel++;
    }
  }

  this.down = ((keyIsDown(DOWN_ARROW) || keyboard["s"]) && keyIsPressed);

  if (keyIsDown(LEFT_ARROW) || keyboard["a"] && keyIsPressed) {
    this.xvel--;
  } else if (keyIsDown(RIGHT_ARROW) || keyboard["d"] && keyIsPressed) {
    this.xvel++;
  } else {
    if (this.xvel > 0) {
      this.xvel--;
    } else if (this.xvel < 0) {
      this.xvel++;
    }
  }

  if (!(keyIsDown(UP_ARROW) || keyboard["w"]) || !keyIsPressed) {
    if (this.y < floor) {
      this.yvel++;
    } else {
      this.yvel = 0;
      this.y = floor;
      this.up = true;
    }
  }
  if (this.down) {
    this.xvel = max(min(this.xvel, 5), -5);
  }
  this.xvel = max(min(this.xvel, 10), -10);
  this.yvel = max(this.yvel, -10);
  this.x += this.xvel;
  this.y += this.yvel;
  this.y = min(this.y, floor);
}

camera.move = function () {
  this.x = lerp(this.x, player.x, 0.3);
  this.y = min(lerp(this.y, player.y, 0.3), 400);
  this.scl = max(min(lerp(this.scl, targetscale, 0.1), 1), 0.2);
}

function keyPressed(x) {
  keyboard[x.key.toLowerCase()] = true;
}

function keyReleased(x) {
  keyboard[x.key.toLowerCase()] = false;
}