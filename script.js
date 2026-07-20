"use strict";
import { createNoise2D } from "https://cdn.jsdelivr.net/npm/simplex-noise/+esm";
const loadingScreen = document.getElementById("loadingScreen");
const loadingTitle = document.getElementById("loadingTitle");
const loadingProgressBar = document.getElementById("loadingProgress");
const mainMenuAudio = new Audio("./assets/music/menu.wav");
const errorDiv = document.getElementById("popup");

const enterGameButtonLoadingScreenWrapper = document.getElementById(
  "enterGameButtonLoadingScreenWrapper",
);

var currentPopup = null;
const errorBackdrop = document.getElementById("errorBackdrop");
const worldMenu = document.getElementById("worldSelect");
const worldCreateMenu = document.getElementById("worldCreate");
let paused = true;
mainMenuAudio.loop = true;
const events = {};
var dotsInLoadingTitle = 3;
var dotsDirectionMore = true;

/*
  _   _               ___     _            __             
 | | | |___ ___ _ _  |_ _|_ _| |_ ___ _ _ / _|__ _ __ ___ 
 | |_| (_-</ -_) '_|  | || ' \  _/ -_) '_|  _/ _` / _/ -_)
  \___//__/\___|_|   |___|_||_\__\___|_| |_| \__,_\__\___|
                                                           */
// Display an on-screen error message for a duration based on its length.
let errorTimeout = true;
function displayError(msg) {
  if (errorTimeout) {
    errorBackdrop.hidden = false;
    errorBackdrop.className = "";
    errorTimeout = false;
    currentPopup = errorDiv;
    document.getElementById("popupContent").innerText = msg;

    setTimeout(
      () => {
        errorTimeout = true;
        errorBackdrop.className = "hidden";
        errorDiv.className = "popCloseHide";
        errorBackdrop.hidden = true;
      },
      document.getElementById("popupContent").innerText.length * 0.07 * 1000,
    );
    errorDiv.className = "popAnim";
  }
}

setInterval(() => {
  if (dotsInLoadingTitle == 3 && !dotsDirectionMore) {
    loadingTitle.innerText = "Loading..";
    dotsInLoadingTitle = 2;
    dotsDirectionMore = false;
  } else if (dotsInLoadingTitle == 2 && !dotsDirectionMore) {
    loadingTitle.innerText = "Loading.";
    dotsInLoadingTitle = 1;
    dotsDirectionMore = false;
  } else if (dotsInLoadingTitle == 1 && !dotsDirectionMore) {
    loadingTitle.innerText = "Loading";
    dotsInLoadingTitle = 0;
    dotsDirectionMore = true;
  } else if (dotsInLoadingTitle == 0 && dotsDirectionMore) {
    loadingTitle.innerText = "Loading.";
    dotsInLoadingTitle = 1;
    dotsDirectionMore = true;
  } else if (dotsInLoadingTitle == 1 && dotsDirectionMore) {
    loadingTitle.innerText = "Loading..";
    dotsInLoadingTitle = 2;
    dotsDirectionMore = true;
  } else if (dotsInLoadingTitle == 2 && dotsDirectionMore) {
    loadingTitle.innerText = "Loading...";
    dotsInLoadingTitle = 3;
    dotsDirectionMore = true;
  } else if (dotsInLoadingTitle == 3 && dotsDirectionMore) {
    loadingTitle.innerText = "Loading...";
    dotsInLoadingTitle = 3;
    dotsDirectionMore = false;
  }
}, 407);

var progressBar = setInterval(() => {
  let progress = Number(loadingProgressBar.ariaValueNow);

  if (progress > 75) {
    progress = 90;
  } else {
    progress += Math.floor(Math.random() * 17) + 13;
    progress = Math.min(progress, 90);
  }

  loadingProgressBar.ariaValueNow = progress;
  loadingProgressBar.style.width = progress + "%";
}, 1000);

