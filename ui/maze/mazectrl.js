let newGrid = null;

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
  addButton("Save Maze", TOP_LEFT, saveGrid);
  addButton("Load Maze", TOP_LEFT, loadGrid);
}

function windowResized() {
  setSpacing();
}

function saveGrid() {
  let zip = new JSZip();
  zip.file("maze.json", JSON.stringify(grid));
  zip.generateAsync({
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: {
        level: 9
      }
    })
    .then((content) => {
      console.log(content);
      let e = document.createEvent('MouseEvents');
      let a = document.createElement('a');
      a.download = "maze.zip";
      a.href = window.URL.createObjectURL(content);
      a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
      e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      a.dispatchEvent(e);
    });
}

function loadGrid() {
  let x = document.createElement("INPUT");
  x.setAttribute("type", "file");
  let e = document.createEvent('MouseEvents');
  e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
  x.dispatchEvent(e);
  x.onchange = () => {
    if (!x.files[0]) return;
    let zip = new JSZip();
    zip.loadAsync(x.files[0])
      .then(function (zip) {
        zip.files["maze.json"].async("text").then(function (txt) {
          newGrid = JSON.parse(txt);
        });
      });
  };
}