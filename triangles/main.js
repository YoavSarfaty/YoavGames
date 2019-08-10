let points;
let img;
let edge;
let imgname = "img.jpg";

let res = 1000;
let bluramt = 0;
let trires = 5;
let triamt = 5000;

let resslider, blurslider, triresslider, triamtslider;
let resp, blurp, triresp, triamtp;
let resetbutton, input;
let speed = 10;

function setup() {

  let canvas = createCanvas(windowHeight, windowHeight);
  canvas.parent(document.getElementById('canvasdiv'));
  pixelDensity(1);
  background(0);

  fill(255, 0, 0);
  textSize(20);
  text('please select an image!', width / 2 - 100, height / 2 - 100, width / 2 + 100, height);

  resslider = createSlider(1, 1000, 1000, 1);
  resp = createP('sample resolution (lower is better but takes more time)');
  blurslider = createSlider(0, 10, 0, 1);
  blurp = createP('blur (applied to image before processing)');
  triresslider = createSlider(0, 50, 5, 1);
  triresp = createP('triangle size difference (when set high all triangles will be the smae size)');
  triamtslider = createSlider(100, 10000, 5000, 1);
  triamtp = createP('how many triangles?');
  resetbutton = createButton('start over!');
  input = createFileInput(handleFile);

  resslider.parent(document.getElementById('slidersdiv'));
  resp.parent(document.getElementById('slidersdiv'));
  blurslider.parent(document.getElementById('slidersdiv'));
  blurp.parent(document.getElementById('slidersdiv'));
  triresslider.parent(document.getElementById('slidersdiv'));
  triresp.parent(document.getElementById('slidersdiv'));
  triamtslider.parent(document.getElementById('slidersdiv'));
  triamtp.parent(document.getElementById('slidersdiv'));
  resetbutton.parent(document.getElementById('slidersdiv'));
  input.parent(document.getElementById('slidersdiv'));
  resetbutton.mousePressed(reset);

  noLoop();
  // reset();
}

function reset() {
  noLoop();
  res = resslider.value();
  bluramt = blurslider.value();
  trires = triresslider.value();
  triamt = triamtslider.value();

  loadImage(imgname, image => {
    img = image;

    let mywidth, myheight;
    if (img.width / (windowWidth / 1.5) > img.height / windowHeight) {
      mywidth = (windowWidth / 1.5);
      myheight = ((windowWidth / 1.5) / img.width) * img.height;
    } else {
      myheight = windowHeight;
      mywidth = (windowHeight / img.height) * img.width;
    }

    img.resize(round(mywidth), round(myheight));
    if (bluramt > 0) {
      img.filter(BLUR, bluramt);
    }
    edge = getEdges(img);

    points = [
      [0, 0],
      [round(mywidth), 0],
      [round(mywidth), round(myheight)],
      [0, round(myheight)]
    ];

    resizeCanvas(round(mywidth), round(myheight));
    console.log('starting over');
    loop();
  });
}

const getIndexByXY = (x, y) => (x + y * width) * 4;

function gettris(ps) {
  let raw = Delaunator.from(ps).triangles;
  let tris = [];
  for (let i = 0; i < raw.length; i += 3) {
    tris.push([
      ps[raw[i + 0]],
      ps[raw[i + 1]],
      ps[raw[i + 2]]
    ]);
  }
  return tris;
}

function PointInTriangle(pt, v1, v2, v3) {

  function sign(p1, p2, p3) {
    return (p1[0] - p3[0]) * (p2[1] - p3[1]) - (p2[0] - p3[0]) * (p1[1] - p3[1]);
  }

  let d1, d2, d3;
  let has_neg, has_pos;

  d1 = sign(pt, v1, v2);
  d2 = sign(pt, v2, v3);
  d3 = sign(pt, v3, v1);

  has_neg = (d1 < 0) || (d2 < 0) || (d3 < 0);
  has_pos = (d1 > 0) || (d2 > 0) || (d3 > 0);

  return !(has_neg && has_pos);
}

