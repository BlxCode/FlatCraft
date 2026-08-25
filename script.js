// Sorry that everything is in one file lol
// still too lazy to import and export variables and stuff like that
// this is also the first time i've ever used littleJS
"use strict";
// import { createNoise2D } from "https://cdn.jsdelivr.net/npm/simplex-noise/+esm";
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

let loadingTextAnim = setInterval(() => {
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
  clearInterval(loadingTextAnim);

  loadingProgressBar.ariaValueNow = 100;
  loadingProgressBar.style.width = "100%";

  await new Promise((r) => setTimeout(r, 3400));

  document.getElementById("loadingScreenWrapper").className = "popCloseHide";
  enterGameButtonLoadingScreenWrapper.className = "popAnim";
  loadingScreen.className = "loadingScreenChangeColor";
  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    )
  ) {
    // true for mobile device
    displayError(
      "FlatCraft is not designed for mobile devices! You WILL encounter rendering issues. Please ONLY play on a desktop or laptop computer with a display aspect ratio of 16:9.",
    );
  }
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

    document.dispatchEvent(eventCreateWorld);
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

// ui updates
/*                                                                                                    
                                                                                                    
                                                                                                    
 ██    ██   ██████             ██    ██                  ██                                         
 ██    ██   ██████             ██    ██                  ██              ██                         
 ██    ██     ██               ██    ██                  ██              ██                         
 ██    ██     ██               ██    ██  ██░███▒    ▒███░██   ▒████▓   ███████    ░████▒    ▒█████░ 
 ██    ██     ██               ██    ██  ███████▒  ▒███████   ██████▓  ███████   ░██████▒  ████████ 
 ██    ██     ██               ██    ██  ███  ███  ███  ███   █▒  ▒██    ██      ██▒  ▒██  ██▒  ░▒█ 
 ██    ██     ██               ██    ██  ██░  ░██  ██░  ░██    ▒█████    ██      ████████  █████▓░  
 ██    ██     ██               ██    ██  ██    ██  ██    ██  ░███████    ██      ████████  ░██████▒ 
 ██    ██     ██               ██    ██  ██░  ░██  ██░  ░██  ██▓░  ██    ██      ██           ░▒▓██ 
 ██▓  ▓██     ██               ██▓  ▓██  ███  ███  ███  ███  ██▒  ███    ██░     ███░  ▒█  █▒░  ▒██ 
 ▒██████▒   ██████             ▒██████▒  ███████▒  ▒███████  ████████    █████   ░███████  ████████ 
  ▒████▒    ██████              ▒████▒   ██░███▒    ▒███░██   ▓███░██    ░████    ░█████▒  ░▓████▓  
                                         ██                                                         
                                         ██                                                         
                                         ██                                                         
                                                                                                    */
let invenEvent = new Event("invenEvent");
let fpsWaitForUpdate = 0;
const invenAmt = document.getElementsByClassName("hotbarSlotAmt");
const invenImg = document.getElementsByClassName("hotbarSlotImg");
const hotbarSlot = document.getElementsByClassName("slot");
function renderInven() {
  for (let i = 0; i <= 8; i++) {
    if (player.inventory[i]) {
      if (player.inventory[i].amount == 0) {
        invenAmt[i].textContent = "";
        invenImg[i].src =
          "./assets/textures/" + player.inventory[i].item + ".png";
      } else {
        invenAmt[i].textContent = player.inventory[i].amount;
        invenImg[i].src =
          "./assets/textures/" + player.inventory[i].item + ".png";
      }
    }
  }
}
document.addEventListener("invenEvent", renderInven);

function gameUpdatePost() {
  function fps() {
    fpsWaitForUpdate++;
    if (fpsWaitForUpdate >= 60) {
      dgeID("fpsShower").innerText = "FPS: " + Math.round(averageFPS);
      fpsWaitForUpdate = 0;
    }
  }
  function numkeysHotbarChange() {
    if (keyIsDown("Digit1")) {
      player.changeHotbarSlot(0);
    } else if (keyIsDown("Digit2")) {
      player.changeHotbarSlot(1);
    } else if (keyIsDown("Digit3")) {
      player.changeHotbarSlot(2);
    } else if (keyIsDown("Digit4")) {
      player.changeHotbarSlot(3);
    } else if (keyIsDown("Digit5")) {
      player.changeHotbarSlot(4);
    } else if (keyIsDown("Digit6")) {
      player.changeHotbarSlot(5);
    } else if (keyIsDown("Digit7")) {
      player.changeHotbarSlot(6);
    } else if (keyIsDown("Digit8")) {
      player.changeHotbarSlot(7);
    } else if (keyIsDown("Digit9")) {
      player.changeHotbarSlot(8);
    }
  }
  function mouseWheelHotbarScroll() {
    const currentHotbarSlot = player.hotbarSlotHovered;
    let newHotbarSlot = mouseWheel + currentHotbarSlot;

    newHotbarSlot > 8 ? (newHotbarSlot = 0) : "why more";
    newHotbarSlot < 0 ? (newHotbarSlot = 8) : "why less";
    player.changeHotbarSlot(newHotbarSlot);
  }
  fps();
  numkeysHotbarChange();

  mouseWheelHotbarScroll();
}
/*
   ___                  ___             _         _           
  / __|__ _ _ __  ___  | _ \___ _ _  __| |___ _ _(_)_ _  __ _ 
 | (_ / _` | '  \/ -_) |   / -_) ' \/ _` / -_) '_| | ' \/ _` |
  \___\__,_|_|_|_\___| |_|_\___|_||_\__,_\___|_| |_|_||_\__, |
                                                        |___/ 

*/

