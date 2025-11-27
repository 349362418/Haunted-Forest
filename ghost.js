// Global constants used by the class (outside the class definition)
const GHOST_LIFETIME = 5000;
const MAX_GHOSTS = 3;

// --- GHOST CLASS DEFINITION ---
class Ghost {
  // Pass the p5 instance (p) to the constructor if using instance mode, 
  // or use global p5 functions if running standalone.
  constructor(p) {
    this.p = p; // Store p5 instance reference (good for instance mode)
    this.x = p.random(p.width); 
    this.y = p.random(p.height);
    this.diameter = p.random(50, 100);
    this.alpha = 0;
    this.speedX = p.random(-2, 2);
    this.speedY = p.random(-2, 2);
    this.birthTime = p.millis();
  }

  // Updates movement, transparency, and checks boundaries
  update(isHigh) {
    let aliveTime = this.p.millis() - this.birthTime;

    // Fade in only if digitalValue is HIGH
    if (isHigh && this.alpha < 255) {
      this.alpha += 5;
    }

    // Move
    this.x += this.speedX;
    this.y += this.speedY;

    // Check boundaries (bounce)
    if (this.x < 0 || this.x > this.p.width) this.speedX *= -1;
    if (this.y < 0 || this.y > this.p.height) this.speedY *= -1;

    // Check lifetime
    return aliveTime > GHOST_LIFETIME; // Returns true if ghost should be removed
  }

  // Draws the ghost (body and eyes)
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
// --- END GHOST CLASS DEFINITION ---


// --- MAIN SKETCH LOGIC (Where you manage the array) ---
let entities = [];
let digitalValue = "LOW"; // Default state

// Serial setup
let serial;
function setup() {
  // Use p5.js global functions here since this is the main sketch
  createCanvas(windowWidth, windowHeight); 
  frameRate(60);

  // Serial setup (update port name as needed)
  serial = new p5.SerialPort();
  serial.open('/dev/tty.usbmodemXXXX'); // Replace with your Arduino port
  serial.on('data', gotSerialData);
}

function gotSerialData() {
  let data = serial.readLine().trim();
  if (data === "HIGH" || data === "LOW") {
    digitalValue = data;
  }
}

function draw() {
  // Optional: Add a transparent background call for trails
  background(0, 50); 

  // 1. GENERATE GHOSTS
  // 'this' refers to the global p5 environment here
  if (digitalValue === "HIGH" && entities.length < MAX_GHOSTS) {
    // Create a new Ghost instance, passing 'this' (the p5 object) for method calls
    entities.push(new Ghost(this)); 
  }

  // 2. UPDATE, DRAW, and REMOVE GHOSTS
  for (let i = entities.length - 1; i >= 0; i--) {
    let ghost = entities[i];
    
    // The update method now returns true if the ghost is ready to be removed
    if (ghost.update(digitalValue === "HIGH")) {
      entities.splice(i, 1);
    } else {
      ghost.draw();
    }
  }
}