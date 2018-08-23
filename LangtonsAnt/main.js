let ax, ay, dir;
let c = true;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  background(255);
  ax = width / 2;
  ay = height / 2;
  dir = 0;
}

function draw() {
  loadPixels();
  for (let i = 0; i < 1000; i++) {
    let current = pixels[(ax + ay * width) * 4];
    pixels[(ax + ay * width) * 4] = 255 - current;
    pixels[(ax + ay * width) * 4 + 1] = 250 - current;
    pixels[(ax + ay * width) * 4 + 2] = 250 - current;
    if (current === 0) {
      dir++;
    } else {
      dir--;
    }
    dir += 4;
    dir %= 4;

    if (dir === 0) {
      ax++;
    }
    if (dir === 1) {
      ay++;
    }
    if (dir === 2) {
      ax--;
    }
    if (dir === 3) {
      ay--;
    }
    ax += width;
    ax %= width;
    ay += height;
    ay %= height;
  }
  updatePixels();
  if (mouseIsPressed) {
    loadPixels();
    xoff = pmouseX - mouseX;
    yoff = pmouseY - mouseY;
    let pcopy = pixels.slice();
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        let ox = ((x + xoff) + width) % width;
        let oy = ((y + yoff) + height) % height;
        pixels[(x + y * width) * 4] = pcopy[(ox + oy * width) * 4];
        pixels[(x + y * width) * 4 + 1] = pcopy[(ox + oy * width) * 4 + 1];
        pixels[(x + y * width) * 4 + 2] = pcopy[(ox + oy * width) * 4 + 2];
      }
    }
    ax -= xoff;
    ay -= yoff;
    updatePixels();
  }
}

function keyPressed() {
  if (key == 'R') {
    resizeCanvas(windowWidth, windowHeight);
    c = !c;
    background(c ? 255 : 0);
  }
}