// Remember that ALL vec2 coords should have BOTH parameters multiplied by 85
var blocks = {};
let texture = {};
function loadImage(name) {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      const textureInfo = new TextureInfo(img);

      texture[name] = new TileInfo(
        vec2(0, 0),
        vec2(8, 8), // or vec2(8, 8) if every block texture is 8×8
        textureInfo,
      );

      resolve();
    };

    img.onerror = reject;
    img.src = "./assets/textures/" + name + ".png";
  });
}
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
  "rickRoll",
  "hoverFar",
  "hoverClose",
  "air",
];
async function loadAllImages() {
  for (const name of textureNames) {
    await loadImage(name);
  }
  console.log(
    "Loaded all textures! Proof: " +
      texture["grass"] +
      "(it should return imageObject or something like that)",
  );
}
let ctx;
let playerTextureImageSrc;
let playerTexture;
let playerImage = new Image();
let player;
let blockBreakTexture = new Image();
let blockBreakingTexture;
let drops = {};

function getCollidableBlockTypeAt(x, y) {
  const blockType = blocks[`${x},${y}`];
  return blockType && blockMetaData[blockType]?.collision ? blockType : false;
}

function isCollidableBlockAt(x, y) {
  return !!getCollidableBlockTypeAt(x, y);
}
function drawRickAstleyAt(x, y, rot = 0) {
  drawTile(vec2(x, y), vec2(0.25), texture["rickRoll"], WHITE, rot);
}
class droppedItem {
  constructor(item, posX, posY) {
    this.pos = vec2(posX, posY + 0.2);
    this.animationPosYOffset = 0;
    this.item = item;
    this.timeDropped = 0;
    this.dropIndex;
    if (!drops[`${this.pos.x},${this.pos.y}`]) {
      drops[`${this.pos.x},${this.pos.y}`] = [];
    }
    drops[`${this.pos.x},${this.pos.y}`].push(this);
  }
  draw() {
    this.timeDropped += 0.02;
    if (this.timeDropped < 310) {
      if (
        !isCollidableBlockAt(
          Math.round(this.pos.x),
          Math.floor(this.pos.y + 0.21),
        )
      ) {
        let oldPos = this.pos;

        this.pos = this.pos.subtract(vec2(0, 0.04));
        this.animationPosYOffset = 0;
        // update coords
        if (drops[`${oldPos.x},${oldPos.y}`]) {
          if (drops[`${this.pos.x},${this.pos.y}`]) {
            let indexInDrawDrop =
              drops[`${oldPos.x},${oldPos.y}`].indexOf(this);

            drops[`${oldPos.x},${oldPos.y}`].splice(indexInDrawDrop, 1);

            drops[`${this.pos.x},${this.pos.y}`].push(this);
            if (drops[`${oldPos.x},${oldPos.y}`].length <= 0) {
              delete drops[`${oldPos.x},${oldPos.y}`];
            }
          } else {
            drops[`${this.pos.x},${this.pos.y}`] =
              drops[`${oldPos.x},${oldPos.y}`];
            delete drops[`${oldPos.x},${oldPos.y}`];
          }
        } else {
          console.table(drops);
          console.error(
            "drops got out of sync while trying to rename possibily while drop was falling, rare bug. happens because either, your computer is broken, or that you were dropping lots of things",
          );
        }
      } else if (
        isCollidableBlockAt(
          Math.round(this.pos.x),
          Math.floor(this.pos.y + 0.22),
        )
      ) {
        this.animationPosYOffset = Math.sin(this.timeDropped) * 0.065;
      }

      drawTile(
        vec2(this.pos.x, this.pos.y + this.animationPosYOffset),
        vec2(0.35),
        texture[this.item],
      );

      let elipsePosY = Math.round(this.pos.y * 100) / 100 - 0.44;

      elipsePosY = -90100011001000011;
      // find a block under
      for (
        let i = Math.floor(this.pos.y + 0.24);
        i > Math.floor(this.pos.y) - 12;
        i -= 1
      ) {
        if (isCollidableBlockAt(Math.round(this.pos.x), i)) {
          elipsePosY = i + 0.55;
          break;
        }
      }
      drawEllipse(
        vec2(Math.round(this.pos.x * 100) / 100, elipsePosY),
        vec2(0.34, 0.08),
        new Color(0.2, 0.2, 0.2, 0.5),
      );
    } else {
      this.destroy();
    }
  }
  destroy() {
    let index = drops[`${this.pos.x},${this.pos.y}`].indexOf(this);

    drops[`${this.pos.x},${this.pos.y}`].splice(index, 1);

    if (drops[`${this.pos.x},${this.pos.y}`].length <= 0) {
      delete drops[`${this.pos.x},${this.pos.y}`];
    }
  }
}
async function gameInit() {
  combineCanvases();
  gamepadsEnable = false;
  cameraScale = 85;
  cameraPos = vec2(0, 0);
  ctx = mainCanvas.getContext("2d");
  canvasPixelated = true;
  console.log("Game engine initializing...");

  console.log(mainCanvas);

  await loadAllImages();
  console.log(texture["grass"]);

  await new Promise((resolve) => {
    playerImage.onload = resolve;

    playerImage.src =
      localStorage.getItem("skinData") ||
      "data:image/png;base64,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";
  });
  await new Promise((resolve) => {
    blockBreakTexture.onload = resolve;

    blockBreakTexture.src = "./assets/misc/breakBlocks.png";
  });
  playerTexture = new TextureInfo(playerImage);

  let spriteSheet = {
    idle: new TileInfo(vec2(0, 0), vec2(20, 22), playerTexture, 0, 0.1),
    walk1: new TileInfo(vec2(0, 22), vec2(20, 22), playerTexture, 0, 0.1),
    walk2: new TileInfo(vec2(0, 44), vec2(20, 22), playerTexture, 0, 0.1),
    walk3: new TileInfo(vec2(0, 66), vec2(20, 22), playerTexture, 0, 0.1),
    walk4: new TileInfo(vec2(0, 88), vec2(20, 22), playerTexture, 0, 0.1),
    walk5: new TileInfo(vec2(0, 110), vec2(20, 22), playerTexture, 0, 0.1),
    walk6: new TileInfo(vec2(0, 132), vec2(20, 22), playerTexture, 0, 0.1),
    crouch: new TileInfo(vec2(0, 154), vec2(20, 22), playerTexture, 0, 0.1),
    crouchWalk: new TileInfo(vec2(0, 176), vec2(20, 22), playerTexture, 0, 0.1),
    raise1: new TileInfo(vec2(0, 198), vec2(20, 22), playerTexture, 0, 0.1),
    raise2: new TileInfo(vec2(0, 220), vec2(20, 22), playerTexture, 0, 0.1),
    break1: new TileInfo(vec2(0, 242), vec2(20, 22), playerTexture, 0, 0.1),
    break2: new TileInfo(vec2(0, 264), vec2(20, 22), playerTexture, 0, 0.1),
    fall: new TileInfo(vec2(0, 286), vec2(20, 22), playerTexture, 0, 0.1),
    testLol: texture["grass"],
  };
  blockBreakTexture = new TextureInfo(blockBreakTexture);
  blockBreakingTexture = {
    frame0: new TileInfo(vec2(0, 0), vec2(8, 8), blockBreakTexture, 0, 0.05),
    frame1: new TileInfo(vec2(0, 8), vec2(8, 8), blockBreakTexture, 0, 0.05),
    frame2: new TileInfo(vec2(0, 16), vec2(8, 8), blockBreakTexture, 0, 0.05),
    frame3: new TileInfo(vec2(0, 24), vec2(8, 8), blockBreakTexture, 0, 0.05),
    frame4: new TileInfo(vec2(0, 32), vec2(8, 8), blockBreakTexture, 0, 0.05),
    frame5: new TileInfo(vec2(0, 40), vec2(8, 8), blockBreakTexture, 0, 0.05),
    frame6: new TileInfo(vec2(0, 48), vec2(8, 8), blockBreakTexture, 0, 0.05),
  };

  /*
 ███████████  ████                                                ███████    █████          ███                     █████   
▒▒███▒▒▒▒▒███▒▒███                                              ███▒▒▒▒▒███ ▒▒███          ▒▒▒                     ▒▒███    
 ▒███    ▒███ ▒███   ██████   █████ ████  ██████  ████████     ███     ▒▒███ ▒███████      █████  ██████   ██████  ███████  
 ▒██████████  ▒███  ▒▒▒▒▒███ ▒▒███ ▒███  ███▒▒███▒▒███▒▒███   ▒███      ▒███ ▒███▒▒███    ▒▒███  ███▒▒███ ███▒▒███▒▒▒███▒   
 ▒███▒▒▒▒▒▒   ▒███   ███████  ▒███ ▒███ ▒███████  ▒███ ▒▒▒    ▒███      ▒███ ▒███ ▒███     ▒███ ▒███████ ▒███ ▒▒▒   ▒███    
 ▒███         ▒███  ███▒▒███  ▒███ ▒███ ▒███▒▒▒   ▒███        ▒▒███     ███  ▒███ ▒███     ▒███ ▒███▒▒▒  ▒███  ███  ▒███ ███
 █████        █████▒▒████████ ▒▒███████ ▒▒██████  █████        ▒▒▒███████▒   ████████      ▒███ ▒▒██████ ▒▒██████   ▒▒█████ 
▒▒▒▒▒        ▒▒▒▒▒  ▒▒▒▒▒▒▒▒   ▒▒▒▒▒███  ▒▒▒▒▒▒  ▒▒▒▒▒           ▒▒▒▒▒▒▒    ▒▒▒▒▒▒▒▒       ▒███  ▒▒▒▒▒▒   ▒▒▒▒▒▒     ▒▒▒▒▒  
                               ███ ▒███                                                ███ ▒███                             
                              ▒▒██████                                                ▒▒██████                              
                               ▒▒▒▒▒▒                                                  ▒▒▒▒▒▒                               
*/

  player = {
    username: "Guest",
    jumping: false,
    jumpFrame: 1,
    coords: vec2(0, 5),
    isFalling: true,
    momentum: 0,
    fallMultiplier: 1,
    jumpMultiplier: 1,
    crouching: false,
    isBreakingBlock: false,
    canFly: false,
    isWalking: false,
    animation: "idle",
    directionPositive: false,
    animationLocation: vec2(0, 0),
    animationBreakFrame: 0,
    animationWalkingFrame: 1,
    raisedArms: false,
    animationChangeTimer: 0,
    lowerArms: false,
    hotbarSlotHovered: 0,
    handItemAnimIndex: {
      idle: vec2(0.4, 0.05),
      walk: vec2(0.4, 0.2),
      fall: vec2(0.45, 1.55),
      raise: vec2(0.85, 0.25),
      break2: vec2(0.75, 1.25),
      break1: vec2(0.95, 1.25),
      crouch: vec2(0.4, 0.04),
    },
    handItemAnimRotateIndex: {
      idle: 0,
      walk: 0,
      fall: 0,
      raise: -1,
      break2: 0.2,
      break1: 0.85,
      crouch: 0,
    },
    inventory: {
      0: { item: "air", amount: 0 },
      1: { item: "air", amount: 0 },
      2: { item: "air", amount: 0 },
      3: { item: "air", amount: 0 },
      4: { item: "air", amount: 0 },
      5: { item: "air", amount: 0 },
      6: { item: "air", amount: 0 },
      7: { item: "air", amount: 0 },
      8: { item: "air", amount: 0 },
      9: { item: "air", amount: 0 },
      10: { item: "air", amount: 0 },
      11: { item: "air", amount: 0 },
      12: { item: "air", amount: 0 },
      13: { item: "air", amount: 0 },
      14: { item: "air", amount: 0 },
      15: { item: "air", amount: 0 },
      16: { item: "air", amount: 0 },
      17: { item: "air", amount: 0 },
      18: { item: "air", amount: 0 },
      19: { item: "air", amount: 0 },
      20: { item: "air", amount: 0 },
      21: { item: "air", amount: 0 },
      22: { item: "air", amount: 0 },
      23: { item: "air", amount: 0 },
      24: { item: "air", amount: 0 },
      25: { item: "air", amount: 0 },
      26: { item: "air", amount: 0 },
      27: { item: "air", amount: 0 },
      28: { item: "air", amount: 0 },
      29: { item: "air", amount: 0 },
      30: { item: "air", amount: 0 },
      31: { item: "air", amount: 0 },
      32: { item: "air", amount: 0 },
      33: { item: "air", amount: 0 },
      34: { item: "air", amount: 0 },
      35: { item: "air", amount: 0 },
      36: { item: "air", amount: 0 },
      37: { item: "air", amount: 0 },
      38: { item: "air", amount: 0 },
      39: { item: "air", amount: 0 },
    },
    setSkin: (newSkin) => {
      player.skin = newSkin;
      playerTextureImageSrc = newSkin;
      localStorage.setItem("skinData", newSkin);
      playerImage.src = playerTextureImageSrc;
      playerTexture = new TextureInfo(playerImage);
    },
    getFeetCoords: () => {
      return vec2(player.coords.x, player.coords.y - 0.6);
    },
    getCoordsAt: (where) => {
      if (where == "bl" || where == "bottomLeft") {
        return vec2(
          player.getFeetCoords().x - 0.22,
          player.getFeetCoords().y + 0.1,
        );
      } else if (where == "br" || where == "bottomRight") {
        return vec2(
          player.getFeetCoords().x + 0.22,
          player.getFeetCoords().y + 0.1,
        );
      } else if (where == "tl" || where == "topLeft") {
        return vec2(player.getFeetCoords().x - 0.22, player.coords.y + 0.57);
      } else if (where == "tr" || where == "topRight") {
        return vec2(player.getFeetCoords().x + 0.22, player.coords.y + 0.57);
      }
    },
    isStandingOnBlock: () => {
      const leftFeetCoords = vec2(
        player.getFeetCoords().x - 0.2,
        player.getFeetCoords().y + 0.01,
      );
      const rightFeetCoords = vec2(
        player.getFeetCoords().x + 0.2,
        player.getFeetCoords().y + 0.01,
      );

      return (
        getCollidableBlockTypeAt(
          Math.ceil(leftFeetCoords.x),
          Math.floor(leftFeetCoords.y),
        ) ||
        getCollidableBlockTypeAt(
          Math.floor(rightFeetCoords.x),
          Math.floor(rightFeetCoords.y),
        ) ||
        false
      );
    },
    isBelowABlock: () => {
      const leftHeadCoords = vec2(
        player.getFeetCoords().x - 0.2,
        player.coords.y + 1.7,
      );
      const rightHeadCoords = vec2(
        player.getFeetCoords().x + 0.2,
        Math.floor(player.coords.y + 1.7),
      );

      return (
        getCollidableBlockTypeAt(
          Math.ceil(leftHeadCoords.x),
          Math.floor(leftHeadCoords.y),
        ) ||
        getCollidableBlockTypeAt(
          Math.floor(rightHeadCoords.x),
          Math.floor(rightHeadCoords.y),
        ) ||
        false
      );
    },
    isThereABlockAtBottomRight: () => {
      const bottomRightCoords = player.getCoordsAt("br");

      if (
        Math.abs(player.coords.x) -
          Math.abs(Math.floor(Math.abs(player.coords.x))) <
        0.9
      ) {
        return isCollidableBlockAt(
          Math.ceil(player.coords.x),
          Math.floor(bottomRightCoords.y + 0.1),
        );
      }
      return false;
    },
    isThereABlockAtBottomLeft: () => {
      const bottomRightCoords = player.getCoordsAt("bl");

      if (
        Math.abs(player.coords.x) -
          Math.abs(Math.floor(Math.abs(player.coords.x))) >
        0.1
      ) {
        return isCollidableBlockAt(
          Math.floor(player.coords.x),
          Math.floor(bottomRightCoords.y + 0.1),
        );
      }
      return false;
    },
    isThereABlockAtTopRight: () => {
      const bottomRightCoords = player.getCoordsAt("tr");

      if (
        Math.abs(player.coords.x) -
          Math.abs(Math.floor(Math.abs(player.coords.x))) <
        0.9
      ) {
        return isCollidableBlockAt(
          Math.ceil(player.coords.x),
          Math.floor(player.coords.y + 0.5),
        );
      }
      return false;
    },
    isThereABlockAtTopLeft: () => {
      const bottomRightCoords = player.getCoordsAt("tl");

      if (
        Math.abs(player.coords.x) -
          Math.abs(Math.floor(Math.abs(player.coords.x))) >
        0.1
      ) {
        return isCollidableBlockAt(
          Math.floor(player.coords.x),
          Math.floor(player.coords.y + 0.5),
        );
      }
      return false;
    },
    isThereABlockInMe: () => {
      const topBlock = getCollidableBlockTypeAt(
        Math.ceil(player.coords.x),
        Math.floor(player.coords.y - 0.3),
      );
      const bottomBlock = getCollidableBlockTypeAt(
        Math.floor(player.coords.x),
        Math.floor(player.coords.y + 0.3),
      );

      return topBlock || bottomBlock || false;
    },

    setUsername: (newUsername) => {
      player.username = newUsername;
    },

    drawPlayer: () => {
      player.animationChangeTimer += 1;
      if (
        !player.isFalling &&
        player.isWalking &&
        !player.crouching &&
        player.animationChangeTimer > 3
      ) {
        player.animation = "walk" + player.animationWalkingFrame;
        player.animationWalkingFrame = (player.animationWalkingFrame % 6) + 1;
        player.animationChangeTimer = 0;
      }
      if (
        !player.isFalling &&
        player.isWalking &&
        player.crouching &&
        player.animationChangeTimer > 16
      ) {
        if (player.animation == "crouchWalk") {
          player.animation = "crouch";
        } else {
          player.animation = "crouchWalk";
        }

        player.animationChangeTimer = 0;
      }
      if (
        player.isBreakingBlock &&
        player.animationChangeTimer > 6 &&
        !player.isWalking
      ) {
        player.animationChangeTimer = 0;

        if (!player.raisedArms) {
          player.animation = "raise2";
          player.raisedArms = true;
        } else if (player.animation === "raise2") {
          player.animation = "break1";
        } else if (player.animation === "break1") {
          player.animation = "break2";
        } else {
          player.animation = "break1";
        }
      } else if (
        !player.isBreakingBlock &&
        player.lowerArms &&
        !player.isWalking
      ) {
        player.animation = "raise2";
        setTimeout(() => {
          player.lowerArms = false;
        }, 40);
      }

      drawTile(
        vec2(
          Math.round(player.coords.x * 100) / 100,
          Math.round(player.coords.y * 100) / 100,
        ),
        vec2(2.059),
        spriteSheet[player.animation],
        WHITE,
        0,
        player.directionPositive,
      );
      // SHADOW
      let elipsePosY = Math.round(player.getFeetCoords().y * 100) / 100 - 0.44;
      if (player.jumping || player.isFalling) {
        elipsePosY = -90100011001000011;
        // find a block under
        for (
          let i = Math.floor(player.getFeetCoords().y);
          i > Math.floor(player.getFeetCoords().y) - 12;
          i -= 1
        ) {
          if (isCollidableBlockAt(Math.round(player.coords.x), i)) {
            elipsePosY = i + 0.5;
            break;
          }
        }
      }
      drawEllipse(
        vec2(Math.round(player.coords.x * 100) / 100, elipsePosY),
        vec2(0.65, 0.1),
        new Color(0.2, 0.2, 0.2, 0.5),
      );
      if (!player.isFalling && player.isWalking) {
        let block =
          blocks[
            `${Math.floor(player.getFeetCoords().x)},${Math.floor(player.getFeetCoords().y - 0.2)}`
          ];
        if (block == undefined || !block) {
          block = "Air";
        }
        if (!player.crouching) {
          const particleWalk = new ParticleEmitter(
            vec2(player.getFeetCoords().x, player.getFeetCoords().y - 0.3),
            0,
            vec2(0.1, 0.01),
            0.2,
            10,
            180,
            undefined,
            blockMetaData[block].color1Class,
            blockMetaData[block].color2Class,
            CLEAR_WHITE,
            CLEAR_WHITE,
            0.1,
            0.1,
            0.1,
          );
          setTimeout(() => {
            particleWalk.destroy(true);
          }, 200);
        }
      }

      // show hotbar hand item
      let handPos = vec2(0, 0);
      let handRot = 0;
      if (player.inventory[player.hotbarSlotHovered].item != "air") {
        let handAnim = "idle";
        switch (player.animation) {
          case "idle":
          case "walk6":
            handAnim = "idle";
            break;
          case "walk1":
          case "walk2":
          case "walk3":
          case "walk4":
          case "walk5":
            handAnim = "walk";
            break;
          case "fall":
            handAnim = "fall";
            break;
          case "raise1":
          case "raise2":
            handAnim = "raise";
            break;
          case "break1":
            handAnim = "break1";
            break;
          case "break2":
            handAnim = "break2";
            break;
          case "crouch":
          case "crouchWalk":
            handAnim = "crouch";
            break;
          default:
            handAnim = "idle";
            break;
        }

        handPos = player.handItemAnimIndex[handAnim];
        handRot = player.handItemAnimRotateIndex[handAnim];

        if (player.directionPositive) {
          drawTile(
            vec2(
              player.coords.x + handPos.x,
              player.getFeetCoords().y + handPos.y,
            ),
            vec2(0.3),
            texture[player.inventory[player.hotbarSlotHovered].item],
            WHITE,
            handRot,
          );
        } else {
          drawTile(
            vec2(
              player.coords.x - handPos.x,
              player.getFeetCoords().y + handPos.y,
            ),
            vec2(0.3),
            texture[player.inventory[player.hotbarSlotHovered].item],
            WHITE,
            -handRot,
          );
        }
      }
    },

    calculatePlayerPhysics: () => {
      // check if standing on block

      if (player.isStandingOnBlock()) {
        if (player.isFalling) {
          let block =
            blocks[
              `${Math.round(player.getFeetCoords().x)},${Math.floor(player.getFeetCoords().y - 0.2)}`
            ];
          if (block == undefined || !block) {
            block = "Air";
          }
          let fallParticle = new ParticleEmitter(
            vec2(player.getFeetCoords().x, player.getFeetCoords().y - 0.5),
            0,
            vec2(0.7, 0.01),
            0.2,
            50,
            0,
            undefined,
            blockMetaData[block].color1Class,
            blockMetaData[block].color2Class,
            CLEAR_WHITE,
            CLEAR_WHITE,
            0.1,
            0.1,
            0.1,
          );
          setTimeout(() => {
            fallParticle.destroy(true);
          }, 200);
          player.isFalling = false;
        }

        player.fallMultiplier = 1;
      } else if (!player.isStandingOnBlock()) {
        // Fall physics

        if (!player.canFly && !player.jumping) {
          player.isFalling = true;
          if (player.fallMultiplier < 2.3) {
            player.fallMultiplier += 0.04;
          }
          player.coords.y -= 0.05 * player.fallMultiplier;
        }
      }

      if (
        !player.isWalking &&
        !player.isFalling &&
        !player.crouching &&
        !player.isBreakingBlock &&
        !player.lowerArms
      ) {
        player.animation = "idle";
      }
      if (
        !player.isWalking &&
        !player.isFalling &&
        player.crouching &&
        !player.isBreakingBlock
      ) {
        player.animation = "crouch";
      }

      // Jumping physics
      if (
        !player.isFalling &&
        player.jumping &&
        !player.canFly &&
        !player.isBelowABlock()
      ) {
        player.coords = player.coords.add(
          vec2(0, 0.175 * player.jumpMultiplier),
        );
        player.jumpMultiplier -= 0.05;
        player.jumpFrame += 1;
        player.isFalling = false;
        if (player.jumpFrame > 10 && player.jumpFrame < 14) {
          player.jumpMultiplier -= 0.05;
        } else if (player.jumpFrame > 14) {
          player.jumpFrame = 1;
          player.jumpMultiplier = 1;
          player.jumping = false;
          player.isFalling = true;
        }
      } else if (player.jumping && player.isBelowABlock()) {
        player.jumping = false;
      }

      if (player.isFalling && !player.canFly) {
        player.animation = "fall";
      }
      if (player.jumping && player.canFly) {
        player.coords = player.coords.add(vec2(0, -0.1 * 85));
      }
    },
    cameraToPlayer: () => {
      cameraPos = vec2(
        Math.round(player.coords.x * 100) / 100,
        Math.round(player.coords.y * 100) / 100,
      );
    },
    setSlot: (item, amount, slot) => {
      player.inventory[slot] = { item: item, amount: amount };
      document.dispatchEvent(invenEvent);
    },
    getSlot: (slot) => {
      return player.inventory[slot];
    },
    isInvenFull: () => {
      for (let i = 0; i <= 39; i++) {
        if (!player.getSlot(i) || player.getSlot(i).amount === 0) {
          return false;
        }
      }
      return true;
    },
    addItem: (item, amount) => {
      if (!player.isInvenFull()) {
        for (let i = 0; i <= 39; i++) {
          if (
            player.getSlot(i).item == item &&
            player.getSlot(i).amount + amount <= 64
          ) {
            player.setSlot(item, amount + player.getSlot(i).amount, i);

            break;
          } else if (!player.getSlot(i) || player.getSlot(i).amount == 0) {
            player.setSlot(item, amount, i);

            break;
          }
        }
      }
    },
    changeHotbarSlot: (newHotbarSlot) => {
      if (hotbarSlot[newHotbarSlot]) {
        hotbarSlot[player.hotbarSlotHovered].className = "slot";
        hotbarSlot[newHotbarSlot].className = "slot slotHover";

        player.hotbarSlotHovered = newHotbarSlot;
      }
    },
  };
  player.cameraToPlayer();
  document.addEventListener("createWorld", (event) => {
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

      player.coords = vec2(0, 5);
    }
  });
  console.log("Game engine initialized.");
  renderInven();
}
function gameUpdate() {}

