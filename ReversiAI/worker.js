// sadly chrome doesn't support nested web workers or this thing would really fly!

const cols = 8;
const rows = 8;
let AIcounter = 0;

onmessage = (raw) => {
  let e = raw.data;
  getmove(e.g, e.i, e.other, e.bb).then((move) => {
    move.count = AIcounter;
    postMessage(move);
    close();
  });
}

async function getmove(g, i, other, bb) {
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
          move = await getmove(gridcopy, i - 1, !other, (best) ? best.score : undefined);
          score = (move) ? move.score : undefined;
        }
        if (!best || (best.score < score && !other) || (best.score > score && other)) {
          best = {
            x: x,
            y: y,
            score: score
          }
        }
        // shortcut
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