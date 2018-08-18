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
let BUTTON_CLICK = 20;
let BUTTON_DIST = 100;
let BUTTON_DIR = VERTICAL;
let BUTTON_SIZE = 50;
let BUTTON_STYLE;
let BUTTON_COLOR = "#00ff83";
let BUTTON_FCOLOR = "#00b259";
let BUTTON_DIV = [];

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

  BUTTON_CLICK = BUTTON_SIZE + BUTTON_MARGIN;

  if (BUTTON_DIV.length === 0) {
    div = createDiv();
    div.class("buttons_div");
    div.position(0, 0);
    div.size(windowWidth, BUTTON_CLICK);
    BUTTON_DIV.push(div);
    div = createDiv();
    div.class("buttons_div");
    div.position(0, 0);
    div.size(BUTTON_CLICK, windowHeight);
    BUTTON_DIV.push(div);
    div = createDiv();
    div.class("buttons_div");
    div.position(windowWidth - BUTTON_CLICK, 0);
    div.size(BUTTON_CLICK, windowHeight);
    BUTTON_DIV.push(div);
    div = createDiv();
    div.class("buttons_div");
    div.position(0, windowHeight - BUTTON_CLICK);
    div.size(windowWidth, BUTTON_CLICK);
    BUTTON_DIV.push(div);

    function hideb(e) {
      if (!e) return;
      if (e.clientX < BUTTON_CLICK || e.clientX > windowWidth - BUTTON_CLICK || e.clientY < BUTTON_CLICK || e.clientY > windowHeight - BUTTON_CLICK) return;
      for (d of BUTTONS) {
        for (b of d) {
          b.hide();
        }
      }
    }

    function showb() {
      for (d of BUTTONS) {
        for (b of d) {
          b.show();
        }
      }
    }

    for (d of BUTTON_DIV) {
      d.mouseOver(showb);
      d.mouseOut(hideb);
    }

    hideb();

  } else {
    BUTTON_DIV[0].size(windowWidth, BUTTON_CLICK);
    BUTTON_DIV[1].size(BUTTON_CLICK, windowHeight);
    BUTTON_DIV[2].position(windowWidth - BUTTON_CLICK, 0);
    BUTTON_DIV[2].size(BUTTON_CLICK, windowHeight);
    BUTTON_DIV[3].position(0, windowHeight - BUTTON_CLICK);
    BUTTON_DIV[3].size(windowWidth, BUTTON_CLICK)
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
    `
    .buttons_div{
      z-index:200;
    }
    .buttons_div:hover{
      z-index:50;
    }
    ` +
    "\n.buttons{\n" +
    "z-index: 100;" +
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