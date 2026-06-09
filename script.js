
function resize() {
    let canvas = document.getElementById("gameCanvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
}
let cameraX = 0
var keysPressed = {};

let cameraY = 0
function getCanvasX (x) {
    return (x - cameraX) * 75;
}
function getCanvasY (y) {
    return (y - cameraY) * 75;
}
resize();
window.addEventListener("resize", resize);

let ctx = document.getElementById("gameCanvas").getContext("2d");
ctx.imageSmoothingEnabled = false;

const textures = {};

function loadTexture(name) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = `./assets/textures/${name}.png`;
  });
}
var blocks = {

}
var blockMetaData = {
"grass": {
    "breakTime": 1,
    "tool": "shovel",
    "collision": true,
    "translucant": false,
    "liquid": false
},
"dirt": {
    "breakTime": 1,
    "tool": "shovel",
    "collision": true,
    "translucant": false,
    "liquid": false
},
"stone": {
    "breakTime": 2,
    "tool": "pickaxe",
    "collision": true,
    "translucant": false,
    "liquid": false
},
}
function drawBlock (type,x,y) {
  if (type === "grass") {
      ctx.drawImage(textures.grass, getCanvasX(x), getCanvasY(y), 75, 75);
  } else if (type === "dirt") {
      ctx.drawImage(textures.dirt, getCanvasX(x), getCanvasY(y), 75, 75);
  } else if (type === "stone") {
      ctx.drawImage(textures.stone, getCanvasX(x), getCanvasY(y), 75, 75);
  } else if (type === "mapleLog") {
      ctx.drawImage(textures.mapleLog, getCanvasX(x), getCanvasY(y), 75, 75);
  } else if (type === "mapleLeaf") {
      ctx.drawImage(textures.mapleLeaf, getCanvasX(x), getCanvasY(y), 75, 75);
  }
  blocks[`${x},${y}`] = type;
}
function createTree (type,x,y,length) {
  if (type === "maple" && length == "Long") {
      drawBlock("mapleLog", x, y);
      drawBlock("mapleLog", x, y-1);
      drawBlock("mapleLog", x, y-2);
      drawBlock("mapleLog", x, y-3);
      drawBlock("mapleLog", x, y-4);
      drawBlock("mapleLeaf", x-1, y-4);
      drawBlock("mapleLeaf", x, y-4);
      drawBlock("mapleLeaf", x+1, y-4);
      drawBlock("mapleLeaf", x-1, y-5);
      drawBlock("mapleLeaf", x, y-5);
      drawBlock("mapleLeaf", x+1, y-5);
      drawBlock("mapleLeaf", x-1, y-3);
      drawBlock("mapleLeaf", x+1, y-3);
      drawBlock("mapleLeaf", x-2, y-4);
      drawBlock("mapleLeaf", x+2, y-4);
      drawBlock("mapleLeaf", x-2, y-3);
  } else if (type === "maple" && length == "Short") {
      drawBlock("mapleLog", x, y);
      drawBlock("mapleLog", x, y-1);
      drawBlock("mapleLog", x, y-2);
      drawBlock("mapleLeaf", x-1, y-2);
      drawBlock("mapleLeaf", x, y-3);
      drawBlock("mapleLeaf", x, y-4);
      drawBlock("mapleLeaf", x+1, y-4);
      drawBlock("mapleLeaf", x-1, y-4);
      drawBlock("mapleLeaf", x+1, y-3);
      drawBlock("mapleLeaf", x+2, y-3);
      drawBlock("mapleLeaf", x-1, y-3);
      drawBlock("mapleLeaf", x-2, y-3);
      drawBlock("mapleLeaf", x+1, y-2);
      drawBlock("mapleLeaf", x+2, y-2);
  }
}
function draw() {

    // CAMERA MOVEMENT
    if (keysPressed["w"]) cameraY -= 0.05;
    if (keysPressed["a"]) cameraX -= 0.05;
    if (keysPressed["s"]) cameraY += 0.05;
    if (keysPressed["d"]) cameraX += 0.05;


  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  drawBlock("grass", 5, 9);
  drawBlock("grass", 8, 8);
  drawBlock("grass", 6, 9);
  drawBlock("grass", 7, 8);
  drawBlock("dirt", 7, 9);
  drawBlock("dirt", 6, 10);
  drawBlock("dirt", 5, 10);
  drawBlock("dirt", 4, 10);
  drawBlock("stone", 4, 11);
  createTree("maple", 5, 8,"Long");
  createTree("maple", 11, 7,"Short");
}
async function init() {

   textures.grass = await loadTexture("grass");
  textures.dirt = await loadTexture("dirt");
  textures.stone = await loadTexture("stone");
  textures.mapleLog = await loadTexture("mapleLog");
  textures.mapleLeaf = await loadTexture("mapleLeaf");
 draw();
}



init().then(() => {
    setInterval(draw, 1000 / 60);
});




document.addEventListener("keydown", (event) => {
  console.log(keysPressed);
  console.log(typeof keysPressed[event.key]);
    keysPressed[event.key] = true;
    
});

document.addEventListener("keyup", (event) => {
    delete keysPressed[event.key];
    if (keysPressed["w"]) {
        cameraY -= 0.1;
    }
    if (keysPressed["a"]) {
        cameraX -= 0.1;
    }
    if (keysPressed["s"]) {
        cameraY += 0.1;
    }
    if (keysPressed["d"]) {
        cameraX += 0.1;
    }
});

console.log(blocks);