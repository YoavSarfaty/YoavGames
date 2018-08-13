let grid;
let cellSize = 20;
let cols, rows;
let walls;
let roundsperframe = 10;
let map;
let current;

function setup() {
  current = {};
  map = [];
  walls = [];
  rows = floor(windowHeight / cellSize);
  cols = floor(windowWidth / cellSize);
  createCanvas(cols * cellSize, rows * cellSize);
  grid = new Array(rows).fill().map(() => new Array(cols).fill().map(() => [true, true, true, true, false]));
  let i = 0;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      grid[y][x][5] = i;
      map[i] = i;
      i++;
    }
  }

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (x < cols - 1) {
        walls.push({
          x: x,
          y: y,
          w: 1
        });
      }
      if (y < rows - 1) {
        walls.push({
          x: x,
          y: y,
          w: 2
        });
      }
    }
  }
}

function draw() {

  if (newGrid) {
    grid = newGrid;
    newGrid = null;
    current = null;
    map = [];
    walls = [];
  }

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
      if (wall.w == 1) {
        current.x++;
      } else if (wall.w == 2) {
        current.y++;
      }
      if (findg(grid[current.y][current.x][5]) != findg(grid[wall.y][wall.x][5])) {
        grid[current.y][current.x][4] = true;
        grid[wall.y][wall.x][4] = true;
        grid[wall.y][wall.x][wall.w] = false;
        grid[current.y][current.x][(wall.w + 2) % 4] = false;
        let newg = min(findg(grid[current.y][current.x][5]), findg(grid[wall.y][wall.x][5]));
        map[grid[wall.y][wall.x][5]] = newg;
        grid[wall.y][wall.x][5] = newg;
        map[grid[current.y][current.x][5]] = newg;
        grid[current.y][current.x][5] = newg;
      }
      // console.log("----------------");
      // console.log(wall.x, wall.y);
      // console.log(grid[wall.y][wall.x][5]);
      // console.log(map[grid[wall.y][wall.x][5]]);
    }
  }
  if (walls.length == 0) {
    current = null;
  }
}

function findg(index) {
  // console.log(index);
  if (map[index] == index) return index;
  return findg(map[index]);
}