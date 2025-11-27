// global vars
let xs = [], ys = [], xinc = 0, yinc = 0, speed = 2, numEnt = 100, cols = [], maxDist = 50;

function setup() {
  createCanvas(800, 800);
  angleMode(DEGREES);

  for (let i = 0; i < numEnt; i++) {
    xs[i] = random(0, width);
    ys[i] = random(0, height);
    cols[i] = color(random(0, 255));
  }
}

function draw() {
  background(20, 50);

  // loop to draw move the circles
  for (let i = 0; i < numEnt; i++) {
    let angle = 0;

    // this changes its angle / direction randomly
    if (random(0, 100) < 80) {
      angle = random(0, 360);
    }
    // angle to incrament on x and y axis
    let xinc = cos(angle) * speed, yinc = sin(angle) * speed;

    // incrament x and y positions
    xs[i] = xs[i] + xinc;
    ys[i] = ys[i] + yinc;


    // check for edge of canvas
    if (xs[i] > width) {
      xs[i] = 0;
    }
    if (ys[i] > height) {
      ys[i] = 0;
    }

    // check for edge of canvas
    if (xs[i] < 0) {
      xs[i] = width;
    }
    if (ys[i] < 0) {
      ys[i] = height;
    }
    // draw points
    stroke(cols[i]);
    strokeWeight(10);
    fill(cols[i]);
    point(xs[i], ys[i]);

    for (let j = i + 1; j < numEnt; j++) {
      let otherX = xs[j];
      let otherY = ys[j];
      let d = dist(xs[i], ys[i], otherX, otherY);

      if (d < maxDist ) {
        // the farther the thiner the conect line is, closer = thicker
        strokeWeight(map(d, 0, maxDist, 1, 0.1));
        line(xs[i], ys[i], otherX, otherY);
      }
    }
  }
}