function getTriAvgColor(tri, img) {
  let maxx = max(tri[0][0], tri[1][0], tri[2][0]);
  let minx = min(tri[0][0], tri[1][0], tri[2][0]);
  let maxy = max(tri[0][1], tri[1][1], tri[2][1]);
  let miny = min(tri[0][1], tri[1][1], tri[2][1]);
  let r = 0,
    g = 0,
    b = 0;
  let counter = 0;
  img.loadPixels();
  // img.pixels;
  for (let y = max(miny, 0); y < min(maxy, img.height); y += res) {
    for (let x = max(minx, 0); x < min(maxx, img.width); x += res) {
      if (PointInTriangle([x, y], ...tri)) {
        counter++;
        let i = getIndexByXY(x, y);
        r += img.pixels[i + 0];
        g += img.pixels[i + 1];
        b += img.pixels[i + 2];
        // console.log(r, i, img.pixels.length);
      }
    }
  }

  if (counter < 2) {
    let x = round((tri[0][0] + tri[1][0] + tri[2][0]) / 3);
    let y = round((tri[0][1] + tri[1][1] + tri[2][1]) / 3);
    let i = (x + y * img.width) * 4;
    let r = img.pixels[i + 0];
    let g = img.pixels[i + 1];
    let b = img.pixels[i + 2];
    return color(r, g, b);
  }

  r /= counter;
  g /= counter;
  b /= counter;
  return color(r, g, b);
}

function getEdges(img) {
  const res = 2;
  img.loadPixels();
  let s = new Array(img.pixels.length / 4);
  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      let diff = 0;
      let c = [
        img.pixels[getIndexByXY(x, y) + 0],
        img.pixels[getIndexByXY(x, y) + 1],
        img.pixels[getIndexByXY(x, y) + 2]
      ];
      for (let cy = max(0, y - res); cy < min(y + res, img.height); cy++) {
        for (let cx = max(0, x - res); cx < min(x + res, img.width); cx++) {
          let cc = [
            img.pixels[getIndexByXY(cx, cy) + 0],
            img.pixels[getIndexByXY(cx, cy) + 1],
            img.pixels[getIndexByXY(cx, cy) + 2]
          ];
          diff += dist(...c, ...cc);
        }
      }

      s[getIndexByXY(x, y) / 4] = diff / (dist(x, y, width / 2, height / 2) + 500);
    }
  }
  let b = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] > b) b = s[i];
  }
  return s.map(v => v * 255 / b);
}

function getNextPoint() {
  let b = [];
  let bs = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let v = edge[getIndexByXY(x, y) / 4];
      if (v > bs) {
        bs = v;
        b = [x, y];
      }
    }
  }


  let [x, y] = b;

  const res = trires;
  for (let cy = max(0, y - res); cy < min(y + res, height); cy++) {
    for (let cx = max(0, x - res); cx < min(x + res, width); cx++) {
      edge[getIndexByXY(cx, cy) / 4] *= 0.5;
    }
  }
  edge[getIndexByXY(x, y) / 4] = 0;

  return b;
}

function draw() {

  if (!img) return;

  smooth(4);
  strokeWeight(1);

  for (let i = 0; i < constrain(speed, 10, 300); i++) points.push(getNextPoint());
  if (frameRate() > 30) {
    speed++;
  } else {
    speed--;
  }
  background(0);
  let tris = gettris(points);
  for (let tri of tris) {
    let c = getTriAvgColor(tri, img);
    fill(c);
    stroke(c);
    triangle(...tri.flat());
  }

  if (tris.length > triamt) {
    filter(BLUR, .5);
    noLoop();
  } else {
    fill(255, 0, 0);
    textSize(20);
    let t = frameRate().toFixed(1);
    if (t.length < 4) t = "0" + t;
    text(t, 5, 25);
    stroke(255, 0, 0);
    strokeWeight(10);
    let x = map(tris.length, 0, triamt, 0, width);
    line(0, 0, x, 0);
  }
}

function handleFile(file) {
  console.log(file);
  if (file.type === 'image') {
    imgname = file.data;
    reset();
  }
}