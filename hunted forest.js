let topcolor, bottomcolor;

function setup() {
  createCanvas(windowWidth, windowHeight); 
  
  topcolor = color(0);
  bottomcolor = color(0, 0, 80); 
  strokeWeight(2);
  
  rectMode(CORNER); 
  angleMode(DEGREES);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function drawTree(normX, normY){
  // Map normalized coordinates to actual pixel coordinates
  let trunkX = map(normX, 0, 1, 0, width);
  let trunkY = map(normY, 0, 1, 0, height);
  
  // Define a proportional scaling factor based on the original 1500px width
  let scaleFactor = width / 1500; 

  // Tree trunk
  let trunkW = 50 * scaleFactor;
  let trunkH = 500 * scaleFactor; 
  
  fill(50); 
  stroke(1);
  rect(trunkX, trunkY, trunkW, trunkH);
  
  // Tree leaves: scaled proportionally
  fill(0, 80, 0); 
  stroke(1);
  
  // Bottom triangle
  triangle(
    trunkX + 25 * scaleFactor, trunkY - 200 * scaleFactor,
    trunkX - 125 * scaleFactor, trunkY + 100 * scaleFactor,
    trunkX + 170 * scaleFactor, trunkY + 100 * scaleFactor
  ); 
  // Middle triangle
  triangle(
    trunkX + 25 * scaleFactor, trunkY - 300 * scaleFactor, 
    trunkX - 100 * scaleFactor, trunkY, 
    trunkX + 150 * scaleFactor, trunkY
  );
  // Top triangle
  triangle(
    trunkX + 25 * scaleFactor, trunkY - 400 * scaleFactor, 
    trunkX - 75 * scaleFactor, trunkY - 175 * scaleFactor, 
    trunkX + 125 * scaleFactor, trunkY - 175 * scaleFactor
  );
}

function draw() {
// Background gradient
for(let y=0; y < height; y++){
  let n = map(y, 0, height, 0, 1);
  let newcolor = lerpColor(topcolor, bottomcolor, n);
  stroke(newcolor);
  line(0, y, width, y);
}

// Moon
let moonX = width * (600/1500);
let moonY = height * (200/800);
let moonD = width * (300/1500); 
fill(255);
noStroke();
circle(moonX, moonY, moonD);

// Copies of tree: Pass normalized coordinates (Original X/1500, Original Y/800)
drawTree(200/1500, 300/800);
drawTree(50/1500, 370/800);
drawTree(300/1500, 350/800);
drawTree(980/1500, 255/800);
drawTree(1200/1500, 340/800);
drawTree(1400/1500, 260/800);
drawTree(420/1500, 450/800);
drawTree(1300/1500, 450/800);

// Tombstone
let tombX = width * (600/1500);
let tombY = height * (500/800);
let tombW = width * (225/1500);
let tombH = height * (250/800);
let tombCircleD = width * (227/1500);

// Draw the stone itself
fill(120, 120, 110);
noStroke();
rect(tombX, tombY, tombW, tombH);

// Circle 
circle(width * (712.5/1500), height * (510/800), tombCircleD); 

// Draw the cross
let crossCenterY = height * (530/800);
let crossHeight = height * (70/800);
let crossWidth = width * (70/1500);
let crossStroke = width * (20/1500);

fill(255);
// Vertical bar
rect(width * (710/1500), height * (510/800), crossStroke, crossHeight);
// Horizontal bar
rect(width * (685/1500), crossCenterY, crossWidth, crossStroke);

// Ground
let groundY = height * (750/800);
let groundH = height * (50/800);

fill(30, 20, 10);
rect(0, groundY, width, groundH);
}