//initialized game
async function startInit() {
  clearInterval(progressBar);

  loadingProgressBar.ariaValueNow = 100;
  loadingProgressBar.style.width = "100%";

  await new Promise((r) => setTimeout(r, 3400));

  document.getElementById("loadingScreenWrapper").className = "popCloseHide";
  enterGameButtonLoadingScreenWrapper.className = "popAnim";
  loadingScreen.className = "loadingScreenChangeColor";
}

startInit();

// MAIN MENU
enterGameButtonLoadingScreenWrapper.addEventListener("click", () => {
  mainMenuAudio.play();
  loadingScreen.className = "popCloseHide";
});
// TODO: Fix scrolling
const backdropUI = document.getElementById("backdrop");
const buttonOpenCredits = document.getElementById("mainMenuButtonCredits");
document.getElementById("credits").getBoundingClientRect();
buttonOpenCredits.addEventListener("click", () => {
  document.getElementById("credits").className = "popAnim";
  paused = true;
  backdropUI.hidden = false;
  currentPopup = document.getElementById("credits");
});

const buttonCloseCredits = document.getElementById("buttonCloseCredits");
buttonCloseCredits.addEventListener("click", () => {
  document.getElementById("credits").className = "popCloseHide";
  paused = false;
  backdropUI.hidden = true;
  currentPopup = null;
});

const buttonOpenSettings = document.getElementById("mainMenuButtonSettings");
buttonOpenSettings.addEventListener("click", () => {
  document.getElementById("settings").className = "popAnim";
  paused = true;
  backdropUI.hidden = false;
  currentPopup = document.getElementById("settings");
});

const buttonCloseSettings = document.getElementById("buttonCloseSettings");
buttonCloseSettings.addEventListener("click", () => {
  document.getElementById("settings").className = "popCloseHide";

  paused = false;
  backdropUI.hidden = true;
  currentPopup = null;
});

const buttonPlayGame = document.getElementById("mainMenuButtonPlay");
buttonPlayGame.addEventListener("click", () => {
  worldMenu.className = "popAnim";
  backdropUI.hidden = false;
  currentPopup = worldMenu;
});

const buttonCloseWorlds = document.getElementById("buttonCloseWorlds");
buttonCloseWorlds.addEventListener("click", () => {
  worldMenu.className = "popCloseHide";
  backdropUI.hidden = true;
  currentPopup = null;
});

const buttonsOpenWorldAndPlay =
  document.getElementsByClassName("worldPlayButton");
const buttonsEditWorld = document.getElementsByClassName("worldEditButton");
const buttonsDeleteWorld = document.getElementsByClassName("worldDelButton");
const createNewWorld = document.getElementsByClassName("worldCreateButton")[0];
const buttonCloseCreateWorldMenu = document.getElementById(
  "buttonCloseCreateWorldMenu",
);
const submitNewWorldForm = document.getElementById("submitCreateWorldForm");
buttonCloseCreateWorldMenu.addEventListener("click", () => {
  worldCreateMenu.className = "popCloseHide";
  worldMenu.className = "popAnim text-center";
  currentPopup = worldMenu;
});

createNewWorld.addEventListener("click", () => {
  worldMenu.className = "popCloseHide text-center";
  worldCreateMenu.className = "popAnim";
  currentPopup = worldCreateMenu;
});
var createWorldInfo = {};
submitNewWorldForm.addEventListener("click", () => {
  const allInputs = document.getElementsByClassName("worldCreateForm");
  const worldNameInput = document.getElementById("createWorld-WorldName");
  const worldDescInput = document.getElementById("createWorld-WorldDesc");
  const worldSeedInput = document.getElementById("createWorld-WorldSeed");
  const worldTypeInput = document.querySelector(
    'input[name="radioWorldType"]:checked',
  );
  const worldCreateSubmitButton = document.getElementById(
    "submitCreateWorldForm",
  );
  let isFilled = {
    worldNameInput: worldNameInput.value.trim() !== "",
    worldDescInput: worldDescInput.value.trim() !== "",
    worldSeedInput: worldSeedInput.value.trim() !== "",
  };
  const allFilled =
    worldNameInput.value && worldDescInput.value && worldSeedInput.value;

  if (!allFilled) {
    displayError("Fill Everything!");
  } else if (allFilled) {
    createWorldInfo = {
      worldName: worldNameInput.value,
      worldDesc: worldDescInput.value,
      worldSeed: worldSeedInput.value,
      worldType: worldTypeInput.value,
    };
    const eventCreateWorld = new CustomEvent("createWorld", {
      detail: createWorldInfo,
    });

    window.dispatchEvent(eventCreateWorld);
    console.log("Dispatched createWorld event with data:", createWorldInfo);
  }
});

