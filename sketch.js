// global vars
let x = 0, y = 0, xinc = 0, yinc = 0, minInc = 10, maxInc = 15;

function setup() {
  createCanvas(800, 800);
  x= width /2;
  y= height /2;
}

function draw() {
  background(100, 20);
  let color = random(0,255);
  stroke(color);
  fill(color);
  circle(x,y,50);

// changes the x y location randomly
if (random(0,100) < 20){
  xinc = random(minInc,maxInc);
}
if (random(0,100) < 20){
  yinc = random(minInc,maxInc);
}
// changes direction randomly
if (random(0,100) < 10){
  xinc = xinc * -1;
}
if (random(0,100) < 10){
  yinc = yinc * -1;
}

// updating x and y inc by incraments
  x = x + xinc;
  y = y + yinc;

  // check for edge of canvas
  if (x > width) {
    x = 0;
  }
  if (y > height) {
    y = 0;
  }

// check for edge of canvas
  if (x < 0) {
    x = width;
  }
  if (y < 0) {
    y = height;
  }


}
