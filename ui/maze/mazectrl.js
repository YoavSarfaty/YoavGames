function preload() {
  setSpacing(10, 65, VERTICAL);
  setStyle(60);
  addButton("New Maze", BOTTOM_RIGHT, () => {
    setup();
  });
  addButton("Bigger", BOTTOM_RIGHT, () => {
    cellSize++;
  });
  addButton("Smaller", BOTTOM_RIGHT, () => {
    cellSize--;
  });
  addButton("Faster", BOTTOM_RIGHT, () => {
    roundsperframe++;
  });
  addButton("Slower", BOTTOM_RIGHT, () => {
    roundsperframe--;
  });
}

function windowResized() {
  setSpacing();
}