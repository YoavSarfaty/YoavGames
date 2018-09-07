const cols = 8;
const rows = 8;
const cellSize = 70;

let grid;
let turn;
let logp;

function setup() {
  createCanvas(cellSize * cols, cellSize * rows);
  grid = new Array(cols).fill().map(() => new Array(rows).fill().map(() => 0));
  grid[floor(cols / 2) - 1][floor(rows / 2) - 1] = 1;
  grid[floor(cols / 2) - 1][floor(rows / 2)] = -1;
  grid[floor(cols / 2)][floor(rows / 2) - 1] = -1;
  grid[floor(cols / 2)][floor(rows / 2)] = 1;


  turn = "black";
  logp = createP();
  logp.html(`It's ${turn}'s turn!\nscore = ${getscore(grid)}`);
}

function draw() {
  background(255);
  stroke(0);
  strokeWeight(2);
  for (let i = 1; i < max(cols, rows); i++) {
    line(i * (width / cols), 0, i * (width / cols), height);
    line(0, i * (height / rows), width, i * (height / rows));
  }
  strokeWeight(5);
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      if (grid[x][y] == 1) {
        fill(255);
        ellipse((x + .5) * (width / cols), (y + .5) * (height / rows), (width / (cols * 1.5)));
      }
      if (grid[x][y] == -1) {
        fill(0);
        ellipse((x + .5) * (width / cols), (y + .5) * (height / rows), (width / (cols * 1.5)));
      }
      if (isturn(grid, x, y)) {
        noStroke();
        fill(255, 0, 0, 50);
        rect(x * (width / cols), y * (height / rows), (width / cols), (height / rows));
        stroke(0);
      }
    }
  }
  noLoop();
}

function mouseClicked() {
  let x = floor(mouseX / floor(width / cols));
  let y = floor(mouseY / floor(height / rows));
  if (!isturn(grid, x, y)) return;
  if (turn === "black") {
    grid[x][y] = -1;
    turn = "white";
  } else {
    grid[x][y] = 1;
    turn = "black";
  }

  flip(grid, x, y);
  logp.html(`It's ${turn}'s turn!\nscore = ${getscore(grid)}`);
  redraw();
}

function isturn(g, x, y) {
  if (g[x][y] != 0) return false;
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      if ((x + i) >= 0 && (x + i) < cols && (y + j) >= 0 && (y + j) < rows) {
        if (g[x + i][y + j]) return true;
      }
    }
  }
  return false;
}

function flip(g, x, y) {
  let cx = x,
    cy = y;
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      cx = x + i;
      cy = y + j;
      if (!(cx < 0 || cx > cols - 1 || cy < 0 || cy > rows - 1)) {
        while (g[x][y] === -g[cx][cy]) {
          cx += i;
          cy += j;
          if (cx < 0 || cx > cols - 1 || cy < 0 || cy > rows - 1) break;
        }
        if (cx < 0 || cx > cols - 1 || cy < 0 || cy > rows - 1) break;
        if (g[x][y] === g[cx][cy]) {
          while (cx != x || cy != y) {
            cx -= i;
            cy -= j;
            g[cx][cy] = g[x][y];
          }
        }
      }
    }
  }
}

function getscore(g) {
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  return g.map((x) => x.reduce(reducer)).reduce(reducer);
}