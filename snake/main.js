let cols = 30;
let rows = 30;
let foodamnt = 3;

let snake; //Array for snake
let dir; //Direction of snake
let food //Array of food

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(10);
  restart();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

//A function to restart a game
function restart() {
  dir = 0;
  snake = [];
  for (let i = 0; i < 4; i++) {
    snake[i] = {
      x: floor(cols / 2),
      y: floor(rows / 2) - i
    };
  }
  food = new Array(foodamnt).fill().map(() => {
    return {
      x: floor(random(cols)),
      y: floor(random(rows))
    };
  });
}

function draw() {
  background(0);
  //Drawing grid
  let tilesize = min(width / cols, height / rows);
  translate(width / 2, height / 2);
  fill(255);
  for (let i = -cols / 2; i < cols / 2; i++) {
    for (let j = -rows / 2; j < rows / 2; j++) {
      rect(i * tilesize, j * tilesize, tilesize, tilesize);
    }
  }

  food.forEach((t) => {
    //Drawing food
    fill(0, 0, 255);
    rect((t.x - cols / 2) * tilesize, (t.y - rows / 2) * tilesize, tilesize, tilesize);
    //eat the food
    if (t.x === snake[snake.length - 1].x && t.y === snake[snake.length - 1].y) {
      snake.unshift({});
      t.x = floor(random(cols));
      t.y = floor(random(rows));
    }
  });

  snake.forEach((t) => {
    //Wraping
    t.x += cols;
    t.y += rows;
    t.x %= cols;
    t.y %= rows;
    //Drawing snake
    fill(255, 0, 0);
    rect((t.x - cols / 2) * tilesize, (t.y - rows / 2) * tilesize, tilesize, tilesize);
    if (t.x == snake[snake.length - 1].x && t.y == snake[snake.length - 1].y && t != snake[snake.length - 1]) restart();
  });
  //Drawing snake head
  fill(0, 255, 0);
  rect((snake[snake.length - 1].x - cols / 2) * tilesize, (snake[snake.length - 1].y - rows / 2) * tilesize, tilesize, tilesize);

  //Move snake
  if (dir == 0) {
    snake.shift();
    snake.push({
      x: snake[snake.length - 1].x,
      y: snake[snake.length - 1].y - 1
    });
  } else if (dir == 1) {
    snake.shift();
    snake.push({
      x: snake[snake.length - 1].x + 1,
      y: snake[snake.length - 1].y
    });
  } else if (dir == 2) {
    snake.shift();
    snake.push({
      x: snake[snake.length - 1].x,
      y: snake[snake.length - 1].y + 1
    });
  } else if (dir == 3) {
    snake.shift();
    snake.push({
      x: snake[snake.length - 1].x - 1,
      y: snake[snake.length - 1].y
    });
  }
}

//Keys
function keyPressed() {
  if ((keyCode == UP_ARROW || key.toLocaleLowerCase() == 'w') && dir != 2) {
    dir = 0;
  }
  if ((keyCode == RIGHT_ARROW || key.toLocaleLowerCase() == 'd') && dir != 3) {
    dir = 1;
  }
  if ((keyCode == DOWN_ARROW || key.toLocaleLowerCase() == 's') && dir != 0) {
    dir = 2;
  }
  if ((keyCode == LEFT_ARROW || key.toLocaleLowerCase() == 'a') && dir != 1) {
    dir = 3;
  }
}