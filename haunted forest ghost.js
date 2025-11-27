let entities = []; // ghosts array
let ghostLifetime = 5000; // time where ghost can be seen (5 seconds)
// let sound; // 🗑️ REMOVED: No longer needed
let mic;

// 🗑️ REMOVED: function preload() block

function setup() {
  createCanvas(1500, 800);
  mic = new p5.AudioIn();
  mic.start();
  // Set frame rate to ensure consistent behavior (optional, but good practice)
  frameRate(60); 
}

function draw(){
  // Clear the background every frame with a slight transparency for trails
  background(0, 50); 
  
  let volume = mic.getLevel()*100; // get sound easier

  // 1. Logic to ADD new ghosts
  if(volume > 10 && entities.length < 3){
    entities.push({
      x: random(width), 
      y: random(height), 
      diameter: random(50, 100), 
      alpha: 0, 
      speedX: random(-2, 2),
      speedY: random(-2, 2),
      birthTime: millis()
    });
  }

  // 2. Logic to UPDATE, DRAW, and REMOVE ghosts
  for (let i = entities.length - 1; i >= 0; i--) {
    let ghost = entities[i];
    let aliveTime = millis() - ghost.birthTime;

    // A. Control transparency (fading in)
    // The ghost fades in regardless of current volume, as long as it's not fully opaque.
    if (ghost.alpha < 255) {
      ghost.alpha += 5; 
    }

    // B. Move and check boundaries
    ghost.x += ghost.speedX;
    ghost.y += ghost.speedY;
    if (ghost.x < 0 || ghost.x > width) ghost.speedX *= -1;
    if (ghost.y < 0 || ghost.y > height) ghost.speedY *= -1;

    // C. Draw ghost
    noStroke();
    fill(255, 255, 255, ghost.alpha); 
    ellipse(ghost.x, ghost.y, ghost.diameter);

    // Draw eyes
    fill(0,ghost.alpha); // Black eyes that also respect the ghost's transparency
    ellipse(ghost.x - 10, ghost.y - 10, 8);
    ellipse(ghost.x + 10, ghost.y - 10, 8);

    // D. Remove ghost after 5 seconds
    if (aliveTime > ghostLifetime) {
      entities.splice(i, 1);
    }
  }
}