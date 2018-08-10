function setup() {
  setSpacing(10, 90, VERTICAL);
  setStyle(80, "#ffff00", "#ff0000");
  addButton("button", TOP_LEFT, () => {
    console.log("click!");
  });
  addButton("button2", TOP_LEFT, () => {
    console.log("click2!");
  });
  addButton("button3", TOP_LEFT, () => {
    console.log("click3!");
  });

  addButton("button", BOTTOM_LEFT, () => {
    console.log("click!");
  });
  addButton("button2", BOTTOM_LEFT, () => {
    console.log("click2!");
  });
  addButton("button3", BOTTOM_LEFT, () => {
    console.log("click3!");
  });

  addButton("button", TOP_RIGHT, () => {
    console.log("click!");
  });
  addButton("button2", TOP_RIGHT, () => {
    console.log("click2!");
  });
  addButton("button3", TOP_RIGHT, () => {
    console.log("click3!");
  });

  addButton("button", BOTTOM_RIGHT, () => {
    console.log("click!");
  });
  addButton("button2", BOTTOM_RIGHT, () => {
    console.log("click2!");
  });
  addButton("button3", BOTTOM_RIGHT, () => {
    console.log("click3!");
  });
}

function windowResized() {
  setSpacing();
}