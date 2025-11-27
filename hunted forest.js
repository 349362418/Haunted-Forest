// ====================================================================
// 1. GLOBAL VARIABLES & CONSTANTS
// ====================================================================
// Ghost Constants
const GHOST_LIFETIME = 5000;
const MAX_GHOSTS = 3;

// Firefly Constants
const FIREFLY_LIFETIME = 8000; // Increased lifetime for fireflies
const INITIAL_FIREFLIES = 30; // More fireflies for a good glow

// P5.js and Control Variables
let topcolor, bottomcolor;
let toggleBtn; // Button for manual HIGH/LOW state control
// Set to "LOW" or "HIGH" strings to simulate Arduino input
let digitalValue = "LOW"; 

// Entity Arrays
let ghosts = []; 
let fireflies = [];

// ====================================================================
// 2. ENTITY CLASS DEFINITIONS
// ====================================================================

// --- 2.1. GHOST CLASS ---
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

    // Move
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

// --- 2.2. FIREFLY CLASS ---
class Firefly {
  constructor(p) {
    this.p = p;
    this.noiseSeedX = p.random(1000);
    this.noiseSeedY = p.random(2000);
    this.noiseSeedFlicker = p.random(3000);
    this.reset();
  }

  // Helper function to initialize or reset position and movement
  reset() {
    // Fireflies start low and float upwards, covering the entire canvas initially
    this.x = this.p.random(0, this.p.width);
    this.y = this.p.random(this.p.height * 0.6, this.p.height); // Start near the ground
    this.birth = this.p.millis();
    this.alpha = 255; 
  }

  update(isHigh) {
    let aliveTime = this.p.millis() - this.birth;
    let t = this.p.millis() * 0.0002; // Slow time for noise

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

// ====================================================================
// 3. MANUAL CONTROL FUNCTIONS
// ====================================================================

// Function to manually toggle the 'sound sensor' state
function toggleDigitalValue() {
  if (digitalValue === "LOW") {
    digitalValue = "HIGH";
  } else {
    digitalValue = "LOW";
  }
}

// Use Spacebar to toggle the state
function keyPressed() {
  if (key === ' ') { // ' ' is the spacebar
    toggleDigitalValue();
    // Prevents the spacebar from scrolling the page
    return false; 
  }
}

// ====================================================================
// 4. P5.js SETUP
// ====================================================================
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

  // --- MANUAL CONTROL SETUP ---
  toggleBtn = createButton(`Toggle Sensor (Current: ${digitalValue})`);
  toggleBtn.style('padding', '8px 16px');
  toggleBtn.style('background-color', '#4C5D6F');
  toggleBtn.style('color', 'white');
  toggleBtn.style('border', 'none');
  toggleBtn.style('border-radius', '6px');
  toggleBtn.style('cursor', 'pointer');
  toggleBtn.position(20, 20); 
  toggleBtn.mousePressed(toggleDigitalValue);
}


// Window resizing
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // Keep the button in the top left corner
  if (toggleBtn) {
    toggleBtn.position(20, 20); 
  }
}

// ====================================================================
// 5. ARTWORK DRAWING FUNCTION (Responsive Tree)
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
// 6. MAIN DRAW LOOP
// ====================================================================
function draw() {
  // Background gradient
  for(let y=0; y < height; y++){
    let n = map(y, 0, height, 0, 1);
    let newcolor = lerpColor(topcolor, bottomcolor, n);
    stroke(newcolor);
    line(0, y, width, y);
  }

  // --- Draw Artwork ---
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

  // --- UI Display for Manual Testing ---
  const isSoundHigh = (digitalValue === 'HIGH');
  
  // Update button text and color based on state
  toggleBtn.html(`Toggle Sensor (Current: ${digitalValue})`);
  toggleBtn.style('background-color', isSoundHigh ? '#B02D30' : '#4C5D6F'); // Red when HIGH

  // Add status text for clarity
  let statusText = `State: ${digitalValue} (Press SPACE)`;
  let statusColor = isSoundHigh ? color(255, 50, 50) : color(50, 255, 50);

  fill(statusColor);
  textSize(20);
  textAlign(LEFT, TOP);
  text(statusText, 20, 65);

  // --- Entity Management Logic ---

  // 1. FIREFLIES: Update and Draw (They handle their own spawning/resetting)
  for (let f of fireflies) {
    f.update(isSoundHigh);
    f.draw();
  }

  // 2. GHOSTS: Spawn, Update, Draw, and Remove
  // Generate Ghosts: Check if sound is HIGH and we are below the max count
  if (isSoundHigh && ghosts.length < MAX_GHOSTS) {
      ghosts.push(new Ghost(this)); 
  }

  // Update, Draw, and Remove Ghosts
  for (let i = ghosts.length - 1; i >= 0; i--) {
      // Pass the boolean state to the ghost's update function
      if (ghosts[i].update(isSoundHigh)) {
          ghosts.splice(i, 1); // Remove the ghost if it's past its lifetime
      } else {
          ghosts[i].draw();
      }
  }
}