//Game rendering and physics
/*                                                                                                                                                                                                                                                 
                                                                                                                                                                          
                                                                                                                                                                        
                                                             █                  █                                              █                      █                 
  ▒███▒                             █████                    █                                             ▒███         █████░ █                                        
 ░█▒ ░█                             █   ▓█                   █                                             █▒           █   ▓█ █                                        
 █▒     ░███░  ██▓█▓   ███          █    █  ███   █▒██▒   ██▓█   ███    █▒██▒ ███    █▒██▒   ██▓█          █            █    █ █▒██▒  █░  █  ▒███▒  ███     ▓██▒  ▒███▒ 
 █      █▒ ▒█  █▒█▒█  ▓▓ ▒█         █   ▒█ ▓▓ ▒█  █▓ ▒█  █▓ ▓█  ▓▓ ▒█   ██  █   █    █▓ ▒█  █▓ ▓█          █▓           █   ▓█ █▓ ▒█  ▓▒ ▒▓  █▒ ░█    █    ▓█  ▓  █▒ ░█ 
 █   ██     █  █ █ █  █   █         █████  █   █  █   █  █   █  █   █   █       █    █   █  █   █         ░██▒          █████░ █   █  ▒█ █▒  █▒░      █    █░     █▒░   
 █    █ ▒████  █ █ █  █████         █  ░█▒ █████  █   █  █   █  █████   █       █    █   █  █   █         █▒░█ █        █      █   █   █ █   ░███▒    █    █      ░███▒ 
 █▒   █ █▒  █  █ █ █  █             █   ░█ █      █   █  █   █  █       █       █    █   █  █   █         █  ▓██        █      █   █   █▓▓      ▒█    █    █░        ▒█ 
 ▒█░ ░█ █░ ▓█  █ █ █  ▓▓  █         █    █ ▓▓  █  █   █  █▓ ▓█  ▓▓  █   █       █    █   █  █▓ ▓█         ██  █▒        █      █   █   ▓█▒   █░ ▒█    █    ▓█  ▓  █░ ▒█ 
  ▒███▒ ▒██▒█  █ █ █   ███▒         █    ▒  ███▒  █   █   ██▓█   ███▒   █     █████  █   █   ██▒█          ███▓█        █      █   █   ▒█    ▒███▒  █████   ▓██▒  ▒███▒ 
                                                                                                █                                      ▒█                               
                                                                                             ▓ ▒█                                      █▒                               
                                                                                             ▒██░                                     ██                                 */