backdropUI.addEventListener("click", () => {
  currentPopup.className = "popCloseHide";
  currentPopup = null;
  backdropUI.hidden = true;
});

// Resize the game canvas to match the browser window size.

// Popup UI elements for showing temporary error/messages.

// Close button hides the popup and its backdrop.
document.getElementById("popupClose").addEventListener("click", () => {
  errorDiv.className = "popCloseHide";
  errorBackdrop.hidden = true;
});

function switchSlots(slot) {
  let slotElement = document.getElementById("slot" + slot);
  for (let i = 1; i < 9; i++) {
    document.getElementById("slot" + i).className = "slot";
  }
  slotElement.className += "slotHover";
}
/*
                                                                                     
▗▄▄▖ ▗▄▖                             ▄▄                                 █            
▐▛▀▜▖▝▜▌                            █▀▀▌                          ▐▌    ▀            
▐▌ ▐▌ ▐▌   ▟██▖▝█ █▌ ▟█▙  █▟█▌     ▐▌    ▟█▙ ▐▙██▖ ▟█▙  █▟█▌ ▟██▖▐███  ██   ▟█▙ ▐▙██▖
▐██▛  ▐▌   ▘▄▟▌ █▖█ ▐▙▄▟▌ █▘       ▐▌▗▄▖▐▙▄▟▌▐▛ ▐▌▐▙▄▟▌ █▘   ▘▄▟▌ ▐▌    █  ▐▛ ▜▌▐▛ ▐▌
▐▌    ▐▌  ▗█▀▜▌ ▐█▛ ▐▛▀▀▘ █        ▐▌▝▜▌▐▛▀▀▘▐▌ ▐▌▐▛▀▀▘ █   ▗█▀▜▌ ▐▌    █  ▐▌ ▐▌▐▌ ▐▌
▐▌    ▐▙▄ ▐▙▄█▌  █▌ ▝█▄▄▌ █         █▄▟▌▝█▄▄▌▐▌ ▐▌▝█▄▄▌ █   ▐▙▄█▌ ▐▙▄ ▗▄█▄▖▝█▄█▘▐▌ ▐▌
▝▘     ▀▀  ▀▀▝▘  █   ▝▀▀  ▀          ▀▀  ▝▀▀ ▝▘ ▝▘ ▝▀▀  ▀    ▀▀▝▘  ▀▀ ▝▀▀▀▘ ▝▀▘ ▝▘ ▝▘
                █▌                                                                   
                                                                                     */
let spriteSheet;

let player = {
  username: "Guest",
  coords: vec2(0, 0),
  skin: "TODO:FIX",
  set changeUsername(newUsername) {
    this.username = newUsername;
  },
  set animate(animationName){
    const spriteSheetLocations = {
      idle : vec2(0,0),
      walk1:vec2(0,-22)
    }
  }
};
/*
   ___                  ___             _         _           
  / __|__ _ _ __  ___  | _ \___ _ _  __| |___ _ _(_)_ _  __ _ 
 | (_ / _` | '  \/ -_) |   / -_) ' \/ _` / -_) '_| | ' \/ _` |
  \___\__,_|_|_|_\___| |_|_\___|_||_\__,_\___|_| |_|_||_\__, |
                                                        |___/ 

*/
// Remember that ALL vec2 coords should have BOTH parameters multiplied by 85

