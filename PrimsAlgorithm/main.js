let grid;
let cellSize = 20;
let cols, rows;
let current;
let walls;
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
  walls = [{
      x: 0,
      y: 0,
      w: 1
    },
    {
      x: 0,
      y: 0,
      w: 2
    }
  ];
}

function draw() {
  background(255);
  noStroke();
  fill(0, 127, 0);
  walls.forEach((t) => {
    rect(t.x * cellSize, t.y * cellSize, cellSize, cellSize);
  });
  if (current) {
    fill(0, 0, 127);
    rect(current.x * cellSize, current.y * cellSize, cellSize, cellSize);
  }
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
  for (let r = 0; r < roundsperframe && walls.length > 0; r++) {
    wall = walls.splice(round(random(walls.length)), 1)[0];
    if (wall) {
      current.x = wall.x;
      current.y = wall.y;
      if (wall.w == 0) {
        current.y--;
      } else if (wall.w == 1) {
        current.x++;
      } else if (wall.w == 2) {
        current.y++;
      } else if (wall.w == 3) {
        current.x--;
      }
      if (!grid[current.y][current.x][4]) {
        grid[current.y][current.x][4] = true;
        grid[wall.y][wall.x][wall.w] = false;
        grid[current.y][current.x][(wall.w + 2) % 4] = false;
        pushwalls(current.x, current.y);
      }
    }
  }
  if (walls.length == 0) {
    current = null;
  }
}

function pushwalls(x, y) {
  if (x > 0) {
    walls.push({
      x: x,
      y: y,
      w: 3
    });
  }
  if (y > 0) {
    walls.push({
      x: x,
      y: y,
      w: 0
    });
  }
  if (y < rows - 1) {
    walls.push({
      x: x,
      y: y,
      w: 2
    });
  }
  if (x < cols - 1) {
    walls.push({
      x: x,
      y: y,
      w: 1
    });
  }
}