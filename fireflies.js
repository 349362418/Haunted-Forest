let fireflies = []; 
let lifetime = 5000; 
let mic;

function preLoad(){
  sound = loadSound()
}

function setup() {
  createCanvas(1500, 800);
  mic = new p5.AudioIn();
  mic.start();

  // make 20 fireflies at start
  for (let i = 0; i < 20; i++) {
    fireflies.push(makeFirefly());
  }
}

function makeFirefly() {
  return {
    x: random(width/3, width*2/3),
    y: random(height/3, height/2),
    speedX: random(-0.5, 0.5),
    speedY: random(-0.5, 0.5),
    birth: millis()
  };
}

function draw() {
  background(0);
  let volume = mic.getLevel() * 100;

  for (let f of fireflies) {
    // glow
    noStroke();
    fill(255, 255, 150, 80);
    ellipse(f.x, f.y, 30);

    // body
    fill(255, 255, 180);
    ellipse(f.x, f.y, 12);

    // movement
    if (volume > 10) {
      f.y -= 3; // move upward
    } else {
      f.x += random(-0.5, 0.5);
      f.y += random(-0.5, 0.5);
    }

    // lifetime reset
   // if (millis() - f.birth > lifetime || f.y < -20) {
    //  Object.assign(f, makeFirefly());
    }
//  }
}

