// Global constants used by the class
const GHOST_LIFETIME = 5000;
const MAX_GHOSTS = 3;

// Ghost class definition
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

  // isHigh is a boolean (true/false) passed from the main sketch
  update(isHigh) {
    let aliveTime = this.p.millis() - this.birthTime;

    // Fade in only if digitalValue is HIGH
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
