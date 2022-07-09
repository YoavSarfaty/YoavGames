let grid;
let gridWidth, gridHeight;
let blockSize = 20;
let allOptions = [];

const UP = 0;
const RIGHT = 1;
const DOWN = 2;
const LEFT = 3;

let emptyWeight;
let lineWeight;
let halfPlusWeight;
let plusWeight;
let cornerWeight;

function rotateOption(option)
{
  sides = option.sides.slice();
  sides.unshift(sides.pop());
  return {
    image: option.image,
    rotation: option.rotation + 90,
    sides: sides,
    weight: option.weight,
  };
}

function createOption(imagePath, sides, weight)
{
  if (sides.length != 4) throw "must have 4 sides";
  return {
    image: loadImage(imagePath),
    rotation: 0,
    sides: sides.slice(),
    weight: weight,
  };
}

function loadOptions()
{
  allOptions = [];
  allOptions.push(createOption("img/empty.png", [0, 0, 0, 0], emptyWeight.value()));

  let line = createOption("img/line.png", [0, 1, 0, 1], lineWeight.value());
  allOptions.push(line);
  allOptions.push(rotateOption(line));

  let halfPlus = createOption("img/half-plus.png", [1, 1, 0, 1], halfPlusWeight.value());
  for (let i = 0; i < 4; i++)
  {
    allOptions.push(halfPlus);
    halfPlus = rotateOption(halfPlus);
  }

  allOptions.push(createOption("img/plus.png", [1, 1, 1, 1], plusWeight.value()));

  let corner = createOption("img/corner.png", [1, 1, 0, 0], cornerWeight.value());
  for (let i = 0; i < 4; i++)
  {
    allOptions.push(corner);
    corner = rotateOption(corner);
  }
}

function buildGrid()
{
  grid = new Array(gridHeight).fill(0).map(() => new Array(gridWidth).fill(0).map(() =>
  {
    return {
      collapsed: false,
      options: allOptions.slice(),
    }
  }));
}

function setup()
{
  angleMode(DEGREES);
  noStroke();
  noSmooth();

  emptyWeight = createSlider(0, 10, 5, 1);
  emptyWeight.parent(document.getElementById('slidersdiv'));
  createP("Empty block weight").parent(document.getElementById('slidersdiv'));

  lineWeight = createSlider(0, 10, 5, 1);
  lineWeight.parent(document.getElementById('slidersdiv'));
  createP("Line block weight").parent(document.getElementById('slidersdiv'));

  halfPlusWeight = createSlider(0, 10, 5, 1);
  halfPlusWeight.parent(document.getElementById('slidersdiv'));
  createP("Half Plus block weight").parent(document.getElementById('slidersdiv'));

  plusWeight = createSlider(0, 10, 5, 1);
  plusWeight.parent(document.getElementById('slidersdiv'));
  createP("Plus block weight").parent(document.getElementById('slidersdiv'));

  cornerWeight = createSlider(0, 10, 5, 1);
  cornerWeight.parent(document.getElementById('slidersdiv'));
  createP("Corner block weight").parent(document.getElementById('slidersdiv'));


  gridWidth = round((windowWidth - 200) / blockSize);
  gridHeight = round(windowHeight / blockSize);
  let canvas = createCanvas(gridWidth * blockSize, gridHeight * blockSize);
  canvas.parent(document.getElementById('canvasdiv'));
  pixelDensity(1);
  background(255);

  loadOptions();
  buildGrid();

  document.getElementById('btn-redraw')
    .addEventListener('click', (e) =>
    {
      loadOptions();
      buildGrid();
      loop();
    });
}

function selectNextBlock2Collapse()
{

  let minEntropy = Infinity;
  let possibilities = [];

  for (let y = 0; y < gridHeight; y++)
  {
    for (let x = 0; x < gridWidth; x++)
    {
      if (grid[y][x].collapsed) continue;
      let entropy = grid[y][x].options.length;
      if (entropy > minEntropy) continue;
      if (entropy < minEntropy)
      {
        minEntropy = entropy;
        possibilities = [];
      }
      possibilities.push({ x: x, y: y });
    }
  }

  return random(possibilities);
}

function weightedRandom(options)
{
  let i;
  weights = options.map(o => o.weight);

  for (i = 0; i < weights.length; i++)
    weights[i] += weights[i - 1] || 0;

  var random = Math.random() * weights[weights.length - 1];

  for (i = 0; i < weights.length; i++)
    if (weights[i] > random)
      break;

  return options[i];
}

function collapse(pos)
{
  let x = pos.x;
  let y = pos.y;

  grid[y][x].collapsed = true;
  grid[y][x].options = [weightedRandom(grid[y][x].options)];

  // Neighbor above
  if (y > 0)
  {
    grid[y - 1][x].options = grid[y - 1][x].options.filter(option =>
      option.sides[DOWN] == grid[y][x].options[0].sides[UP]);
  }

  // Neighbor below
  if (y < gridHeight - 1)
  {
    grid[y + 1][x].options = grid[y + 1][x].options.filter(option =>
      option.sides[UP] == grid[y][x].options[0].sides[DOWN]);
  }

  // Neighbor to the right
  if (x < gridWidth - 1)
  {
    grid[y][x + 1].options = grid[y][x + 1].options.filter(option =>
      option.sides[LEFT] == grid[y][x].options[0].sides[RIGHT]);
  }

  // Neighbor to the left
  if (x > 0)
  {
    grid[y][x - 1].options = grid[y][x - 1].options.filter(option =>
      option.sides[RIGHT] == grid[y][x].options[0].sides[LEFT]);
  }

  if (grid.flat().filter(x => x.options.length == 0).length) throw `Very bad! ${x}, ${y}`;
}

function draw()
{
  for (let i = 0; i < 10; i++)
  {
    pos = selectNextBlock2Collapse();
    if (pos)
    {
      collapse(pos);
    }
    else
    {
      noLoop();
      break;
    }
  }

  background(255);
  for (let y = 0; y < gridHeight; y++)
  {
    for (let x = 0; x < gridWidth; x++)
    {
      if (!grid[y][x].collapsed) continue;
      push();
      translate(x * blockSize + blockSize / 2, y * blockSize + blockSize / 2);
      rotate(grid[y][x].options[0].rotation);
      imageMode(CENTER);
      image(grid[y][x].options[0].image, 0, 0, blockSize, blockSize);
      pop();
    }
  }
}