let hoveredBlock = vec2(0, 0);
let blockBreak = 0;
let blockBreakNoSpam = 0;
async function gameRender() {
  let halfWidth = mainCanvas.width / cameraScale / 2;
  let halfHeight = mainCanvas.height / cameraScale / 2;

  let startX = Math.floor(cameraPos.x - halfWidth) - 1;
  let endX = Math.ceil(cameraPos.x + halfWidth) + 1;

  let startY = Math.floor(cameraPos.y - halfHeight) - 1;
  let endY = Math.ceil(cameraPos.y + halfHeight) + 1;
  /*  if(time < 50){
    let randomButtcheak = Math.floor(Math.random()*textureNames.length);
    new droppedItem(textureNames[randomButtcheak],player.coords.x,player.coords.y)
        randomButtcheak = Math.floor(Math.random()*textureNames.length);
    new droppedItem(textureNames[randomButtcheak],player.coords.x,player.coords.y)
   
        randomButtcheak = Math.floor(Math.random()*textureNames.length);
    new droppedItem(textureNames[randomButtcheak],player.coords.x,player.coords.y)
   

   
  } */
  const renderBlocks = () => {
    for (let x = startX; x <= endX; x++) {
      for (let y = startY; y <= endY; y++) {
        let block = blocks[`${x},${y}`];

        if (block) {
          drawTile(vec2(x, y), vec2(1, 1), texture[block]);
        }
      }
    }
  };

  const renderSky = () => {
    drawRectGradient(
      cameraPos,
      vec2(
        Math.ceil(window.innerWidth / 75),
        Math.ceil(window.innerHeight / 80),
      ),
      new Color().setHex("#5DB8FF"),
      new Color().setHex("#CFF4FF"),
      0,
    );
  };
  const mouseThings = () => {
    const blockMousePos = vec2(Math.round(mousePos.x), Math.round(mousePos.y));
    const diff = blockMousePos.subtract(player.coords);

    const diffAbs = diff.abs();

    if (
      hoveredBlock.x != blockMousePos.x ||
      hoveredBlock.y != blockMousePos.y
    ) {
      blockBreak = 0;

      blockBreakNoSpam = 0;
      blockBreak = 0;
      player.isBreakingBlock = false;
    }
    hoveredBlock = blockMousePos;

    if (diffAbs.x > 5 || diffAbs.y > 5) {
      drawTile(blockMousePos, vec2(1), texture["hoverFar"]);
      if (player.isBreakingBlock) {
        blockBreak = 0;
        blockBreakNoSpam = 0;
        blockBreak = 0;
        player.isBreakingBlock = false;
        player.raisedArms = false;
        player.lowerArms = true;
        player.animationChangeTimer = 0;
      }
    } else {
      drawTile(blockMousePos, vec2(1), texture["hoverClose"]);

      let blockType = blocks[`${blockMousePos.x},${blockMousePos.y}`];
      if (blockType == undefined) {
        blockType = "Air";
      }

      if (mouseIsDown(0) && blockType != "Air") {
        if (blockBreakNoSpam > 12 * blockMetaData[blockType]["breakTime"]) {
          blockBreak += 1;
          blockBreakNoSpam = 0;
        } else {
          blockBreakNoSpam += 1;
        }

        player.isBreakingBlock = true;

        if (blockBreak > 6) {
          let breakParticle = new ParticleEmitter(
            blockMousePos,
            0,
            vec2(0.5, 0.5),
            0.05,
            1902,
            180,
            undefined,
            blockMetaData[blockType || "Air"].color1Class,
            blockMetaData[blockType || "Air"].color2Class,
            CLEAR_WHITE,
            CLEAR_WHITE,
            0.1,
            0.1,
            0.1,
          );
          const drop = new droppedItem(
            blockType,
            blockMousePos.x,
            blockMousePos.y,
          );

          setTimeout(() => {
            breakParticle.destroy(true);
          }, 200);
          destroyBlock(blockMousePos.x, blockMousePos.y);
          blockBreak = 0;
          blockBreakNoSpam = 0;
          player.isBreakingBlock = false;
          player.raisedArms = false;
          player.lowerArms = true;
          player.animationChangeTimer = 0;
        } else {
          drawTile(
            vec2(blockMousePos.x, blockMousePos.y),
            vec2(0.75),
            blockBreakingTexture["frame" + blockBreak],
          );
        }
      }
      if (mouseIsDown(0) && blockType != "Air" && player.isWalking) {
      }
      if (mouseIsDown(0) && blockType == "Air" && player.isBreakingBlock) {
        blockBreakNoSpam = 0;
        blockBreak = 0;
        player.isBreakingBlock = false;
        player.raisedArms = false;
        player.lowerArms = true;
      }
    }
    if (!mouseIsDown(0) && player.isBreakingBlock) {
      blockBreakNoSpam = 0;
      blockBreak = 0;
      player.isBreakingBlock = false;
      player.raisedArms = false;
      player.lowerArms = true;
      player.animationChangeTimer = 0;
    }
  };
  let dropCoords;
  const renderDrops = () => {
    if (Object.keys(drops).length > 0) {
      for (const i of Object.values(drops)) {
        // the reason [0] exists is because js objects are weird
        dropCoords = Object.keys(drops)[0].split(",");

        let dropCoordsX = dropCoords[0];
        let dropCoordsY = dropCoords[1];

        if (
          dropCoordsX > startX &&
          dropCoordsX < endX &&
          dropCoordsY > startY &&
          dropCoordsY < endY
        ) {
          for (let e = 0; e < i.length; e++) {
            if (
              Math.abs(player.coords.x - dropCoordsX) < 0.9 &&
              Math.abs(player.getFeetCoords().y - 0.1 - dropCoordsY) < 0.6
            ) {
              console.log(i[e].item);
              player.addItem(i[e].item, 1);
              i[e].destroy();
            } else {
              i[e].draw();
            }
          }
        }
      }
    }
  };

  renderSky();
  renderBlocks();
  mouseThings();
  player.calculatePlayerPhysics();

  player.drawPlayer();

  renderDrops();

  player.cameraToPlayer();

  player.isWalking = false;
  player.crouching = false;

  function moveSideways(direction) {
    player.isWalking = true;
    // collision checks
    if (direction == "r") {
      if (
        player.isThereABlockAtBottomRight() ||
        player.isThereABlockAtTopRight()
      ) {
        player.isWalking = false;
      } else {
        player.isWalking = true;
      }
    } else if (direction == "l") {
      if (
        player.isThereABlockAtBottomLeft() ||
        player.isThereABlockAtTopLeft()
      ) {
        player.isWalking = false;
      } else {
        player.isWalking = true;
      }
    }

    if (player.isWalking) {
      if (player.crouching) {
        //check if on edge of block

        if (direction == "r") {
          if (
            isCollidableBlockAt(
              Math.floor(player.getFeetCoords().x + 0.5),
              Math.floor(player.getFeetCoords().y - 0.2),
            )
          ) {
            if (!player.isFalling) {
              player.isWalking = true;
            }
          } else {
            player.isWalking = false;
          }
        } else if (direction == "l") {
          if (
            isCollidableBlockAt(
              Math.floor(player.getFeetCoords().x + 0.5),
              Math.floor(player.getFeetCoords().y - 0.2),
            )
          ) {
            if (!player.isFalling) {
              player.isWalking = true;
            }
          } else {
            player.isWalking = false;
          }
        }
        if (player.isWalking) {
          if (direction == "r") {
            player.coords = player.coords.add(vec2(0.01, 0));
          } else if (direction == "l") {
            player.coords = player.coords.add(vec2(-0.01, 0));
          }
        }
      } else {
        direction == "r"
          ? (player.coords = player.coords.add(vec2(0.08, 0)))
          : (player.coords = player.coords.add(vec2(-0.08, 0)));
      }
    }
  }

  if (keyIsDown("ArrowUp") && !player.isFalling) {
    player.jumping = true;
  }
  if (keyIsDown("ArrowDown")) {
    player.crouching = true;
  }
  if (keyIsDown("ArrowLeft") && !keyIsDown("ArrowRight")) {
    moveSideways("l");
    player.directionPositive = false;
  }
  if (keyIsDown("ArrowRight") && !keyIsDown("ArrowLeft")) {
    moveSideways("r");
    player.directionPositive = true;
  }
}

