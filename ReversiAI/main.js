const cols = 8;
const rows = 8;
const cellSize = 70;
const Think = 4;

let grid;
let turn;
let logp;
let AIcounterGlobal = 0;
let AIcounter = 0;
let AItime = 0;

function setup() {
  createCanvas(cellSize * cols, cellSize * rows);
  grid = new Array(cols).fill().map(() => new Array(rows).fill().map(() => 0));
  grid[floor(cols / 2) - 1][floor(rows / 2) - 1] = 1;
  grid[floor(cols / 2) - 1][floor(rows / 2)] = -1;
  grid[floor(cols / 2)][floor(rows / 2) - 1] = -1;
  grid[floor(cols / 2)][floor(rows / 2)] = 1;


  turn = "black";
  logp = createP();
  logp.position(20, 20);
  logp.size(300, windowHeight);
  updatelog();
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
  if (turn === "black") {
    let x = floor(mouseX / floor(width / cols));
    let y = floor(mouseY / floor(height / rows));
    if (!isturn(grid, x, y)) return;

    grid[x][y] = -1;
    turn = "white";
    // free the main thred!
    (async function () {
      flip(grid, x, y);
      updatelog();
      redraw();
      runAI();
    })();
  }
}

function isturn(g, x, y) {
  if (x < 0 || x > cols - 1 || y < 0 || y > rows - 1) return false;
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
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      let cx = x + i;
      let cy = y + j;
      while (!(cx < 0 || cx > cols - 1 || cy < 0 || cy > rows - 1) && g[x][y] === -g[cx][cy]) {
        cx += i;
        cy += j;
      }
      if (cx < 0 || cx > cols - 1 || cy < 0 || cy > rows - 1) continue;
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

function getscore(g) {
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  return g.map((x) => x.reduce(reducer)).reduce(reducer);
}

async function runAI() {
  let worker = new Worker('worker.js');

  AIcounter = 0;
  let t0 = performance.now();
  worker.postMessage({
    g: grid,
    i: Think,
  });
  worker.onmessage = (raw) => {
    move = raw.data;
    let t1 = performance.now();
    AItime = t1 - t0;
    AIcounter = move.count;

    AIcounterGlobal += AIcounter;
    if (move) {
      grid[move.x][move.y] = 1;
      flip(grid, move.x, move.y);
      turn = "black";
      updatelog();
    }
    redraw();
    worker.terminate();
  }
}

function getmove(g, i, other, bb) {
  AIcounter++;
  let best;

  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      if (isturn(g, x, y)) {
        let gridcopy = g.map(x => x.slice());
        gridcopy[x][y] = (!other) ? 1 : -1;
        flip(gridcopy, x, y);
        let score;
        if (i == 0) {
          score = getscore(gridcopy, x, y);
        } else {
          score = getmove(gridcopy, i - 1, !other, (best) ? best.score : undefined).score;
        }
        if (!best || (best.score < score && !other) || (best.score > score && other)) {
          best = {
            x: x,
            y: y,
            score: score
          }
        }
        //shortcut
        if (bb) {
          if (!other) {
            if (bb < score - 1) {
              return best;
            }
          } else {
            if (bb > score + 1) {
              return best;
            }
          }
        }
      }
    }
  }
  return best;
}

function updatelog() {
  logp.html(
    `It's ${turn}'s turn!<br>
    Score: ${getscore(grid)}<br>
    Total Moves Calculated: ${AIcounterGlobal}<br>
    Last Turn Calculated ${AIcounter} Moves in ${(AItime/1000).toFixed(3)} Seconds`
  );
}