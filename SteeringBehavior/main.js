class Character {
  constructor(x, y, maxV, maxF, r) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.maxV = maxV;
    this.maxF = maxF;
    this.radius = r;
  }

  update() {
    this.pos.add(this.vel);
  }

  show() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading() + HALF_PI);
    triangle(0, 0, -5, 20, 5, 20);
    pop();
  }

  seek(x, y, amnt) {
    let dv = p5.Vector.sub(createVector(x, y), this.pos).normalize().mult(this.maxV * amnt * ((dist(x, y, this.pos.x, this.pos.y) < this.radius) ? (dist(x, y, this.pos.x, this.pos.y) / this.radius) : 1));
    let steering = dv.sub(this.vel).limit(this.maxF);
    this.vel.add(steering);
    this.vel.limit(this.maxV);
  }
}

let c, cc;
let f;

function setup() {
  createCanvas(500, 500);
  c = new Character(width / 2, height / 2, 5, .5, 5);
  f = new Array(50).fill().map(() => createVector(random(width), random(height)));
}

function draw() {
  background(255);
  f.sort((f1, f2) => dist(f1.x, f1.y, c.pos.x, c.pos.y) - dist(f2.x, f2.y, c.pos.x, c.pos.y));
  if (f.length > 0) {
    c.seek(f[0].x, f[0].y, 1);
  }
  c.update();
  noStroke();
  fill(0);
  c.show();
  strokeWeight(5);
  stroke(0);
  f.forEach((ff) => {
    if (dist(ff.x, ff.y, c.pos.x, c.pos.y) < 5) {
      // ff.x = random(width);
      // ff.y = random(height);
      f.shift();
    } else {
      point(ff.x, ff.y);
    }
  });

  stroke(0, 255, 0);
  if (f.length > 0) point(f[0].x, f[0].y);
}