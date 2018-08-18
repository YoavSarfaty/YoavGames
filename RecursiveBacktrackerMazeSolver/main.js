let grid;
let cellSize = 20;
let cols, rows;
let path;
let roundsperframe = 1;
let finished;

function setup() {
  rows = floor(windowHeight / cellSize);
  cols = floor(windowWidth / cellSize);
  createCanvas(cols * cellSize, rows * cellSize);
  grid = null;
}

function draw() {
  background(255);

  if (newGrid) {
    grid = newGrid;
    grid = grid.map((y) => y.map((x) => x.splice(0, 4)));
    rows = grid.length;
    cols = grid[0].length;
    cellSize = floor(height / rows);
    newGrid = null;
    finished = false;
    path = [{
      x: 0,
      y: 0
    }];
  }

  if (grid) {
    background(255);
    stroke(0);
    strokeWeight(2);
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
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

    beginShape();
    noFill();
    stroke(255, 0, 0);
    strokeWeight(5);
    for (p of path) vertex(((p.x + .5) * cellSize), ((p.y + .5) * cellSize))
    endShape();

    for (let r = 0; r < roundsperframe && !finished; r++) {
      let current = {
        x: path[path.length - 1].x,
        y: path[path.length - 1].y
      }
      grid[current.y][current.x][4] = true;
      let n = getNeighbour(current.y, current.x);
      // console.log(n);
      if (n) {
        path.push(n);
        if (n.x == cols - 1 && n.y == rows - 1) {
          finished = true;
        }
      } else {
        path.pop();
      }
      // console.log(getNeighbour(current.x, current.y));
    }
  } else {
    fill(0);
    strokeWeight(1);
    stroke(0);
    textSize(20);
    text("<--- click \"load maze\"!", 100, 115);
  }
}

function getNeighbour(y, x) {
  neighbours = [];
  // console.log(y, x);
  if (x > 0 && !grid[y][x - 1][4] && !grid[y][x][3]) {
    neighbours.push({
      x: x - 1,
      y: y
    });
  }
  if (y > 0 && !grid[y - 1][x][4] && !grid[y][x][0]) {
    neighbours.push({
      x: x,
      y: y - 1
    });
  }
  if (x < cols - 1 && !grid[y][x + 1][4] && !grid[y][x][1]) {
    neighbours.push({
      x: x + 1,
      y: y
    });
  }
  if (y < rows - 1 && !grid[y + 1][x][4] && !grid[y][x][2]) {
    neighbours.push({
      x: x,
      y: y + 1
    });
  }
  // console.log(neighbours);
  return neighbours[0];
}