let texture = {};
function loadImage(name) {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      texture[name] = img;
      resolve(img);
    };

    img.onerror = reject;

    img.src = "./assets/textures/" + name + ".png";
  });
}
async function loadAllImages() {
  const textureNames = [
    "acaciaLog",
    "cedarLog",
    "coalBlock",
    "coalOre",
    "copperBlock",
    "copperOre",
    "diamondBlock",
    "diamondOre",
    "dirt",
    "emeraldBlock",
    "emeraldOre",
    "goldBlock",
    "goldOre",
    "grass",
    "ironBlock",
    "ironOre",
    "jungleLog",
    "mapleLeaf",
    "mapleLog",
    "poplarLog",
    "stone",
    "sugiliteBlock",
    "sugiliteOre",
    "bedrock",
  ];

  for (const name of textureNames) {
    await loadImage(name);
  }
  console.log(
    "Loaded all textures! Proof: " +
      texture["grass"] +
      "(it should return objectObject or something like that)",
  );
}
let ctx;

async function gameInit() {
  combineCanvases();

  ctx = mainCanvas.getContext("2d");
  canvasPixelated = true;
  console.log("Game engine initializing...");

  console.log(mainCanvas);
  mainCanvas.style.zIndex = 0;
  await loadAllImages();
  console.log(texture["grass"]);
  window.addEventListener("createWorld", (event) => {
    console.log("Event received:", event.detail);
    const data = event.detail;

    backdropUI.click();
    mainMenuAudio.pause();
    document.getElementById("mainMenu").className = "popCloseHide";

    cameraPos = vec2(0, 0);
    console.log(blocks);
    paused = false;
    if (event.detail.worldType == "sandbox") {
      procedurallyGenerateWorld(Number(event.detail.worldSeed));
    } else if (event.detail.worldType == "flat") {
      createFlatWorld(Number(event.detail.worldSeed));
    }
  });

  console.log("Game engine initialized.");
}

function gameUpdate() {}
function gameUpdatePost() {}

function gameRender() {
  if (keyIsDown("KeyW")) {
    cameraPos = cameraPos.add(vec2(0, -10));
  }
  if (keyIsDown("KeyS")) {
    cameraPos = cameraPos.add(vec2(0, 10));
  }
  if (keyIsDown("KeyA")) {
    cameraPos = cameraPos.add(vec2(-10, 0));
  }
  if (keyIsDown("KeyD")) {
    cameraPos = cameraPos.add(vec2(10, 0));
  }

  const renderBlocks = () => {
    const viewWidthBlocks = Math.ceil(window.innerWidth / 85);
    const viewHeightBlocks = Math.ceil(window.innerHeight / 90);
    const startBlockX = Math.floor(cameraPos.x / 85);
    const startBlockY = Math.floor(cameraPos.y / 85);
    const endBlockX = Math.floor((cameraPos.x + viewWidthBlocks * 85) / 85);
    const endBlockY = Math.floor((cameraPos.y + viewHeightBlocks * 85) / 85);

    for (let blockX = startBlockX; blockX <= endBlockX; blockX++) {
      for (let blockY = startBlockY; blockY <= endBlockY; blockY++) {
        const blockKey = `${blockX},${blockY}`;

        if (blocks[blockKey]) {
          drawImageColor(
            ctx,
            texture[blocks[blockKey]],
            0,
            0,
            8,
            8,
            blockX * 85 - cameraPos.x,
            blockY * 85 - cameraPos.y,
            85,
            85,
            new Color(1, 1, 1, 1),
          );
        }
      }
    }
  };

  renderBlocks();
}
function destroyBlock(x, y) {
  if (blocks[`${x},${y}`]) {
    delete blocks[`${x},${y}`];
  }
}
function createBlock(x, y, blockType) {
  // check if block already exist
  if (blocks[`${x},${y}`]) {
    return;
  } else {
    return (blocks[`${x},${y}`] = blockType);
  }
}

// Store current world block placement by grid coordinate string.
var blocks = {};

// Biome metadata used for world generation and environment rules.

