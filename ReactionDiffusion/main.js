let oldg, newg;
let da = 1;
let db = .5;
let feed = .055;
let kill = .062;
let roundsperframe = 10;

function setup() {
  createCanvas(150, 150);
  pixelDensity(1);

  oldg = [];
  newg = [];
  for (let x = 0; x < width; x++) {
    oldg[x] = [];
    newg[x] = [];
    for (let y = 0; y < height; y++) {
      oldg[x][y] = {
        a: 1,
        b: 0
      };
      newg[x][y] = {
        a: 1,
        b: 0
      };
    }
  }
  document.getElementById("defaultCanvas0").style.width = "500px";
  document.getElementById("defaultCanvas0").style.height = "500px";
}

function draw() {
  loadPixels();
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      pixels[(x + y * width) * 4] = lerp(0, 255, oldg[x][y].a - oldg[x][y].b);
      pixels[(x + y * width) * 4 + 1] = lerp(130, 255, oldg[x][y].a - oldg[x][y].b);
      pixels[(x + y * width) * 4 + 2] = lerp(211, 148, oldg[x][y].a - oldg[x][y].b);
      pixels[(x + y * width) * 4 + 3] = 255;
      // set(x, y, c);
    }
  }
  updatePixels();

  for (let i = 0; i < roundsperframe; i++) {
    for (let x = 1; x < width - 1; x++) {
      for (let y = 1; y < height - 1; y++) {
        newg[x][y].a = oldg[x][y].a + (da * laplacianA(x, y) - oldg[x][y].a * oldg[x][y].b * oldg[x][y].b + feed * (1 - oldg[x][y].a));
        newg[x][y].b = oldg[x][y].b + (db * laplacianB(x, y) + oldg[x][y].a * oldg[x][y].b * oldg[x][y].b - (kill + feed) * (oldg[x][y].b));
      }
    }

    let c = oldg;
    oldg = newg;
    newg = c;
  }
}

function laplacianA(x, y) {
  let k = [
    [.05, .2, .05],
    [.2, -1, .2],
    [.05, .2, .05]
  ];
  let sum = 0;
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      sum += oldg[x + dx][y + dy].a * k[dx + 1][dy + 1];
    }
  }
  return sum;
}

function laplacianB(x, y) {
  let k = [
    [.05, .2, .05],
    [.2, -1, .2],
    [.05, .2, .05]
  ];
  let sum = 0;
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      sum += oldg[x + dx][y + dy].b * k[dx + 1][dy + 1];
    }
  }
  return sum;
}

function mouseClicked() {
  for (let x = 1; x < width - 1; x++) {
    for (let y = 1; y < height - 1; y++) {
      if (dist(mouseX, mouseY, x, y) < 10) {
        oldg[x][y].b = 1;
      }
    }
  }
}

function mouseDragged() {
  for (let x = 1; x < width - 1; x++) {
    for (let y = 1; y < height - 1; y++) {
      if (dist(mouseX, mouseY, x, y) < 1) {
        oldg[x][y].b = 1;
      }
    }
  }
}