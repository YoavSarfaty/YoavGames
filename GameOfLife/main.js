let grid;
let gridWidth, gridHeight;
let ratio;

function setup() {
  noStroke();
  noSmooth();
  ratio = round(min(windowWidth, windowHeight) / 150);
  gridWidth = round(windowWidth / ratio);
  gridHeight = round(windowHeight / ratio);
  createCanvas(gridWidth * ratio, gridHeight * ratio);
  pixelDensity(1);
  background(255);
  grid = new Array(gridHeight).fill(0).map(() => new Array(gridWidth).fill(0).map(() => {
    return {
      state: random() < .06,
      last: Infinity,
    }
  }));
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      let current = grid[y][x];
      if (current.state) {
        current.last = 0;
      }
    }
  }
}

function draw() {

  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      let current = grid[y][x];
      let neighbors = getNeighbors(x, y);
      if (current.state) {
        if (neighbors < 2 || neighbors > 3) {
          current.state = false;
        }
      } else {
        if (neighbors == 3) {
          current.state = true;
        }
      }
    }
  }

  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      let current = grid[y][x];
      if (current.state) {
        current.last = 0;
      } else {
        current.last++;
      }
    }
  }

  loadPixels();
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      let value = max(min(map(grid[y][x].last, 0, 100, 1, 0), 1), 0);
      if (value < 1 && frameCount < 10) {
        grid[y][x].last = Infinity;
        value = 0;
      }
      let r = 0;
      let g = 0;
      let b = 0;
      if (value == 1) {
        r = 255;
        g = 255;
        b = 255;
      } else if (value > .5) {
        r = map(value, .5, 1, 255, 0) * value;
        g = 0;
        b = 255 * value;
      } else {
        r = map(value, 0, .5, 0, 255) * value;
        g = 0;
        b = 0;
      }
      // fill(r, g, b)
      // rect(x * ratio, y * ratio, ratio, ratio);
      for (ry = y * ratio; ry < (y + 1) * ratio; ry++) {
        for (rx = x * ratio; rx < (x + 1) * ratio; rx++) {
          let index = (rx + ry * gridWidth * ratio) * 4;
          pixels[index + 0] = r;
          pixels[index + 1] = g;
          pixels[index + 2] = b;
          pixels[index + 3] = 255;
        }
      }
    }
  }
  updatePixels();
}

function getNeighbors(x, y) {
  sum = 0;
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx == 0 && dy == 0) continue;
      if (y + dy < 0 || y + dy >= gridHeight) continue;
      if (x + dx < 0 || x + dx >= gridWidth) continue;
      // console.log(grid[y + dy][x + dx], x + dx, y + dy)
      if (grid[y + dy][x + dx].last == 0) {
        sum++;
      }
    }
  }
  return sum;
}