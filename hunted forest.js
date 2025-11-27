let topcolor, bottomcolor;

function setup() {
  createCanvas(1500, 800);
  topcolor = color(0) //top color is black
  bottomcolor = color(0, 0, 80) //bottom color is dark blue RGB
  strokeWeight(2);
  
}
//make a function for drawing the same tree
function drawTree(trunkX, trunkY){
  //tree trunk
  fill(50); //color light brown
  stroke(1);
  rect(trunkX, trunkY, 50, height);
  //tree leaves
  fill(0, 80, 0); //color dark green
  stroke(1)
  triangle(trunkX + 25, trunkY - 200, trunkX - 125, trunkY + 100, trunkX + 170, trunkY + 100); //bottom triangle
  triangle(trunkX + 25, trunkY - 300, trunkX - 100, trunkY, trunkX + 150, trunkY); //middle triangle
  triangle(trunkX + 25, trunkY - 400, trunkX - 75, trunkY - 175, trunkX + 125, trunkY - 175); //top triangle
}

function draw() {
//make a for loop for every line of canvas height for the background part
for(let y=0; y < height; y++){
  let n = map(y, 0, height, 0, 1); //y to 0-1
  let newcolor = lerpColor(topcolor, bottomcolor, n);
  stroke(newcolor);
  line(0, y, width, y); //fill canvas width
}

  //moon
  fill(255);
  noStroke();
  circle(600, 200, 300);

  //copies of tree
  drawTree(200, 300);
  drawTree(50, 370);
  drawTree(300, 350);
  drawTree(980, 255);
  drawTree(1200, 340);
  drawTree(1400, 260);
  drawTree(420, 450);
  drawTree(1300, 450);

  //drawtombstone
  //draw the stone itself
  fill(120, 120, 110);
  noStroke();
  rect(600, 500, 225, 250);
  circle(712.5, 510, 227);
  //draw the cross
  fill(255);
  noStroke();
  rect(710, 510, 20,  70);
  rect(685, 530, 70,  20);

  //ground
  fill(30, 20, 10);
  rect(0, 750, width, 50);
}