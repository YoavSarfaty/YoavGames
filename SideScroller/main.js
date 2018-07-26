// Made by Yoav Sarfaty

let player;

let camera;

let keyboard = {};

let targetscale;
let floors;

function setup() {
  createCanvas(windowWidth, windowHeight);
  restartgame();
}

function restartgame() {
  player = {
    x: 0,
    y: -1000,
    xvel: 0,
    yvel: 0,
    up: true,
    down: false
  };

  camera = {
    x: 0,
    y: 0,
    scl: 0.2
  };
  floors = {};
  targetscale = 1;
  for (let x = -30; x < 30; x++) {
    floors[x] = [0];
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
    let fall = false;
    if (f.length > 0) {
      for (let i = 0; i < f.length; i++) {
        if (player.y - 10 <= f[i]) {
          floor = f[i];
        }
      }
      if (this.down) floor = f[0];
    } else {
      floor = 5000;
      fall = player.y >= 0;
    }

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

    if (!fall) {
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
    } else {
      this.xvel = 0;
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
    // console.log(this.x);
  }

  camera.move = function () {
    this.x = lerp(this.x, player.x, 0.3);
    this.y = lerp(this.y, player.y, 0.3);
    this.scl = max(min(lerp(this.scl, targetscale, 0.1), 1), 0.2);
  }

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
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
  if (player.y > 4000) restartgame();
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
  x = floor(x / 100);
  // console.log(x);
  if (floors[x] != undefined) return floors[x];
  if (x < 0) return [];
  if (floors[x - 1].length == 0) {
    if (random(1) < .5) {
      floors[x] = [0];
    } else if (floors[x - 2].length == 0) {
      floors[x] = [0]
    } else {
      floors[x] = [];
    }
  } else {
    if (random(1) < .7) {
      floors[x] = floors[x - 1];
    } else {
      if (random(1) < .4) {
        floors[x] = [0];
      } else if (random(1) < .5) {
        floors[x] = [];
      } else {
        floors[x] = [0, -100];
      }
    }
  }
  return floors[x];
}

function keyPressed(x) {
  keyboard[x.key.toLowerCase()] = true;
}

function keyReleased(x) {
  keyboard[x.key.toLowerCase()] = false;
}