// Ghost Constants
const GHOST_LIFETIME = 5000;
const MAX_GHOSTS = 3;
// Firefly Constants
const FIREFLY_LIFETIME = 8000; 
const INITIAL_FIREFLIES = 30; 
// P5.js and Serial Variables
let topcolor, bottomcolor;
let port, connectBtn; 
let digitalValue = "LOW"; 
// Entity Arrays
let ghosts = []; 
let fireflies = [];

/*
    ghost class definition
*/
class Ghost {
  constructor(p) {
    this.p = p; 
    // Ghosts start slightly off-screen or near the ground/tombstone area
    this.x = p.random(p.width * 0.4, p.width * 0.8); 
    this.y = p.random(p.height * 0.5, p.height * 0.8);
    this.diameter = p.random(50, 100);
    this.alpha = 0;
    this.speedX = p.random(-2, 2);
    this.speedY = p.random(-2, 2);
    this.birthTime = p.millis();
  }

  // isHigh is a boolean (digitalValue === 'HIGH')
  update(isHigh) {
    let aliveTime = this.p.millis() - this.birthTime;
    // Fade in only if sound trigger is HIGH
    if (isHigh && this.alpha < 255) {
      this.alpha += 5;
    }

    // Movement
    this.x += this.speedX;
    this.y += this.speedY;
    // Check boundaries (bounce)
    if (this.x < 0 || this.x > this.p.width) this.speedX *= -1;
    if (this.y < 0 || this.y > this.p.height) this.speedY *= -1;
    // Returns true if the ghost is past its lifetime
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

/*
    firefly class definition 
*/
class Firefly {
  constructor(p) {
    this.p = p;
    this.noiseSeedX = p.random(1000);
    this.noiseSeedY = p.random(2000);
    this.noiseSeedFlicker = p.random(3000);
    this.reset();
  }

  // helper function to initialize or reset position and movement
  reset() {
    // Fireflies start low and float upwards, covering the entire canvas initially
    this.x = this.p.random(0, this.p.width);
    this.y = this.p.random(this.p.height * 0.6, this.p.height); // Start near the ground
    this.birth = this.p.millis();
    this.alpha = 255; 
  }

  update(isHigh) {
    let aliveTime = this.p.millis() - this.birth;
    let t = this.p.millis() * 0.0002; 
    // Slow, natural movement using Perlin noise
    this.x += this.p.map(this.p.noise(this.noiseSeedX + t), 0, 1, -0.5, 0.5);
    this.y += this.p.map(this.p.noise(this.noiseSeedY + t), 0, 1, -0.3, 0.3) - 0.1; // Gentle upward drift

    // If sensor is HIGH (loud noise), fireflies react by moving upward faster
    if (isHigh) {
      this.y -= 1.5;
    }
    // Boundary check / Lifetime reset (if they float too high or live too long)
    if (aliveTime > FIREFLY_LIFETIME || this.y < -20) {
      this.reset();
    }

    // Natural flicker using noise and life cycle
    let flicker = this.p.map(this.p.noise(this.noiseSeedFlicker + t * 2), 0, 1, 0.7, 1.2);
    let lifeCycle = aliveTime / FIREFLY_LIFETIME;
    // Use sin wave for consistent pulse, mapped to a range, and multiplied by noise flicker
    this.alpha = this.p.map(this.p.sin(lifeCycle * 360), -1, 1, 150, 255) * flicker;
  }

  draw() {
    this.p.noStroke();
    // Glow effect (fades in and out, flickers)
    this.p.fill(255, 255, 150, this.alpha * 0.2); 
    this.p.ellipse(this.x, this.y, 25);
    // Body
    this.p.fill(255, 255, 180, this.alpha * 0.8);
    this.p.ellipse(this.x, this.y, 8);
  }
}

/*
    set up and serial 
*/
function setup() {
  createCanvas(windowWidth, windowHeight); 
  
  topcolor = color(0);
  bottomcolor = color(0, 0, 80); 
  strokeWeight(2);
  rectMode(CORNER); 
  angleMode(DEGREES);

  // Initialize Firefly objects
  for (let i = 0; i < INITIAL_FIREFLIES; i++) {
    fireflies.push(new Firefly(this));
  }

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
  // Keep the button centered before connection
  if (connectBtn) {
    connectBtn.position(width/2 - 75, height/2); 
  }
}

/*
    background
*/
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

/*
    main draw function
*/
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

  // Copies of tree 
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
  fill(120, 120, 110);
  noStroke();
  rect(tombX, tombY, tombW, tombH);
  circle(width * (712.5/1500), height * (510/800), tombCircleD); 
  // Cross on tombstone
  let crossCenterY = height * (530/800);
  let crossHeight = height * (70/800);
  let crossWidth = width * (70/1500);
  let crossStroke = width * (20/1500);
  fill(255);
  rect(width * (710/1500), height * (510/800), crossStroke, crossHeight);
  rect(width * (685/1500), crossCenterY, crossWidth, crossStroke);

  // Ground 
  let groundY = height * (750/800);
  let groundH = height * (50/800);
  fill(30, 20, 10);
  rect(0, groundY, width, groundH);

  // entitys behavior based on sound input
  const isSoundHigh = (digitalValue === 'HIGH');

  // FIREFLIES: Update and Draw (They handle their own spawning/resetting)
  for (let f of fireflies) {
    f.update(isSoundHigh);
    f.draw();
  }

  // GHOSTS: Spawn, Update, Draw, and Remove
  if (isSoundHigh && ghosts.length < MAX_GHOSTS) {
      ghosts.push(new Ghost(this)); 
  }
  // Update, Draw, and Remove Ghosts
  for (let i = ghosts.length - 1; i >= 0; i--) {
      // Pass the boolean state to the ghost's update function
      if (ghosts[i].update(isSoundHigh)) {
          ghosts.splice(i, 1); 
      } else {
          ghosts[i].draw();
      }
  }
}