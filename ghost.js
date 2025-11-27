let entities = []; //ghosts
let ghostLifetime = 5000; //time where ghost can be seen (5 seconds)
let sound;
let mic;

function preload(){
  sound = loadSound()
}

function setup() {
  createCanvas(1500, 800);
  mic = new p5.AudioIn();
  mic.start();
}

function draw(){
  let volume = mic.getLevel()*100; //get sound easier

  if(volume > 10 && entities.length < 3){
    entities.push({
      x: random(width), //random x
      y: random(height), //random y
      diameter: random(50, 100), //ghost size in oval
      alpha: 0, //transparency starts at 0
      speedX: random(-2, 2),
      speedY: random(-2, 2),
      birthTime: millis() //generation time to calculate survival time
    });
  }

  //updating ghost
  for (let i = entities.length - 1; i >= 0; i--) {
    let ghost = entities[i];
    let aliveTime = millis() - ghost.birthTime;

    //controll transparency, slowly appears when the volume >10
    if (volume > 10 && ghost.alpha < 255) {
      ghost.alpha += 5; //adding
    }

    //move randomly in speed
    ghost.x += ghost.speedX;
    ghost.y += ghost.speedY;
    //prevent ghost move out of the canva
    if (ghost.x < 0 || ghost.x > width) ghost.speedX *= -1;
    if (ghost.y < 0 || ghost.y > height) ghost.speedY *= -1;

    //draw ghost
    noStroke();
    fill(255, 255, 255, ghost.alpha); //color white and transparency
    ellipse(ghost.x, ghost.y, ghost.diameter);

    //draw eyes
    fill(0,ghost.alpha);
    ellipse(ghost.x - 10, ghost.y - 10, 8);
    ellipse(ghost.x + 10, ghost.y - 10, 8);

    //disappear after 5 seconds
    if (aliveTime > ghostLifetime) {
      entities.splice(i, 1);
    }
  }
}
