function resize() {
  let canvas = document.getElementById("gameCanvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

let cameraX = 0;
var keysPressed = {};

let cameraY = 0;
function getCanvasX(x) {
  return (x - cameraX) * 75;
}
function getCanvasY(y) {
  return (y - cameraY) * 75;
}
resize();
window.addEventListener("resize", resize);

let ctx = document.getElementById("gameCanvas").getContext("2d");
ctx.imageSmoothingEnabled = false;

const textures = {};

function loadTexture(name) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = `./assets/textures/${name}.png`;
  });
}
var blocks = {};
var biomeMetaData = {
    plains:{
        humidity: 0.5,
        temperature: 0.5,
        
    },
    mapleForest:{
        humidity: 0.7,
        temperature: 0.5,
    },
    desert:{
        humidity: 0.2,
        temperature: 0.8,
    },
};
var chunks = {
    "0": {
"biome": "plains",
"chunkEdited": false,


    }
};


var blockMetaData = {
  grass: {
    breakTime: 1,
    tool: "shovel",
    collision: true,
    translucant: false,
    liquid: false,
  },
  dirt: {
    breakTime: 1,
    tool: "shovel",
    collision: true,
    translucant: false,
    liquid: false,
  },
  stone: {
    breakTime: 2,
    tool: "pickaxe",
    collision: true,
    translucant: false,
    liquid: false,
  },
  mapleLog: {
    breakTime: 1,
    tool: "axe",
    collision: true,
    translucant: false,
    liquid: false,
  },
  mapleLeaf: {
    breakTime: 0.5,
    tool: "axe/hoe/sheers",
    collision: false,
    translucant: true,
    liquid: false,
  },
};
function drawBlock(type, x, y) {
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
  } else if (type === "sugiliteBlock") {
    ctx.drawImage(textures.sugiliteBlock, getCanvasX(x), getCanvasY(y), 75, 75);
  }
  blocks[`${x},${y}`] = type;
}
function createTree(type, x, y, length) {
  if (type === "maple" && length == "Long") {
    drawBlock("mapleLog", x, y);
    drawBlock("mapleLog", x, y - 1);
    drawBlock("mapleLog", x, y - 2);
    drawBlock("mapleLog", x, y - 3);
    drawBlock("mapleLog", x, y - 4);
    drawBlock("mapleLeaf", x - 1, y - 4);
    drawBlock("mapleLeaf", x, y - 4);
    drawBlock("mapleLeaf", x + 1, y - 4);
    drawBlock("mapleLeaf", x - 1, y - 5);
    drawBlock("mapleLeaf", x, y - 5);
    drawBlock("mapleLeaf", x + 1, y - 5);
    drawBlock("mapleLeaf", x - 1, y - 3);
    drawBlock("mapleLeaf", x + 1, y - 3);
    drawBlock("mapleLeaf", x - 2, y - 4);
    drawBlock("mapleLeaf", x + 2, y - 4);
    drawBlock("mapleLeaf", x - 2, y - 3);
  } else if (type === "maple" && length == "Short") {
    drawBlock("mapleLog", x, y);
    drawBlock("mapleLog", x, y - 1);
    drawBlock("mapleLog", x, y - 2);
    drawBlock("mapleLeaf", x - 1, y - 2);
    drawBlock("mapleLeaf", x, y - 3);
    drawBlock("mapleLeaf", x, y - 4);
    drawBlock("mapleLeaf", x + 1, y - 4);
    drawBlock("mapleLeaf", x - 1, y - 4);
    drawBlock("mapleLeaf", x + 1, y - 3);
    drawBlock("mapleLeaf", x + 2, y - 3);
    drawBlock("mapleLeaf", x - 1, y - 3);
    drawBlock("mapleLeaf", x - 2, y - 3);
    drawBlock("mapleLeaf", x + 1, y - 2);
    drawBlock("mapleLeaf", x + 2, y - 2);
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
  drawBlock("dirt", -2, 10);
  drawBlock("dirt", 4, 10);
  drawBlock("sugiliteBlock", 3, 10);
  drawBlock("stone", 4, 11);
  createTree("maple", 5, 8, "Long");
  createTree("maple", 11, 7, "Short");

 
}

function procedrallyGenerateWorld(seed) {

  // Config
  const worldWidth = 2000;
  const chunkSize = 16;
  const seaLevel = 0;
  const maxHeight = 55;
  const minHeight = -50;

  // Check if seed is valid
  if (seed === undefined || typeof seed !== "number") {
    seed = Math.random() * 10000;
  } else if (seed > 10000 || seed < 0) {
    seed = Math.random() * 10000;
  }
 // Create Chunks

const randomNumber = new Math.seedrandom(seed);
console.log(randomNumber());

}

async function init() {
  textures.grass = await loadTexture("grass");
  textures.dirt = await loadTexture("dirt");
  textures.stone = await loadTexture("stone");
  textures.mapleLog = await loadTexture("mapleLog");
  textures.mapleLeaf = await loadTexture("mapleLeaf");
  textures.sugiliteBlock = await loadTexture("sugiliteBlock");
  draw();
  procedrallyGenerateWorld(676767);
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