// Basic chunk storage for generated terrain with biome assignment.
/*                                                                                
▄   ▄          ▗▄▖     ▗▖       ▄▄                                 █            
█   █          ▝▜▌     ▐▌      █▀▀▌                          ▐▌    ▀            
▜▖█▗▛ ▟█▙  █▟█▌ ▐▌   ▟█▟▌     ▐▌    ▟█▙ ▐▙██▖ ▟█▙  █▟█▌ ▟██▖▐███  ██   ▟█▙ ▐▙██▖
▐▌█▐▌▐▛ ▜▌ █▘   ▐▌  ▐▛ ▜▌     ▐▌▗▄▖▐▙▄▟▌▐▛ ▐▌▐▙▄▟▌ █▘   ▘▄▟▌ ▐▌    █  ▐▛ ▜▌▐▛ ▐▌
▐█▀█▌▐▌ ▐▌ █    ▐▌  ▐▌ ▐▌     ▐▌▝▜▌▐▛▀▀▘▐▌ ▐▌▐▛▀▀▘ █   ▗█▀▜▌ ▐▌    █  ▐▌ ▐▌▐▌ ▐▌
▐█ █▌▝█▄█▘ █    ▐▙▄ ▝█▄█▌      █▄▟▌▝█▄▄▌▐▌ ▐▌▝█▄▄▌ █   ▐▙▄█▌ ▐▙▄ ▗▄█▄▖▝█▄█▘▐▌ ▐▌
▝▀ ▀▘ ▝▀▘  ▀     ▀▀  ▝▀▝▘       ▀▀  ▝▀▀ ▝▘ ▝▘ ▝▀▀  ▀    ▀▀▝▘  ▀▀ ▝▀▀▀▘ ▝▀▘ ▝▘ ▝▘
                                                                                
                                                                                */
var chunks = {
  0: {
    biome: "plains",
    chunkEdited: false,
  },
};

var blockMetaData = {
  grass: {
    breakTime: 1,
    tool: "shovel",
    collision: true,
    translucent: false,
    liquid: false,
  },
  dirt: {
    breakTime: 1,
    tool: "shovel",
    collision: true,
    translucent: false,
    liquid: false,
  },
  stone: {
    breakTime: 2,
    tool: "pickaxe",
    collision: true,
    translucent: false,
    liquid: false,
  },
  mapleLog: {
    breakTime: 1,
    tool: "axe",
    collision: true,
    translucent: false,
    liquid: false,
  },
  mapleLeaf: {
    breakTime: 0.5,
    tool: "axe/hoe/sheers",
    collision: false,
    translucent: true,
    liquid: false,
  },
};
const biomes = ["plains", "mapleForest", "desert"];

function getBiome(number) {
  // Simplex noise returns values in [-1, 1]. Convert that to a humidity range [0, 1].
  const humidity = (number + 1) / 2;

  if (humidity >= 0.6) {
    return "mapleForest";
  }
  if (humidity >= 0.25) {
    return "plains";
  }
  return "desert";
}
const worldWidth = 2000;
const chunkSize = 16;
const seaLevel = 0;
const maxHeight = 90;
const minHeight = -50;
// Generate the world using a seeded random generator.
function procedurallyGenerateWorld(seed) {
  // Config values for world generation.

  // Validate the seed and fall back to a random one if needed.
  if (seed === undefined) {
    seed = Math.random() * 10000;
  }

  // Create chunks and populate the world here in the future.
  const rng = new alea(seed);
  const noise2D = createNoise2D(rng);

  // Set 5 biomes

  const biome1 = getBiome(noise2D(0, 0));
  console.log(biome1);
}

function createFlatWorld(seed) {
  for (let i = -2000; i < worldWidth; i++) {
    createBlock(i, 0, "grass");
    createBlock(i, 1, "dirt");
    createBlock(i, 2, "dirt");
    createBlock(i, 3, "dirt");
    createBlock(i, 4, "stone");
  }
  console.log(blocks);
}

// Initialize textures and start the draw loop.

engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender);
setInputPreventDefault(false);
debugKey = "Escape";
