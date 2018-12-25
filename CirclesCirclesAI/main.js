const cellsize = 70;
//This is for multithreading, you can pass more functions inside an array so you don't need to copy paste code
const globalfunctions = [getSlice, getpoints, isturn, gameOver, getPoss, morepoints, getpointsmax];

let bscore = 0;
let pscore = 0;

let grid;
let markedlines;
let turn;
let logp;
let turnnum = 0;

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

async function mouseClicked() {
  let i = round(((mouseY - height / 2) + ((grid.length - 1) * cellsize / 2)) / cellsize);
  if (!grid[i]) return;
  let j = round(((mouseX - width / 2) + ((grid[i].length - 1) * cellsize / 2)) / cellsize);
  if (!isturn(grid, i, j)) return;
  if (turn === "blue") {
    grid[i][j] = 1;
    bscore += getpoints(grid, markedlines, i, j);
    turn = "purple";

    //make AI turn
    calculateAITurn()
      .then(move => {
        if (move) {
          grid[move.i][move.j] = 2;
          pscore += getpoints(grid, markedlines, move.i, move.j);
          turn = "blue";
        }
        logscore();
        redraw();
      });
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
  for (let i in g) {
    for (let j in g[i]) {
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

async function calculateAITurn() {
  //TODO better depth choosing, alpha-beta and multithreading!
  timeout = new Promise(resolve => setTimeout(resolve, 1000));
  turnnum++;
  let best = await multithread(getbestmove, globalfunctions)(grid, markedlines, true, bscore, pscore, (turnnum) / 13 * 7, true);
  await timeout;
  console.log(`Caulculated ${best[0]} moves!`);
  return best[1];
}

async function getPoss(g) {
  let poss = [];
  for (let i in g) {
    for (let j in g[i]) {
      if (isturn(g, i, j)) {
        poss.push({
          i: i,
          j: j
        });
      }
    }
  }
  return poss;
}

async function getbestmove(g, mark, t, originalbscore, originalpscore, depth, first) {
  let totalmovesthisturn = 0;
  //This is for multithreading, you can pass more functions inside an array so you don't need to copy paste code
  const globalfunctions = [getSlice, getpoints, isturn, gameOver, getPoss, morepoints, getpointsmax];

  let allps = [];
  poss = await getPoss(g);
  for (const move of poss) {
    totalmovesthisturn++;
    promise = (async function () {
      let bscore = originalbscore;
      let pscore = originalpscore;
      newg = JSON.parse(JSON.stringify(g));
      newmark = JSON.parse(JSON.stringify(mark));
      if (!t) {
        newg[move.i][move.j] = 1;
        bscore += getpoints(newg, newmark, move.i, move.j);
      } else {
        newg[move.i][move.j] = 2;
        pscore += getpoints(newg, newmark, move.i, move.j);
      }

      if (gameOver(newg)) {
        while (morepoints(newmark)) {
          if (t) {
            pscore += getpointsmax(newmark);
            t = !t;
          } else {
            bscore += getpointsmax(newmark);
            t = !t;
          }
        }
      } else if (depth > 0) {
        if (first) {
          next = await multithread(getbestmove, globalfunctions)(newg, newmark, !t, bscore, pscore, depth - 1);
        } else {
          next = await getbestmove(newg, newmark, !t, bscore, pscore, depth - 1);
        }
        totalmovesthisturn += next[0];
        next = next[1];
        if (t) {
          newg[next.i][next.j] = 1;
          bscore += getpoints(newg, newmark, next.i, next.j);
        } else {
          newg[next.i][next.j] = 2;
          pscore += getpoints(newg, newmark, next.i, next.j);
        }
      }
      return [bscore, pscore, move];
    })();
    allps.push(promise);
  }
  ress = await Promise.all(allps);
  let best = [];
  let bestscore = -1000;
  ress.forEach(res => {
    let bscore = res[0];
    let pscore = res[1];
    let move = res[2];
    // console.log(depth, move, bscore, pscore, t);
    if (t) {
      if (pscore - bscore > bestscore) {
        bestscore = pscore - bscore;
        best = [];
        best.push(move);
      } else if (pscore - bscore == bestscore) {
        best.push(move);
      }
    } else {
      if (bscore - pscore > bestscore) {
        bestscore = bscore - pscore;
        best = [];
        best.push(move);
      } else if (bscore - pscore == bestscore) {
        best.push(move);
      }
    }
  });
  best = best[Math.floor(Math.random() * best.length)];
  return [totalmovesthisturn, best];
}