function destroyBlock(x, y) {
  if (isCollidableBlockAt(x, y)) {
    delete blocks[`${x},${y}`];
  }
}
function createBlock(x, y, blockType) {
  // check if block already exist
  if (isCollidableBlockAt(x, y)) {
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
  Air: {
    breakTime: -1,
    tool: "hands",
    collision: false,
    translucent: true,
    liquid: false,
    color1: "#239d2d00",
    color1Class: new Color(0.137, 0.616, 0.176, 0),

    color2: "#1b7f2300",
    color2Class: new Color(0.106, 0.498, 0.141, 0),
  },

  grass: {
    breakTime: 1,
    tool: "shovel",
    collision: true,
    translucent: false,
    liquid: false,

    color1: "#239d2d",
    color1Class: new Color(0.137, 0.616, 0.176, 1),

    color2: "#1b7f24",
    color2Class: new Color(0.106, 0.498, 0.141, 1),
  },

  dirt: {
    breakTime: 1,
    tool: "shovel",
    collision: true,
    translucent: false,
    liquid: false,

    color1: "#593F2D",
    color1Class: new Color(0.349, 0.247, 0.176, 1),

    color2: "#493323",
    color2Class: new Color(0.286, 0.2, 0.137, 1),
  },

  stone: {
    breakTime: 2,
    tool: "pickaxe",
    collision: true,
    translucent: false,
    liquid: false,

    color1: "#545454",
    color1Class: new Color(0.329, 0.329, 0.329, 1),

    color2: "#464646",
    color2Class: new Color(0.275, 0.275, 0.275, 1),
  },

  mapleLog: {
    breakTime: 1.5,
    tool: "axe",
    collision: true,
    translucent: false,
    liquid: false,

    color1: "#634A2E",
    color1Class: new Color(0.388, 0.29, 0.18, 1),

    color2: "#503C25",
    color2Class: new Color(0.314, 0.235, 0.145, 1),
  },

  mapleLeaf: {
    breakTime: 0.5,
    tool: "axe/hoe/sheers",
    collision: false,
    translucent: false,
    liquid: false,

    color1: "#48834C",
    color1Class: new Color(0.282, 0.514, 0.298, 1),

    color2: "#396A3D",
    color2Class: new Color(0.224, 0.416, 0.239, 1),
  },

  bedrock: {
    breakTime: Infinity,
    tool: "hands",
    collision: true,
    translucent: false,
    liquid: false,

    color1: "#5e5b5e",
    color1Class: new Color(0.369, 0.357, 0.369, 1),

    color2: "#4d4a4d",
    color2Class: new Color(0.302, 0.29, 0.302, 1),
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
    createBlock(i, -1, "dirt");
    createBlock(i, -2, "dirt");
    createBlock(i, -3, "dirt");
    createBlock(i, -4, "bedrock");
  }
  console.log(blocks);
}

// Initialize textures and start the draw loop.

engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender);
setInputPreventDefault(false);
debugKey = "Escape";
