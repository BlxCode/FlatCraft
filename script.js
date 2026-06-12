// Resize the game canvas to match the browser window size.
function resize() {
  let canvas = document.getElementById("gameCanvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// Popup UI elements for showing temporary error/messages.
const backdropUI = document.getElementById("backdrop");
const errorDiv = document.getElementById("popup");

// Close button hides the popup and its backdrop.
document.getElementById("popupClose").addEventListener("click", () => {
  errorDiv.hidden = true;
  backdropUI.hidden = true;
});

// Display an on-screen error message for a duration based on its length.
function displayError(msg) {
  backdropUI.hidden = false;
  errorDiv.hidden = false;

  document.getElementById("popupContent").innerText = msg;
  console.log(document.getElementById("popupContent").innerText.length * 0.07 * 1000);
  setTimeout(() => {
    errorDiv.hidden = true;
    backdropUI.hidden = true;
  }, document.getElementById("popupContent").innerText.length * 0.07 * 1000);
}

displayError("This is a test error message. This is only for testing purposes and will be removed in the future.");

// Camera position in world coordinates.
let cameraX = 0;
let cameraY = 0;

// Tracks the current pressed keys for camera movement and controls.
var keysPressed = {};

// Convert world X coordinate into canvas pixel X coordinate.
function getCanvasX(x) {
  return (x - cameraX) * 75;
}

// Convert world Y coordinate into canvas pixel Y coordinate.
function getCanvasY(y) {
  return (y - cameraY) * 75;
}
resize();
window.addEventListener("resize", resize);

let ctx = document.getElementById("gameCanvas").getContext("2d");
ctx.imageSmoothingEnabled = false;

// Loaded texture images indexed by block name.
const textures = {};

// Load a texture image from the assets folder.
function loadTexture(name) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = `./assets/textures/${name}.png`;
  });
}

// Store current world block placement by grid coordinate string.
var blocks = {};

// Biome metadata used for world generation and environment rules.
var biomeMetaData = {
  plains: {
    humidity: 0.5,
    temperature: 0.5,
  },
  mapleForest: {
    humidity: 0.7,
    temperature: 0.5,
  },
  desert: {
    humidity: 0.2,
    temperature: 0.8,
  },
};

// Basic chunk storage for generated terrain with biome assignment.
var chunks = {
  "0": {
    biome: "plains",
    chunkEdited: false,
  },
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

// Draw a block sprite at the given world grid position.
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

  // Record the block in the world data using a coordinate key.
  blocks[`${x},${y}`] = type;
}

// Create a simple maple tree from log and leaf blocks.
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
  // Update camera position from WASD input.
  if (keysPressed["w"]) cameraY -= 0.05;
  if (keysPressed["a"]) cameraX -= 0.05;
  if (keysPressed["s"]) cameraY += 0.05;
  if (keysPressed["d"]) cameraX += 0.05;

  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Draw the current world blocks and objects.
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

// Generate the world using a seeded random generator.
function procedrallyGenerateWorld(seed) {
  // Config values for world generation.
  const worldWidth = 2000;
  const chunkSize = 16;
  const seaLevel = 0;
  const maxHeight = 55;
  const minHeight = -50;

  // Validate the seed and fall back to a random one if needed.
  if (seed === undefined || typeof seed !== "number") {
    seed = Math.random() * 10000;
  } else if (seed > 10000 || seed < 0) {
    seed = Math.random() * 10000;
  }

  // Create chunks and populate the world here in the future.
  const randomNumber = new Math.seedrandom(seed);
  console.log(randomNumber());
}

// Initialize textures and start the draw loop.
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
  // Run the draw function at 60 frames per second.
  setInterval(draw, 1000 / 60);
});

function switchSlots(slot){
  let slotElement = document.getElementById("slot"+slot);
  for (let i = 1; i < 9; i ++){
    document.getElementById("slot"+i).className= "slot"
  }
  slotElement.className+="slotHover"
}

document.addEventListener("keydown", (event) => {
  // Mark key as pressed for continuous movement.
  keysPressed[event.key] = true;
});

document.addEventListener("keyup", (event) => {
  // Remove the key press state when released.
  delete keysPressed[event.key];

  // Apply a small additional camera shift on key release.
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
  if (event.key == '1'){

  }
});



