let grid;
let cellSize = 20;
let cols, rows;
let current;
let stack;
let roundsperframe = 10;

function setup() {
  rows = floor(windowHeight / cellSize);
  cols = floor(windowWidth / cellSize);
  createCanvas(cols * cellSize, rows * cellSize);
  grid = new Array(rows).fill().map(() => new Array(cols).fill().map(() => [true, true, true, true, false]));
  current = {
    x: 0,
    y: 0
  };
  grid[0][0][4] = true;
  stack = [];
}

function draw() {
  background(255);
  noStroke();
  fill(0, 127, 0);
  stack.forEach((t) => {
    rect(t.x * cellSize, t.y * cellSize, cellSize, cellSize);
  });
  fill(0, 0, 127);
  rect(current.x * cellSize, current.y * cellSize, cellSize, cellSize);
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
      if (!grid[y][x][4]) {
        noStroke();
        fill(127);
        rect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }
  for (let r = 0; r < roundsperframe; r++) {
    let neighbour = getNeighbour(current.y, current.x)
    if (neighbour != undefined) {
      stack.push(current);
      if (neighbour.x > current.x) {
        grid[current.y][current.x][1] = false;
        grid[neighbour.y][neighbour.x][3] = false;
      } else if (neighbour.x < current.x) {
        grid[current.y][current.x][3] = false;
        grid[neighbour.y][neighbour.x][1] = false;
      } else if (neighbour.y > current.y) {
        grid[current.y][current.x][2] = false;
        grid[neighbour.y][neighbour.x][0] = false;
      } else if (neighbour.y < current.y) {
        grid[current.y][current.x][0] = false;
        grid[neighbour.y][neighbour.x][2] = false;
      }
      current = neighbour;
      grid[current.y][current.x][4] = true;
    } else if (stack.length > 0) {
      current = stack.pop();
    }
  }
}

function getNeighbour(y, x) {
  console.log(x, y);
  neighbours = [];
  if (x > 0 && !grid[y][x - 1][4]) {
    neighbours.push({
      x: x - 1,
      y: y
    });
  }
  if (y > 0 && !grid[y - 1][x][4]) {
    neighbours.push({
      x: x,
      y: y - 1
    });
  }
  if (x < cols - 1 && !grid[y][x + 1][4]) {
    neighbours.push({
      x: x + 1,
      y: y
    });
  }
  if (y < rows - 1 && !grid[y + 1][x][4]) {
    neighbours.push({
      x: x,
      y: y + 1
    });
  }
  let i = floor(random(neighbours.length));
  return neighbours[i];
}