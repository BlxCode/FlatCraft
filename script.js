// Sorry that everything is in one file lol
// still too lazy to import and export variables and stuff like that
// this is also the first time i've ever used littleJS
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
  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    )
  ) {
    // true for mobile device

    alert("FlatCraft is not designed for mobile devices!");
  }
  document.getElementById("loadingScreenWrapper").className = "popCloseHide";
  enterGameButtonLoadingScreenWrapper.className = "popAnim";
  loadingScreen.className = "loadingScreenChangeColor";
}
window.addEventListener("load", () => {
  startInit();
});
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

// SETTINGS UI
function dgeID(id) {
  return document.getElementById(id);
}

const settingsNavItemGeneral = dgeID("settingsNavItemGeneral");
const settingsNavItemGraphics = dgeID("settingsNavItemGraphics");
const settingsNavItemSkin = dgeID("settingsNavItemSkin");
const settingsGeneral = dgeID("settingsGeneral");
const settingsGraphics = dgeID("settingsGraphics");
const settingsSkin = dgeID("settingsSkin");
let currentSettingsTab = settingsNavItemGeneral;

function switchSettingsTab(newTab, newTabValue) {
  currentSettingsTab.classList.remove("settingsNavItemSelected");
  newTab.classList.add("settingsNavItemSelected");
  currentSettingsTab = newTab;

  if (newTabValue === "General") {
    settingsGeneral.hidden = false;
    settingsGraphics.hidden = true;
    settingsSkin.hidden = true;
  } else if (newTabValue === "Graphics") {
    settingsGeneral.hidden = true;
    settingsGraphics.hidden = false;
    settingsSkin.hidden = true;
  } else if (newTabValue === "Skin") {
    settingsGeneral.hidden = true;
    settingsGraphics.hidden = true;
    settingsSkin.hidden = false;
  }
}

settingsNavItemGeneral.addEventListener("click", () => {
  switchSettingsTab(settingsNavItemGeneral, "General");
});
settingsNavItemGraphics.addEventListener("click", () => {
  switchSettingsTab(settingsNavItemGraphics, "Graphics");
});
settingsNavItemSkin.addEventListener("click", () => {
  switchSettingsTab(settingsNavItemSkin, "Skin");
});
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
// create skin image thing

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
let playerTextureImageSrc;
let playerTexture;
let playerImage = new Image();
let player;
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

    console.log(blocks);
    paused = false;
    if (event.detail.worldType == "sandbox") {
      procedurallyGenerateWorld(Number(event.detail.worldSeed));
    } else if (event.detail.worldType == "flat") {
      createFlatWorld(Number(event.detail.worldSeed));
    }
  });

  await new Promise((resolve) => {
    playerImage.onload = resolve;

    playerImage.src =
      localStorage.getItem("skinData") ||
      "data:image/png;base64,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";
  });
  playerTexture = new TextureInfo(playerImage);

  let spriteSheet = {
    idle: new TileInfo(vec2(0, 0), vec2(20, 22), playerTexture),
    walk1: new TileInfo(vec2(0, 22), vec2(20, 22), playerTexture),
    walk2: new TileInfo(vec2(0, 44), vec2(20, 22), playerTexture),
    walk3: new TileInfo(vec2(0, 66), vec2(20, 22), playerTexture),
    walk4: new TileInfo(vec2(0, 88), vec2(20, 22), playerTexture),
    walk5: new TileInfo(vec2(0, 110), vec2(20, 22), playerTexture),
    walk6: new TileInfo(vec2(0, 132), vec2(20, 22), playerTexture),
    walk7: new TileInfo(vec2(0, 154), vec2(20, 22), playerTexture),
    crouch: new TileInfo(vec2(0, 176), vec2(20, 22), playerTexture),
    crouchWalk: new TileInfo(vec2(0, 198), vec2(20, 22), playerTexture),
    raise1: new TileInfo(vec2(0, 220), vec2(20, 22), playerTexture),
    raise2: new TileInfo(vec2(0, 242), vec2(20, 22), playerTexture),
    break1: new TileInfo(vec2(0, 264), vec2(20, 22), playerTexture),
    break2: new TileInfo(vec2(0, 286), vec2(20, 22), playerTexture),
    fall: new TileInfo(vec2(0, 308), vec2(20, 22), playerTexture),
  };

  player = {
    username: "Guest",
    coords: vec2(0, -6.62 * 85),

    animation: "idle",
    directionPositive: false,
    animationLocation: vec2(0, 0),

    setSkin: (newSkin) => {
      player.skin = newSkin;
      playerTextureImageSrc = newSkin;
      localStorage.setItem("skinData", newSkin);
      playerImage.src = playerTextureImageSrc;
      playerTexture = new TextureInfo(playerImage);
    },
    getFeetCoords: () => {
      return vec2(
        Math.floor(player.coords.x / 85),
        Math.floor(player.coords.add(vec2(0, -3.5)).y / 85 + 6.62),
      );
    },
    isStandingOnBlock: () => {
      return (
        blocks[player.getFeetCoords().x + "," + player.getFeetCoords().y] ||
        false
      );
    },
    setUsername: (newUsername) => {
      player.username = newUsername;
    },

    drawPlayer: () => {
      drawTile(
        player.coords,
        vec2(7),
        spriteSheet[player.animation],
        WHITE,
        0,
        player.directionPositive,
      );
    },
    calculatePlayerPhysics: () => {
      // check if standing on block
      if (player.isStandingOnBlock()) {
      } else if (!player.isStandingOnBlock()) {
        player.animation = "falling";
      }
    },
    cameraToPlayer: () => {
      cameraPos = player.coords;
    },
  };
  player.cameraToPlayer();
  console.log("Game engine initialized.");
}

