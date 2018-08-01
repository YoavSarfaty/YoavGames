let grid;
let cellSize = 20;
let cols, rows;
let divisions;
let roundperframe = 1;

function setup() {
  rows = floor(windowHeight / cellSize);
  cols = floor(windowWidth / cellSize);
  createCanvas(cols * cellSize, rows * cellSize);
  // frameRate(1);

  divisions = [{
    startx: 0,
    starty: 0,
    endx: cols,
    endy: rows
  }];
  grid = new Array(rows).fill().map(() => new Array(cols).fill().map(() => [false, false, false, false]));
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (y == 0) grid[y][x][0] = true;
      if (x == 0) grid[y][x][3] = true;
      if (y == rows - 1) grid[y][x][2] = true;
      if (x == cols - 1) grid[y][x][1] = true;
    }
  }
}

function draw() {
  background(255);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      stroke(0);
      strokeWeight(2);
      if (grid[y][x][0]) {
        line(x * cellSize, y * cellSize, (x + 1) * cellSize, y * cellSize);
      }
      if (grid[y][x][1]) {
        line((x + 1) * cellSize, y * cellSize, (x + 1) * cellSize, (y + 1) * cellSize);
      }
      if (grid[y][x][2]) {
        line((x + 1) * cellSize, (y + 1) * cellSize, x * cellSize, (y + 1) * cellSize);
      }
      if (grid[y][x][3]) {
        line(x * cellSize, (y + 1) * cellSize, x * cellSize, y * cellSize);
      }
    }
  }

  //algo
  if (divisions.length < 1) return;
  for (let i = 0; i < roundperframe; i++) {
    run();
  }
}

function run() {
  let original = divisions.pop();
  if (original) {
    let xcut, ycut;
    let xopen = [];
    let yopen = [];
    if (original.endx - original.startx > 1) {
      xcut = floor(random(original.startx, original.endx));
      xopen[0] = floor(random(original.startx, xcut));
      xopen[1] = floor(random(xcut, original.endx));
    } else {
      xopen[0] = floor(random(original.startx, original.endx));
    }
    if (original.endy - original.starty > 1) {
      ycut = floor(random(original.starty, original.endy));
      yopen[0] = floor(random(original.starty, ycut));
      yopen[1] = floor(random(ycut, original.endy));
    } else {
      yopen[0] = floor(random(original.starty, original.endy));
    }
    if (xcut) {
      for (let y = original.starty; y < original.endy; y++) {
        if (!yopen.includes(y)) {
          grid[y][xcut - 1][1] = true;
          grid[y][xcut][3] = true;
        }
      }
    }
    if (ycut) {
      for (let x = original.startx; x < original.endx; x++) {
        if (!xopen.includes(x)) {
          grid[ycut - 1][x][2] = true;
          grid[ycut][x][0] = true;
        }
      }
    }
    if (xcut && !ycut) {
      divisions.push({
        startx: original.startx,
        starty: original.starty,
        endx: xcut,
        endy: original.endy
      });
      divisions.push({
        startx: xcut + 1,
        starty: original.starty,
        endx: original.endx,
        endy: original.endy
      });
    } else if (ycut && !xcut) {
      divisions.push({
        startx: original.startx,
        starty: original.starty,
        endx: original.endx,
        endy: ycut
      });
      divisions.push({
        startx: original.startx,
        starty: ycut + 1,
        endx: original.endx,
        endy: original.endy
      });
    } else if (xcut && ycut) {
      divisions.push({
        startx: original.startx,
        starty: original.starty,
        endx: xcut,
        endy: ycut
      });
      divisions.push({
        startx: original.startx,
        starty: ycut + 1,
        endx: xcut,
        endy: original.endy
      });
      divisions.push({
        startx: xcut + 1,
        starty: original.starty,
        endx: original.endx,
        endy: ycut
      });
      divisions.push({
        startx: xcut + 1,
        starty: ycut + 1,
        endx: original.endx,
        endy: original.endy
      });
    } else {
      run();
    }
  }
}