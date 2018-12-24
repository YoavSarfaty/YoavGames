const cellsize = 70;

let bscore = 0;
let pscore = 0;

let grid;
let markedlines;
let turn;
let logp;

function setup() {
  createCanvas(500, 500);

  grid = new Array(7).fill().map((v, i) => new Array(i + 1).fill(0));
  grid[0][0] = -1;
  grid[6][0] = -1;
  grid[6][6] = -1;

  markedlines = new Array(3).fill().map(() => new Array(6).fill(false));

  turn = "blue";
  logp = createP();

  logscore();
}

function draw() {
  background(255);
  stroke(0);
  strokeWeight(2);
  translate(width / 2, height / 2);
  for (let i in grid) {
    for (let j in grid[i]) {
      let xoff = -(grid[i].length - 1) * cellsize / 2;
      let yoff = -(grid.length - 1) * cellsize / 2;
      if (grid[i][j] == 0) {
        noFill();
      } else if (grid[i][j] == 1) {
        fill(0, 0, 255);
      } else if (grid[i][j] == 2) {
        fill(255, 0, 255);
      } else if (grid[i][j] == -1) {
        fill(0);
      }
      ellipse(j * cellsize + xoff, i * cellsize + yoff, cellsize);
    }
  }
  for (let i in markedlines) {
    for (let j in markedlines[i]) {
      i = Number(i);
      j = Number(j);
      if (markedlines[i][j]) {
        push();
        if (i == 0) {
          let xoff = -(grid[0].length - 1) * cellsize / 2;
          let yoff = -(grid.length - 1) * cellsize / 2;
          translate(0 * cellsize + xoff, 0 * cellsize + yoff);
        } else if (i == 1) {
          let xoff = -(grid[6].length - 1) * cellsize / 2;
          let yoff = -(grid.length - 1) * cellsize / 2;
          translate(0 * cellsize + xoff, 6 * cellsize + yoff);
        } else if (i == 2) {
          let xoff = -(grid[6].length - 1) * cellsize / 2;
          let yoff = -(grid.length - 1) * cellsize / 2;
          translate(6 * cellsize + xoff, 6 * cellsize + yoff);
        }
        rotate(i * TWO_PI * 2 / 3);
        fill(255);
        let h = cellsize * (j + 1);
        let l = (j + 3) * cellsize;
        if (i > 0) h *= .9;
        line(-l / 2, h, l / 2, h);
        pop();
      }
    }
  }
  noLoop();
}

function mouseClicked() {
  let i = round(((mouseY - height / 2) + ((grid.length - 1) * cellsize / 2)) / cellsize);
  if (!grid[i]) return;
  let j = round(((mouseX - width / 2) + ((grid[i].length - 1) * cellsize / 2)) / cellsize);
  if (!isturn(grid, i, j)) return;
  if (turn === "blue") {
    grid[i][j] = 1;
    bscore += getpoints(grid, markedlines, i, j);
    turn = "purple";
  } else {
    grid[i][j] = 2;
    pscore += getpoints(grid, markedlines, i, j);
    turn = "blue";
  }

  if (gameOver(grid)) {
    console.log("Game Over!")
    while (morepoints(markedlines)) {
      if (turn === "blue") {
        bscore += getpointsmax(markedlines);
        turn = "purple";
      } else {
        pscore += getpointsmax(markedlines);
        turn = "blue";
      }
    }
  }

  logscore();
  redraw();
}

function morepoints(marks) {
  for (let i in marks) {
    for (let j in marks[i]) {
      if (!marks[i][j]) return true;
    }
  }
  return false;
}

function getpointsmax(marks) {
  let topscore = 0;
  let topdir = undefined;
  let topindex = undefined;
  for (let j = 0; j < marks[0].length; j++) {
    for (let i = 0; i < 3; i++) {
      if (marks[i][j]) continue;
      if (j + 2 > topscore) {
        topscore = j + 2;
        topdir = i;
        topindex = j;
      }
    }
  }
  marks[topdir][topindex] = true;
  return topscore;
}

function isturn(g, i, j) {
  if (g[i] == undefined) return false;
  if (g[i][j] == undefined) return false;
  if (g[i][j] != 0) return false;
  return true;
}

function gameOver(g) {
  for (let i in grid) {
    for (let j in grid[i]) {
      if (isturn(g, i, j)) return false;
    }
  }
  return true;
}

function getSlice(g, dir, index, y, xx) {
  if (dir < 0 || dir > 2) return null;
  if (index < 1 || index > 6) return null;
  let f = false;
  if (dir == 0) {
    if (y == index) return g[index];
  }
  if (dir == 1) {
    let s = [];
    for (let x = 0; x <= index; x++) {
      let i = x + 6 - index;
      let j = x;
      s.push(g[i][j]);
      if (y == i && xx == j) f = true;
    }
    if (f) return s;
  }
  if (dir == 2) {
    let s = [];
    for (let x = 0; x <= index; x++) {
      let i = x + 6 - index;
      let j = g[i].length - x - 1;
      s.push(g[i][j]);
      if (y == i && xx == j) f = true;
    }
    if (f) return s;
  }
}

function getpoints(g, marks, y, x) {
  let topscore = 0;
  let topdir = undefined;
  let topindex = undefined;
  for (let i in marks) {
    for (let j in marks[i]) {
      if (marks[i][j]) continue;
      i = Number(i);
      j = Number(j);
      let s = getSlice(g, i, j + 1, y, x);
      if (!s) continue;
      if ((!s.includes(0)) && s.length > topscore) {
        topscore = s.length;
        topdir = i;
        topindex = j;
      }
    }
  }
  if (topdir != undefined && topscore != undefined) {
    marks[topdir][topindex] = true;
  }
  return topscore;
}

function logscore() {
  logp.html(`It's ${turn}'s turn!\nblue's score = ${bscore}, purple's score = ${pscore}`);
}