function gameUpdate() {}
function gameUpdatePost() {}

function gameRender() {
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

  player.drawPlayer();
  renderBlocks();

  if (keyIsDown("KeyW")) {
    player.coords = player.coords.add(vec2(0, -1));
  }
  if (keyIsDown("KeyS")) {
    player.coords = player.coords.add(vec2(0, 1));
  }
  if (keyIsDown("KeyA")) {
    player.coords = player.coords.add(vec2(-1, 0));
    player.directionPositive = false;
  }
  if (keyIsDown("KeyD")) {
    player.coords = player.coords.add(vec2(1, 0));
    player.directionPositive = true;
  }
  player.cameraToPlayer();
}

function destroyBlock(x, y) {
  if (blocks[`${x},${y}`]) {
    delete blocks[`${x},${y}`];
  }
}
function createBlock(x, y, blockType) {
  // check if block already exist
  if (blocks[`${x},${y}`]) {
    console.log(
      "Tried to create a " +
        blockType +
        " that already existed at engine coords: vec2(" +
        String(x) +
        "," +
        String(y) +
        ")",
    );
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
    color: "#2EB53A",
  },
  dirt: {
    breakTime: 1,
    tool: "shovel",
    collision: true,
    translucent: false,
    liquid: false,
    color: "#593F2D",
  },
  stone: {
    breakTime: 2,
    tool: "pickaxe",
    collision: true,
    translucent: false,
    liquid: false,
    color: "#545454",
  },
  mapleLog: {
    breakTime: 1,
    tool: "axe",
    collision: true,
    translucent: false,
    liquid: false,
    color: "#634A2E",
  },
  mapleLeaf: {
    breakTime: 0.5,
    tool: "axe/hoe/sheers",
    collision: false,
    translucent: true,
    liquid: false,
    color: "#48834C",
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
    createBlock(i, 4, "bedrock");
  }
  console.log(blocks);
}

// Initialize textures and start the draw loop.

engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender);
setInputPreventDefault(false);
debugKey = "Escape";
