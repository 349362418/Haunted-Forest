// ====================================================================
// 1. GLOBAL VARIABLES & CONSTANTS
// ====================================================================
const GHOST_LIFETIME = 5000;
const MAX_GHOSTS = 3;

let topcolor, bottomcolor;
let port, connectBtn; 
// Using "LOW" because your Arduino sends the full string ("HIGH" or "LOW")
let digitalValue = "LOW"; 
let entities = []; // Array for ghost objects (renamed from 'ghosts')

// ====================================================================
// 2. GHOST CLASS DEFINITION
// (The entire ghost.js file integrated here)
// ====================================================================
class Ghost {
  constructor(p) {
    this.p = p; 
    this.x = p.random(p.width); 
    this.y = p.random(p.height);
    this.diameter = p.random(50, 100);
    this.alpha = 0;
    this.speedX = p.random(-2, 2);
    this.speedY = p.random(-2, 2);
    this.birthTime = p.millis();
  }

  update(isHigh) {
    let aliveTime = this.p.millis() - this.birthTime;

    // Fade in only if sound trigger is HIGH
    if (isHigh && this.alpha < 255) {
      this.alpha += 5;
    }

    // Move and check boundaries (bounce)
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > this.p.width) this.speedX *= -1;
    if (this.y < 0 || this.y > this.p.height) this.speedY *= -1;

    // Check lifetime
    return aliveTime > GHOST_LIFETIME; 
  }

  draw() {
    this.p.noStroke();
    
    // Body (White with current alpha)
    this.p.fill(255, 255, 255, this.alpha);
    this.p.ellipse(this.x, this.y, this.diameter);

    // Eyes (Black with current alpha)
    this.p.fill(0, this.alpha);
    this.p.ellipse(this.x - 10, this.y - 10, 8);
    this.p.ellipse(this.x + 10, this.y - 10, 8);
  }
}

// ====================================================================
// 3. P5.js SETUP & SERIAL FUNCTIONS
// ====================================================================
function setup() {
  createCanvas(windowWidth, windowHeight); 
  
  topcolor = color(0);
  bottomcolor = color(0, 0, 80); 
  strokeWeight(2);
  
  rectMode(CORNER); 
  angleMode(DEGREES);

  // Serial setup (p5.webserial)
  port = createSerial();
  connectBtn = createButton("Connect to Arduino");
  connectBtn.position(width/2 - 75, height/2); 
  connectBtn.mousePressed(connectBtnClicked);
  port.on('data', gotSerialData);
}

// Arduino connection button logic
function connectBtnClicked() {
  // Uses p5.webserial open syntax
  port.open({baudRate: 9600}); 
  connectBtn.remove();
}

// Data handler: expects a full line (string "HIGH" or "LOW")
function gotSerialData() {
  // Reading a full line and trimming whitespace is correct for your Arduino setup
  let data = port.readLine().trim(); 
  
  if (data === "HIGH" || data === "LOW") {
    digitalValue = data;
  }
}

// Window resizing
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// ====================================================================
// 4. ARTWORK DRAWING FUNCTION (Responsive Tree)
// ====================================================================
function drawTree(normX, normY){
  let trunkX = map(normX, 0, 1, 0, width);
  let trunkY = map(normY, 0, 1, 0, height);
  let scaleFactor = width / 1500; 

  let trunkW = 50 * scaleFactor;
  let trunkH = 500 * scaleFactor; 
  
  fill(50); 
  stroke(1);
  rect(trunkX, trunkY, trunkW, trunkH);
  
  fill(0, 80, 0); 
  stroke(1);
  
  triangle(
    trunkX + 25 * scaleFactor, trunkY - 200 * scaleFactor,
    trunkX - 125 * scaleFactor, trunkY + 100 * scaleFactor,
    trunkX + 170 * scaleFactor, trunkY + 100 * scaleFactor
  ); 
  triangle(
    trunkX + 25 * scaleFactor, trunkY - 300 * scaleFactor, 
    trunkX - 100 * scaleFactor, trunkY, 
    trunkX + 150 * scaleFactor, trunkY
  );
  triangle(
    trunkX + 25 * scaleFactor, trunkY - 400 * scaleFactor, 
    trunkX - 75 * scaleFactor, trunkY - 175 * scaleFactor, 
    trunkX + 125 * scaleFactor, trunkY - 175 * scaleFactor
  );
}

// ====================================================================
// 5. MAIN DRAW LOOP
// ====================================================================
function draw() {
  // Background gradient
  for(let y=0; y < height; y++){
    let n = map(y, 0, height, 0, 1);
    let newcolor = lerpColor(topcolor, bottomcolor, n);
    stroke(newcolor);
    line(0, y, width, y);
  }

  // Moon (Responsive)
  let moonX = width * (600/1500);
  let moonY = height * (200/800);
  let moonD = width * (300/1500); 
  fill(255);
  noStroke();
  circle(moonX, moonY, moonD);

  // Copies of tree (Responsive)
  drawTree(200/1500, 300/800);
  drawTree(50/1500, 370/800);
  drawTree(300/1500, 350/800);
  drawTree(980/1500, 255/800);
  drawTree(1200/1500, 340/800);
  drawTree(1400/1500, 260/800);
  drawTree(420/1500, 450/800);
  drawTree(1300/1500, 450/800);

  // Tombstone (Responsive)
  let tombX = width * (600/1500);
  let tombY = height * (500/800);
  let tombW = width * (225/1500);
  let tombH = height * (250/800);
  let tombCircleD = width * (227/1500);

  fill(120, 120, 110);
  noStroke();
  rect(tombX, tombY, tombW, tombH);
  circle(width * (712.5/1500), height * (510/800), tombCircleD); 

  let crossCenterY = height * (530/800);
  let crossHeight = height * (70/800);
  let crossWidth = width * (70/1500);
  let crossStroke = width * (20/1500);

  fill(255);
  rect(width * (710/1500), height * (510/800), crossStroke, crossHeight);
  rect(width * (685/1500), crossCenterY, crossWidth, crossStroke);

  // Ground (Responsive)
  let groundY = height * (750/800);
  let groundH = height * (50/800);

  fill(30, 20, 10);
  rect(0, groundY, width, groundH);

  // --- Ghost Management Logic ---
  const isSoundHigh = (digitalValue === 'HIGH');

  // 1. GENERATE GHOSTS: Check if sound is HIGH and we are below the max count
  if (isSoundHigh && entities.length < MAX_GHOSTS) {
      entities.push(new Ghost(this)); 
  }

  // 2. UPDATE, DRAW, and REMOVE GHOSTS
  for (let i = entities.length - 1; i >= 0; i--) {
      // Pass the boolean state to the ghost's update function
      if (entities[i].update(isSoundHigh)) {
          entities.splice(i, 1); // Remove the ghost if it's past its lifetime
      } else {
          entities[i].draw();
      }
  }
}