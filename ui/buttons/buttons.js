const TOP_LEFT = 0;
const BOTTOM_LEFT = 1;
const TOP_RIGHT = 2;
const BOTTOM_RIGHT = 3;
const HORIZONTAL = 0;
const VERTICAL = 1;

let BUTTONS = [
  [],
  [],
  [],
  []
];
let BUTTON_MARGIN = 100;
let BUTTON_DIST = 100;
let BUTTON_DIR = VERTICAL;
let BUTTON_SIZE = 50;
let BUTTON_STYLE;
let BUTTON_COLOR = "#00ff83";
let BUTTON_FCOLOR = "#00b259";

function addButton(text, alignment, callback) {
  button = createButton(text);
  let index = BUTTONS[alignment].length;
  button.mousePressed(callback);
  button.class('buttons');
  BUTTONS[alignment].push(button);
  setSpacing();
  setStyle();
  return button;
}

function setSpacing(margin, dist, dir) {
  if (margin != undefined) {
    BUTTON_MARGIN = margin;
  }
  if (dist != undefined) {
    BUTTON_DIST = dist;
  }
  if (dir != undefined) {
    BUTTON_DIR = dir;
  }
  for (let alignment = 0; alignment < 4; alignment++) {
    for (let i = 0; i < BUTTONS[alignment].length; i++) {
      let button = BUTTONS[alignment][i];
      let index = i;
      if (BUTTON_DIR == VERTICAL) {
        if (alignment === TOP_LEFT) {
          button.position(BUTTON_MARGIN, BUTTON_MARGIN + BUTTON_DIST * index);
        }
        if (alignment === BOTTOM_LEFT) {
          button.position(BUTTON_MARGIN, windowHeight - BUTTON_MARGIN - BUTTON_DIST * (index + 1));
        }
        if (alignment === TOP_RIGHT) {
          button.position(windowWidth - BUTTON_SIZE - BUTTON_MARGIN, BUTTON_MARGIN + BUTTON_DIST * index);
        }
        if (alignment === BOTTOM_RIGHT) {
          button.position(windowWidth - BUTTON_SIZE - BUTTON_MARGIN, windowHeight - BUTTON_MARGIN - BUTTON_DIST * (index + 1));
        }
      } else {
        if (alignment === TOP_LEFT) {
          button.position(BUTTON_MARGIN + BUTTON_DIST * index, BUTTON_MARGIN);
        }
        if (alignment === BOTTOM_LEFT) {
          button.position(BUTTON_MARGIN + BUTTON_DIST * index, windowHeight - BUTTON_MARGIN - BUTTON_DIST);
        }
        if (alignment === TOP_RIGHT) {
          button.position(windowWidth - BUTTON_SIZE - BUTTON_MARGIN - BUTTON_DIST * index, BUTTON_MARGIN);
        }
        if (alignment === BOTTOM_RIGHT) {
          button.position(windowWidth - BUTTON_SIZE - BUTTON_MARGIN - BUTTON_DIST * index, windowHeight - BUTTON_MARGIN - BUTTON_DIST);
        }
      }
    }
  }
}

function setStyle(size, color, fcolor) {
  if (size != undefined) {
    BUTTON_SIZE = size;
  }
  if (color != undefined) {
    BUTTON_COLOR = color;
  }
  if (fcolor != undefined) {
    BUTTON_FCOLOR = fcolor;
  }
  if (BUTTON_STYLE == undefined) {
    BUTTON_STYLE = document.createElement('style');
    BUTTON_STYLE.type = 'text/css';
    BUTTON_STYLE.innerHTML = '';
    document.getElementsByTagName('head')[0].appendChild(BUTTON_STYLE);
  }
  //TODO more styling options
  BUTTON_STYLE.innerHTML =
    "\n.buttons{\n" +
    "border: none;" +
    "border-radius: 50%;" +
    "outline:0;" +
    "background-color: " + BUTTON_COLOR + ";" +
    "width: " + BUTTON_SIZE + "px;" +
    "height: " + BUTTON_SIZE + "px;" +
    "}\n" +
    "\n.buttons:active{" +
    "background-color: " + BUTTON_FCOLOR + ";" +
    "}\n";
}