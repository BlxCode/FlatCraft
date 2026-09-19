// Sorry that everything is in one file lol
// still too lazy to import and export letiables and stuff like that
// this is also the first time i've ever used littleJS
"use strict";
let isInGame = false;
let gameId;
let worldLights = {};
const loadingScreen = document.getElementById("loadingScreen");
const loadingTitle = document.getElementById("loadingTitle");
const loadingProgressBar = document.getElementById("loadingProgress");
const mainMenuAudio = new Audio("./assets/music/menu.wav");
const errorDiv = document.getElementById("popup");
let ws;
const enterGameButtonLoadingScreenWrapper = document.getElementById(
  "enterGameButtonLoadingScreenWrapper",
);

let currentPopup = null;
const errorBackdrop = document.getElementById("errorBackdrop");
const worldMenu = document.getElementById("worldSelect");
const worldCreateMenu = document.getElementById("worldCreate");

mainMenuAudio.loop = true;
const events = {};
let dotsInLoadingTitle = 3;
let dotsDirectionMore = true;

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
    let lastPopup = currentPopup;
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
        currentPopup = lastPopup;
      },
      document.getElementById("popupContent").innerText.length * 0.1 * 1000,
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

let progressBar = setInterval(() => {
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
let skins;
let skinsObj;
let skinSrc;
skinSrc =
  localStorage.getItem("skinsSrc") ||
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAE0CAYAAAAsUhOPAAAIYUlEQVR4AeycsatdRRDG94lEbAxioaBgJSkkhYRUkqQwZRqr/AFCCrEIpDbg6wNpFATTK2JsLLXIKwNWaiG2ilpYxMYYhOf89p7ZN2fOzJ7c9x4hmpX73Z3Zmfl2z75z93Ov3vNUOeZ/Hi3hzXcv7+++8/YCvYvqzvDWF1fK+5/cLs89c6J8/tV71e6REesSPn/qg3LhwoVy+/tfi9pf//QHdSm6hFTt7e2VO3fuVGDT10OX8P79++X8+fN1lswUm77tCXd398u1a/t3L10qexcvFiXBpq9M8Yg4nuG9e6WcPFkKrVTdPXeu7J09K9b0op/45NomJtRkWi1Wm2pr4xuEhDd/+6EAk7cxJyJiN//6edPn3kPCP/9+cJA2kdQOna04sxzx9RUSciO3AkOiRcTIUd+2IWFL8GQy2zMfX66fnJbjjJSQGZz59Eo5/eGbBRIF9cyQNkJKqEUnnn6l1T34Z/OHYDCNt+BkhIRXP/ps5/qtL3emnPLtL6d2AOSQ+rjm0YaEBADFtBaQWt/bXUJfHA2wFaFP9gP4OH53hswIkAiwAXaGlFC2qn02VaDF2ED9qE0JZTPdUWih97XftikhSUOkiqwhK9FFdw3REvlrD5GSJZSNVhVRvNkrXMMqQiJUs0yciajGh0ixIiBcQwLoxhApVqKsyUC6hmde/nGfYuSzMsnb2vYvKSUlJOjx3e9vVa1mMNk09n0cPyVkNoAkC/qA7bN2SMjoiBGwydjMEmBHCAllI10IlC8mx/fhh4QEDosu4VC9/4LqyTFtHM0W9394Y8+ODJN01kpzEJrl1ODmLSRET1qBIdmUlEKMHPVtGxK2BE8ms+VElZFRlxJSNFSPJRqqV1dh9hbeNkP1xheSs7tk4YS3jWaNs177xtN++6nLo224hvUsN856dY2G6tVlcG/hbUPO6Re/qSclezSjn+MabYaQkKNXVKjkxBkQqfDEIaEmKYH6tL1jGfGQkCJAggfHMgai9TH8BSGXwRkPkNBDdDxbEJKk6JFlsQVhlviw/V3CcdYbZz35z3TBvRTfNrIz11xaPauoTcDa+AYh4VC9gxWStdvirHdQhzXOeqxCRSReNTC9hfchMZSNYvQDH2Q6Q0yREmqCbVWYGAztsTG1U0JmAzRRW/qA+r4NCRkd1QO+gFkC369+SKiqR6uJvs1iIaEv3sZ/tIRDRoeMDhmdPp/hRw+B4mvRmqP/5lCdzRsxcjbe/D0kbCme7MmRUd3yES3sI//fLBDpulpb+2zb/aNY7WBmFFpZxffoEtrktZlp7iohM2J2Ci3M2lVCK6mRrHriVULk0sITeH+V0Bes+V3CoXpD9YbqTR+h8JOCoqFsNccLlXQSI0fMxSskbFme7MlRPXZtgAywcx9Z9dqaigGpNOmr+0fxxcwuZZoCXcIppzV2gNbpjC4hMwJagw3Uj9qU0KqdFqJ6QP2oTQkjpdO+iEj7UkJN2LZ9tIRDRoeMDhmdPqPhRw+JRCprjlc+6SRGjpiLV0jYsjzZccsoP4tgMGZIGyGdoRbZbR+bHZvL1bgnDQlVJimmAAkF2JBqHN8jJNQkitWm1QGwM3QJfZEfwMfxu4TMCJAIsAF2hpRwqF62ZIv+dA3JHKo3VG+oHp8EQfhJmW3xXqikiO2fHDEXr5CwZXmyx1b1dJdGArC5XC67XYkxwktWVaOYXIhoAbbG8T1CQk0a33DWH0XrcmRtdw0p0vOdtvT1sErYK45iXcLHWKSma+GwzW+/x6/Uy/iV+nRPbJrwxp5tnrLtt58jGkmY5Wy46ntIONuRDUmtkDfIyBFz8QoJW5Ynk9mO/z2mrY4a3TVU1dNkWlSPNkOX0BdHA3jiLqFP9gP4OH6XkBkBEgE2wM6QEj6hZ72heuNo9r85mvGQodkHX3Rka9XjE6FAzVC1RuqFSgLEyRNz8aq7DQkawSaZs0idGTPUoNgPpXo85QQCoDYcx/oDQAiB3aV1c+UKuBLiHvWSfaf3+TISQA6pXonPw+8SUkySBaTW93aX0BdHA2xF6JP9AD6O350hMwIkAmyAnSElHKo3+xFgtn70p2tI8FBPJGO7YqeBwONQZz0+l57I+nLwrk8j46lk2DYW2d1LPtIPALlsLr+d43Z3D/dEMnYOtiLQLl820rq5slvLdW39RDI2VQB5uX59p+LGjZ32Qz8GANMArV8G86/uGvpkJao/lTh42MssbZ3QzowZ4gsFSyTN4rVOaEi0GrK23to5tX1CTyazeyjVm8gXzVC9uiRrutL9o/jiNT1hxC4hCRZ+ABtTu0vIjIAmYwP1ozYlHKq3veqxW7Nr24U+lOopQbR7HEr1lDBrUToUD2Bnedrfbhv2OMCla/BIqoemcNnXX32j8AxO1I8Hu/DsTYgZBJs+YjWHToc2Q/qrSGHIRnok1YOjYaheXUvWtK3J4/KwFyY0VI9VOPzDXqj2orSmJ9TMPnp09OAHiHK7hMwIaCE2UD9qU8JjVT2k4OJrL/DlWX3Umc5ENtjqs2eSo/22TWfI3mgTrU2Mzdj2qZ0SUsAsmI0HxZDSeqSEJPZUjwHJ8QgJSWYGmepp3JPhh4SQEQTyh1ic9WycHIuQ8OpLrxeAOMnts3iwJ7Grzx48vHeVsG6qkoXCoXQQi1ufRE1fjbtNlzgIZ6gnplooWYuzHmQcOSTmXzEhytc768ECKa1DTOiSmgsJM2NA0AIHxjqhklADGT52gnXChyCx3H1CTyaz46xnCbzdJcxUz5NYPyXkZ9kk2l1aN1eNEfdICW0i324CJVdim6N2SqhFEGmy2kqs/bZNCbMiHciSWDsltEnWzgbSnJSQmQBN1JY+oL5vQ0LZshZPntZCNl2gvm//BQAA//+t9DknAAAABklEQVQDAJBZr43S2cBOAAAAAElFTkSuQmCC";
//initialized game
async function startInit() {
  //wss thingy server thing
  await new Promise((resolve) => {
    let noPingTimeout = setTimeout(() => {
      displayError("Coudn't ping to the Skins server. Skipping...");
      resolve();
    }, 12500);
    ws =
      location.origin != "http://192.168.0.14:5500"
        ? new WebSocket("wss://test-api.blxm.me/")
        : new WebSocket("ws://192.168.0.200:8080/");

    ws.addEventListener("open", () => {
      console.log("Connected to skins server");

      // SKIN STUFF
      let secureAhhPassword;

      ws.onmessage = (e) => {
        if (e.data.includes("S|p*r#e%c^r/e*a-s~wd")) {
          secureAhhPassword = e.data.replace("S|p*r#e%c^r/e*a-s~wd", "");
        }
        if (e.data.includes("S|c'[]s")) {
          skins = e.data.replace("S|c'[]s", "");
          skinsObj = JSON.parse(JSON.parse(skins));
          console.log(typeof skinsObj);
        }
      };
      if (localStorage.getItem("skins")) {
        dgeID("skinId").value = localStorage.getItem("skins");
      } else {
        dgeID("skinId").value = "";
      }
      ws.send(secureAhhPassword + "closeThisLol😭🥀🚣‍♂️");
      clearTimeout(noPingTimeout);
      resolve();
    });
    ws.addEventListener(
      "error",
      (e) => {
        displayError("Could not get the Skins server.");
        clearTimeout(noPingTimeout);
        resolve(e);
      },
      { once: true },
    );
  });

  await new Promise((r) => setTimeout(r, 1000));
  clearInterval(progressBar);
  clearInterval(loadingTextAnim);

  loadingProgressBar.ariaValueNow = 100;
  loadingProgressBar.style.width = "100%";
  await new Promise((r) => setTimeout(r, 1000));
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
enterGameButtonLoadingScreenWrapper.addEventListener("click", (e) => {
  e.currentTarget.blur();
  mainMenuAudio.play();
  loadingScreen.className = "popCloseHide";
});
// TODO: Fix scrolling
const backdropUI = document.getElementById("backdrop");
const buttonOpenCredits = document.getElementById("mainMenuButtonCredits");
document.getElementById("credits").getBoundingClientRect();
buttonOpenCredits.addEventListener("click", (e) => {
  e.currentTarget.blur();
  document.getElementById("credits").className = "popAnim";
  paused = true;
  backdropUI.hidden = false;
  currentPopup = document.getElementById("credits");
});

const buttonCloseCredits = document.getElementById("buttonCloseCredits");
buttonCloseCredits.addEventListener("click", (e) => {
  e.currentTarget.blur();
  document.getElementById("credits").className = "popCloseHide";
  paused = false;
  backdropUI.hidden = true;
  currentPopup = null;
});

const buttonOpenSettings = document.getElementById("mainMenuButtonSettings");
buttonOpenSettings.addEventListener("click", (e) => {
  e.currentTarget.blur();
  document.getElementById("settings").className = "popAnim";
  setPaused(true);
  backdropUI.hidden = false;
  currentPopup = document.getElementById("settings");
});

const buttonCloseSettings = document.getElementById("buttonCloseSettings");
buttonCloseSettings.addEventListener("click", (e) => {
  e.currentTarget.blur();
  document.getElementById("settings").className = "popCloseHide";

  setPaused(false);
  backdropUI.hidden = true;
  currentPopup = null;
});

const buttonPlayGame = document.getElementById("mainMenuButtonPlay");
buttonPlayGame.addEventListener("click", (e) => {
  e.currentTarget.blur();
  worldMenu.className = "popAnim";
  backdropUI.hidden = false;
  currentPopup = worldMenu;
});

const buttonCloseWorlds = document.getElementById("buttonCloseWorlds");
buttonCloseWorlds.addEventListener("click", (e) => {
  e.currentTarget.blur();
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
buttonCloseCreateWorldMenu.addEventListener("click", (e) => {
  e.currentTarget.blur();
  worldCreateMenu.className = "popCloseHide";
  worldMenu.className = "popAnim text-center";
  currentPopup = worldMenu;
});

createNewWorld.addEventListener("click", (e) => {
  e.currentTarget.blur();
  worldMenu.className = "popCloseHide text-center";
  worldCreateMenu.className = "popAnim";
  currentPopup = worldCreateMenu;
});
let createWorldInfo = {};

submitNewWorldForm.addEventListener("click", (e) => {
  e.currentTarget.blur();
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

// show all saved worlds in the world select menu

const worldListContainer = document.getElementById("worldSelectWrapper");

function loadWorld(world, element) {
  element.blur();
  const saveInfo = JSON.parse(localStorage.getItem("gameSave" + world));

  worldName = saveInfo.worldName;
  worldDesc = saveInfo.worldDesc;
  blocks = saveInfo.blocks;
  biomes = saveInfo.biomes;
  gameId = saveInfo.gameId;
  Object.keys(blocks).forEach((block) => {
    if (blocks[block] == "lantern") {
      let coords = block.split(",");
      const light = new Light(
        vec2(Number(coords[0]), Number(coords[1])),
        8,
        new Color(248 / 255, 199 / 255, 100 / 255),
        15,
      );

      worldLights[`${Number(coords[0])},${Number(coords[1])}`] = light;
      console.log(worldLights);
    }
  });
  backdropUI.click();
  mainMenuAudio.pause();
  document.getElementById("mainMenu").className = "popCloseHide";
  player.coords = vec2(saveInfo.playerCoords.x, saveInfo.playerCoords.y);
  player.inventory = saveInfo.playerInventory;
  invenDiv.className = "visually-hidden";
  setPaused(false);
  isInGame = true;
  renderInven();

  const recentGameIdsArray =
    JSON.parse(localStorage.getItem("recentGameIds")) || [];
  if (recentGameIdsArray.includes(gameId)) {
    recentGameIdsArray.splice(recentGameIdsArray.indexOf(gameId), 1);
  }
  recentGameIdsArray.unshift(gameId);
  localStorage.setItem("recentGameIds", JSON.stringify(recentGameIdsArray));
}
window.loadWorld = loadWorld;
const recentGameIdsArray = JSON.parse(
  localStorage.getItem("recentGameIds") || "[]",
);
for (let i = 0; i < recentGameIdsArray.length; i++) {
  const saveInfo = JSON.parse(
    localStorage.getItem("gameSave" + recentGameIdsArray[i]),
  );
  console.log(recentGameIdsArray);
  console.log("gameSave" + recentGameIdsArray[i]);
  const worldName = saveInfo.worldName;
  const worldDesc = saveInfo.worldDesc;

  worldListContainer.innerHTML += `
    <div class="row worldSelectRow text-center">
              <h2 class="worldTitle">${worldName}</h2>
              <p class="worldDesc">${worldDesc}</p>
             
              <button
                style="
                  text-align: center !important;
                  margin-left: auto;
                  font-size: 1.5dvh;
                  margin-right: auto;
                  padding-left: 0.3dvh !important;
                  padding-right: 0.3dvh !important;
                "
                onclick="loadWorld(${recentGameIdsArray[i]}, this)"
                class="woldSelectButton worldPlayButton btn btn-success w-50 align-middle"
              >
                Play
              </button>

         
            </div>`;
}

backdropUI.addEventListener("click", (e) => {
  e.currentTarget.blur();
  if (!currentPopup) {
    return;
  }
  if (currentPopup.id == "inventory") {
    currentPopup.className = "popCloseHide row";
    if (player.itemHoldingInCursor) {
      new droppedItem(
        player.itemHoldingInCursor.item,
        player.coords.x,
        player.coords.y,
        player.itemHoldingInCursor.amount,
      );
      player.itemHoldingInCursor = undefined;

      document.dispatchEvent(invenEvent);
    }
  } else {
    currentPopup.className = "popCloseHide";
  }
  currentPopup = null;
  backdropUI.hidden = true;
  setPaused(false);
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

settingsNavItemGeneral.addEventListener("click", (e) => {
  e.currentTarget.blur();
  switchSettingsTab(settingsNavItemGeneral, "General");
});
settingsNavItemGraphics.addEventListener("click", (e) => {
  e.currentTarget.blur();
  switchSettingsTab(settingsNavItemGraphics, "Graphics");
});
settingsNavItemSkin.addEventListener("click", (e) => {
  e.currentTarget.blur();
  switchSettingsTab(settingsNavItemSkin, "Skin");
});
// Close button hides the popup and its backdrop.
document.getElementById("popupClose").addEventListener("click", (e) => {
  e.currentTarget.blur();
  errorDiv.className = "popCloseHide";
  errorBackdrop.hidden = true;
});
dgeID("skinId").addEventListener("keyup", (e) => {
  if (e.key == "Return" || e.key == "Enter") {
    let found;

    if (skinsObj) {
      skinsObj.forEach((skin) => {
        if (skin.id == dgeID("skinId").value) {
          localStorage.setItem("skins", skin.id);
          skinSrc = skin.file;
          localStorage.setItem("skinsSrc", skin.file);
          found = true;
        }
      });
    }
    if (!found) {
      displayError("Invalid Id");
    } else if (found) {
      displayError("Valid Id!");
    }
  }
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
let creativeSlotHovered = undefined;

const invenDiv = dgeID("inventory");
let invenEvent = new Event("invenEvent");
let fpsWaitForUpdate = 0;
const hotbarAmt = document.getElementsByClassName("hotbarSlotAmt");
const hotbarImg = document.getElementsByClassName("hotbarSlotImg");
const hotbarSlot = document.getElementsByClassName("slot");
function getInvenElement(slot) {
  const invenDivSlot = dgeID("invenSlot" + slot);
  const invenImgSlot = dgeID("invenSlotImg" + slot);
  const invenAmtSlot = dgeID("invenSlotAmt" + slot);
  return { div: invenDivSlot, img: invenImgSlot, amt: invenAmtSlot };
}
function renderInven() {
  //hotbar
  for (let i = 0; i <= 8; i++) {
    if (player.inventory[i]) {
      if (
        player.inventory[i].amount == 0 ||
        player.inventory[i].item == "air"
      ) {
        hotbarAmt[i].textContent = "";
        hotbarImg[i].src =
          "./assets/textures/" + player.inventory[i].item + ".png";
      } else {
        hotbarAmt[i].textContent = player.inventory[i].amount;
        hotbarImg[i].src =
          "./assets/textures/" + player.inventory[i].item + ".png";
      }
    }
  }
  //inven
  for (let i = 0; i <= 35; i++) {
    if (player.inventory[i]) {
      if (
        player.inventory[i].amount == 0 ||
        player.inventory[i].item == "air"
      ) {
        getInvenElement(i).amt.textContent = "";
        getInvenElement(i).img.src =
          "./assets/textures/" + player.inventory[i].item + ".png";
      } else {
        getInvenElement(i).amt.textContent = player.inventory[i].amount;
        getInvenElement(i).img.src =
          "./assets/textures/" + player.inventory[i].item + ".png";
      }
    }
  }

  // selectedInCursor
  if (player.itemHoldingInCursor) {
    dgeID("inventoryHeldInCursorItem").hidden = false;
    dgeID("inventoryHeldInCursorItemImg").src =
      "./assets/textures/" + player.itemHoldingInCursor.item + ".png";
    dgeID("inventoryHeldInCursorItemAmt").textContent =
      player.itemHoldingInCursor.amount;
  } else {
    dgeID("inventoryHeldInCursorItem").hidden = true;
  }
}
document.addEventListener("invenEvent", renderInven);

// inventory moving stuff
for (let i = 0; i <= 35; i++) {
  getInvenElement(i).div.addEventListener("click", (e) => {
    e.currentTarget.blur();
    if (player.inventory[i]) {
      if (
        player.inventory[i].item != "air" &&
        !player.itemHoldingInCursor &&
        !keyIsDown("ShiftLeft")
      ) {
        const ewafad = { ...player.inventory[i] };

        player.itemHoldingInCursor = ewafad;

        player.inventory[i].amount = 0;
        player.inventory[i].item = "air";
        document.dispatchEvent(invenEvent);
      } else if (
        player.inventory[i].item == "air" &&
        player.itemHoldingInCursor &&
        !keyIsDown("ShiftLeft")
      ) {
        player.inventory[i].amount = player.itemHoldingInCursor.amount;
        player.inventory[i].item = player.itemHoldingInCursor.item;
        player.itemHoldingInCursor = undefined;
        document.dispatchEvent(invenEvent);
      } else if (
        player.inventory[i].item != "air" &&
        player.itemHoldingInCursor &&
        player.inventory[i].item != player.itemHoldingInCursor.item &&
        !keyIsDown("ShiftLeft")
      ) {
        const oldOne = { ...player.itemHoldingInCursor };
        const newOne = { ...player.inventory[i] };
        player.itemHoldingInCursor = newOne;

        player.inventory[i].amount = oldOne.amount;
        player.inventory[i].item = oldOne.item;
        document.dispatchEvent(invenEvent);
      } else if (
        player.inventory[i].item != "air" &&
        player.itemHoldingInCursor &&
        player.inventory[i].item == player.itemHoldingInCursor.item &&
        player.inventory[i].amount + player.itemHoldingInCursor.amount <=
          thingMetaData[player.inventory[i].item].maxStack &&
        !keyIsDown("ShiftLeft")
      ) {
        const oldOne = { ...player.itemHoldingInCursor };

        player.inventory[i].amount += oldOne.amount;
        player.itemHoldingInCursor = undefined;
        document.dispatchEvent(invenEvent);
      } else if (player.inventory[i].item != "air" && keyIsDown("ShiftLeft")) {
        if (i > 8) {
          // not in hotbar

          const newOne = { ...player.inventory[i] };
          let found = false;
          for (let e = 0; e <= 8; e++) {
            if (
              player.getSlot(e).item == player.inventory[i].item &&
              player.getSlot(e).amount + player.inventory[i].amount <=
                thingMetaData[player.inventory[i].item].maxStack
            ) {
              player.inventory[i].amount = 0;
              player.inventory[i].item = "air";
              player.setSlot(
                newOne.item,
                newOne.amount + player.getSlot(e).amount,
                e,
              );
              found = true;
              break;
            }
          }
          if (!found) {
            for (let e = 0; e <= 8; e++) {
              if (!player.getSlot(e) || player.getSlot(e).amount == 0) {
                player.inventory[i].amount = 0;
                player.inventory[i].item = "air";
                player.setSlot(newOne.item, newOne.amount, e);

                break;
              }
            }
          }
        } else if (i <= 8) {
          // in hotbar

          const newOne = { ...player.inventory[i] };
          let found = false;
          for (let e = 35; e > 8; e -= 1) {
            if (
              player.getSlot(e).item == player.inventory[i].item &&
              player.getSlot(e).amount + player.inventory[i].amount <=
                thingMetaData[player.inventory[i].item].maxStack
            ) {
              player.inventory[i].amount = 0;
              player.inventory[i].item = "air";
              player.setSlot(
                newOne.item,
                newOne.amount + player.getSlot(e).amount,
                e,
              );
              found = true;
              break;
            }
          }
          if (!found) {
            for (let e = 35; e > 8; e -= 1) {
              if (!player.getSlot(e) || player.getSlot(e).amount == 0) {
                player.inventory[i].amount = 0;
                player.inventory[i].item = "air";
                player.setSlot(newOne.item, newOne.amount, e);

                break;
              }
            }
          }
        }
      }
    }
  });
  getInvenElement(i).div.addEventListener("auxclick", () => {
    if (player.inventory[i]) {
      if (
        player.inventory[i].item != "air" &&
        !player.itemHoldingInCursor &&
        !keyIsDown("ShiftLeft") &&
        player.inventory[i].amount > 1
      ) {
        let ewafad = { ...player.inventory[i] };
        ewafad.amount = Math.ceil(ewafad.amount / 2);
        player.itemHoldingInCursor = ewafad;

        player.inventory[i].amount = Math.floor(player.inventory[i].amount / 2);

        document.dispatchEvent(invenEvent);
      } else if (
        player.inventory[i].item != "air" &&
        !player.itemHoldingInCursor &&
        !keyIsDown("ShiftLeft") &&
        player.inventory[i].amount <= 1
      ) {
        getInvenElement(i).div.click();
      } else if (
        player.inventory[i].item == "air" &&
        player.itemHoldingInCursor &&
        player.itemHoldingInCursor.amount > 1 &&
        !keyIsDown("ShiftLeft")
      ) {
        let ewafad = { ...player.itemHoldingInCursor };
        ewafad.amount = 1;

        player.itemHoldingInCursor.amount =
          player.itemHoldingInCursor.amount - 1;
        player.inventory[i].amount = ewafad.amount;
        player.inventory[i].item = ewafad.item;

        document.dispatchEvent(invenEvent);
      } else if (
        player.inventory[i].item == "air" &&
        player.itemHoldingInCursor &&
        player.itemHoldingInCursor.amount <= 1 &&
        !keyIsDown("ShiftLeft")
      ) {
        getInvenElement(i).div.click();
      } else if (
        player.inventory[i].item != "air" &&
        player.itemHoldingInCursor &&
        !keyIsDown("ShiftLeft")
      ) {
        const oldOne = { ...player.itemHoldingInCursor };
        const newOne = { ...player.inventory[i] };
        player.itemHoldingInCursor = newOne;

        player.inventory[i].amount = oldOne.amount;
        player.inventory[i].item = oldOne.item;
        document.dispatchEvent(invenEvent);
      } else if (player.inventory[i].item != "air" && keyIsDown("ShiftLeft")) {
        getInvenElement(i).div.click();
      }
    }
  });
  getInvenElement(i).div.addEventListener("mouseover", (e) => {
    player.hotbarSlotHoveredMouse = i;
  });
  getInvenElement(i).div.addEventListener("mouseleave", (e) => {
    player.hotbarSlotHoveredMouse = undefined;
  });
}

function fps() {
  fpsWaitForUpdate++;
  if (fpsWaitForUpdate >= 60) {
    dgeID("fpsShower").innerText = "FPS: " + Math.round(averageFPS);
    fpsWaitForUpdate = 0;
  }
}
let moveKeyAWerePressed = 0;
let moveKeyDWerePressed = 0;
function numkeysHotbarChange() {
  if (keyWasReleased("Digit1")) {
    player.switchInventoryItemToHotbarSlot(0);
  }
  if (keyWasReleased("Digit2")) {
    player.switchInventoryItemToHotbarSlot(1);
  }
  if (keyWasReleased("Digit3")) {
    player.switchInventoryItemToHotbarSlot(2);
  }
  if (keyWasReleased("Digit4")) {
    player.switchInventoryItemToHotbarSlot(3);
  }
  if (keyWasReleased("Digit5")) {
    player.switchInventoryItemToHotbarSlot(4);
  }
  if (keyWasReleased("Digit6")) {
    player.switchInventoryItemToHotbarSlot(5);
  }
  if (keyWasReleased("Digit7")) {
    player.switchInventoryItemToHotbarSlot(6);
  }
  if (keyWasReleased("Digit8")) {
    player.switchInventoryItemToHotbarSlot(7);
  }
  if (keyWasReleased("Digit9")) {
    player.switchInventoryItemToHotbarSlot(8);
  }
  if (keyWasReleased("KeyQ")) {
    if (creativeSlotHovered !== undefined) {
      const item = player.creativeInvenOrder[creativeSlotHovered];
      new droppedItem(
        item,
        player.coords.x,
        player.coords.y,
        thingMetaData[item].maxStack,
      );
    } else {
      const slotIndex =
        player.hotbarSlotHoveredMouse ?? player.hotbarSlotHovered;
      const inventorySlot = player.inventory[slotIndex];

      if (
        inventorySlot &&
        inventorySlot.item != "air" &&
        inventorySlot.amount > 0
      ) {
        const dropAmount = keyIsDown("ControlLeft") ? inventorySlot.amount : 1;
        const dropX = player.coords.x + (player.directionPositive ? 1.5 : -1.5);

        new droppedItem(inventorySlot.item, dropX, player.coords.y, dropAmount);

        inventorySlot.amount -= dropAmount;
        if (inventorySlot.amount <= 0) {
          inventorySlot.item = "air";
          inventorySlot.amount = 0;
        }
      }
    }

    document.dispatchEvent(invenEvent);
  }
  // sprinting detection
  moveKeyAWerePressed++;
  moveKeyDWerePressed++;

  if (keyWasReleased("KeyD")) {
    moveKeyDWerePressed = 0;
    player.running = false;
  }
  if (keyWasReleased("KeyA")) {
    moveKeyAWerePressed = 0;
    player.running = false;
  }
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
  if (!getPaused()) {
    const currentHotbarSlot = player.hotbarSlotHovered;
    let newHotbarSlot = mouseWheel + currentHotbarSlot;

    newHotbarSlot > 8 ? (newHotbarSlot = 0) : "why more";
    newHotbarSlot < 0 ? (newHotbarSlot = 8) : "why less";
    player.changeHotbarSlot(newHotbarSlot);
  }
}
function inventoryToggle() {
  if (keyWasPressed("KeyE") && isInGame) {
    if (
      invenDiv.className == "popCloseHide row" ||
      invenDiv.className == "visually-hidden"
    ) {
      invenDiv.className = "popAnim row";
      setPaused(true);
      backdropUI.hidden = false;
      currentPopup = invenDiv;
      player.hotbarSlotHoveredMouse = undefined;
    } else if (invenDiv.className == "popAnim row") {
      invenDiv.className = "popCloseHide row";
      setPaused(false);
      backdropUI.hidden = true;
      currentPopup = null;
      if (player.itemHoldingInCursor) {
        new droppedItem(
          player.itemHoldingInCursor.item,
          player.coords.x,
          player.coords.y,
          player.itemHoldingInCursor.amount,
        );
        player.itemHoldingInCursor = undefined;
        document.dispatchEvent(invenEvent);
      }
    }
  }
}
function mouseMoveWhileHoldingItem() {
  if (player.itemHoldingInCursor) {
    dgeID("inventoryHeldInCursorItem").style.top = mousePosScreen.y + "px";
    dgeID("inventoryHeldInCursorItem").style.left = mousePosScreen.x + "px";
  }
}

function gameUpdatePost() {
  fps();
  inventoryToggle();
  numkeysHotbarChange();
  mouseMoveWhileHoldingItem();
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
let blocks = {};
window.blocks = blocks;
let texture = {};
let toolTexture = {};
function loadImage(name, type = "block") {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      const textureInfo = new TextureInfo(img);
      if (type == "block") {
        texture[name] = new TileInfo(vec2(0, 0), vec2(8, 8), textureInfo);
      }
      resolve();
    };

    img.onerror = reject;
    img.src = "./assets/textures/" + name + ".png";
  });
}
const textureNames = [
  "air",
  "dirt",
  "grass",
  "sand",
  "snow",
  "stone",
  "bedrock",
  "coalOre",
  "copperOre",
  "ironOre",
  "goldOre",
  "diamondOre",
  "emeraldOre",
  "sugiliteOre",
  "coalBlock",
  "copperBlock",
  "ironBlock",
  "goldBlock",
  "diamondBlock",
  "emeraldBlock",
  "sugiliteBlock",
  "acatiaLog",
  "cedarLog",
  "jungleLog",
  "mapleLog",
  "poplarLog",
  "cedarPlanks",
  "maplePlanks",
  "mapleLeaf",
  "daisy",
  "redTulip",
  "chest",
  "furnaceOff",
  "furnaceOn",
  "rickRoll",
  "hoverFar",
  "hoverClose",
  "lantern",

  // tools grouped by material, then by tool type
  "woodAxe",
  "woodShovel",
  "woodPickaxe",
  "woodHoe",
  "woodSword",
  "stoneAxe",
  "stoneShovel",
  "stonePickaxe",
  "stoneHoe",
  "stoneSword",
  "copperAxe",
  "copperShovel",
  "copperPickaxe",
  "copperHoe",
  "copperSword",
  "ironAxe",
  "ironShovel",
  "ironPickaxe",
  "ironHoe",
  "ironSword",
  "goldAxe",
  "goldShovel",
  "goldPickaxe",
  "goldHoe",
  "goldSword",
  "diamondAxe",
  "diamondShovel",
  "diamondPickaxe",
  "diamondHoe",
  "diamondSword",
  "sugiliteAxe",
  "sugiliteShovel",
  "sugilitePickaxe",
  "sugiliteSword",
];

async function loadAllImages() {
  for (const name of textureNames) {
    await loadImage(name, "block");
  }

  console.log(
    "Loaded all textures! Proof: " +
      texture["grass"] +
      "(it should return imageObject or something like that)",
  );
}

let lightMap = {};
let averageLightLevel = 0;
const torchColor = rgb(0.95, 0.6, 0.2);
const surfaceColor = rgb(0.95, 0.95, 0.9);
const lightColor = rgb(0.85, 0.85, 0.82);
const midColor = rgb(0.7, 0.7, 0.65);
const midDarkColor = rgb(0.35, 0.35, 0.32);
const lowDarkColor = rgb(0.15, 0.15, 0.15);
const darkColor = rgb(0.01, 0.01, 0.01);
function calculateLightLevel() {
  let averageLightLevel = 0;

  const playerX = Math.round(player.coords.x);
  const playerY = Math.floor(player.coords.y + 0.5);
  const skyYLevel = 30;

  for (let x = playerX - 5; x <= playerX + 5; x++) {
    const rayCastResult = blockRayCast(x, skyYLevel, "down");

    if (!rayCastResult || rayCastResult.location.y < playerY) {
      averageLightLevel += 1;
      averageLightLevel -= rayCastResult.length / 70;
    }
  }

  const rayCastResult = blockRayCast(playerX, skyYLevel, "down");

  if (!rayCastResult || rayCastResult.location.y < playerY) {
    averageLightLevel += 2;
    averageLightLevel -= rayCastResult.length / 50;
  }

  lightMap = averageLightLevel / 5.5;

  // Reset for next calculation
  averageLightLevel = 0;
  if (player.playerHaloGlow != undefined) {
    player.playerHaloGlow?.destroy();
  }
  if (lightMap > 1.5) {
    player.screenLight.ambientColor = surfaceColor;
  }
  if (lightMap > 0.61 && lightMap <= 1.5) {
    player.screenLight.ambientColor = lightColor;
  }
  if (lightMap >= 0.5 && lightMap <= 0.61) {
    player.screenLight.ambientColor = midColor;
    player.playerHaloGlow = new Light(
      vec2(player.coords.x, player.coords.y + 0.2),
      2,
      new Color(0.85, 0.85, 0.75, 0.5),
      3,
    );
    player.playerHaloGlow.render();
  }

  if (lightMap < 0.5 && lightMap > 0.3) {
    player.screenLight.ambientColor = midDarkColor;
    player.playerHaloGlow = new Light(
      vec2(player.coords.x, player.coords.y + 0.2),
      2,
      new Color(0.85, 0.85, 0.75, 0.5),
      3,
    );
    player.playerHaloGlow.render();
  }
  if (lightMap <= 0.3 && lightMap > 0) {
    player.screenLight.ambientColor = lowDarkColor;
    player.playerHaloGlow = new Light(
      vec2(player.coords.x, player.coords.y + 0.2),
      2,
      new Color(0.85, 0.85, 0.75, 0.5),
      3,
    );
    player.playerHaloGlow.render();
  }
  if (lightMap <= 0) {
    player.screenLight.ambientColor = darkColor;
    player.playerHaloGlow = new Light(
      vec2(player.coords.x, player.coords.y + 0.2),
      2,
      new Color(0.85, 0.85, 0.75, 0.5),
      3,
    );
    player.playerHaloGlow.render();
  }
}
function getCollidableBlockTypeAt(x, y) {
  const blockType = blocks[`${x},${y}`];

  return blockType && thingMetaData[blockType].collision ? blockType : false;
}

function isCollidableBlockAt(x, y) {
  const blockType = blocks[`${x},${y}`];
  if (blockType) {
    return thingMetaData[blockType].collision || false;
  }
  return false;
}
function blockRayCast(startX, startY, dir) {
  if (dir == "up") {
    for (let i = startY + 1; i < startY + 100; i++) {
      if (isCollidableBlockAt(startX, i)) {
        return {
          collided: true,
          location: vec2(startX, i),
          length: i - startY,
        };
      }
    }
    return false;
  }

  if (dir == "down") {
    for (let i = startY - 1; i > startY - 100; i--) {
      if (isCollidableBlockAt(startX, i)) {
        return {
          collided: true,
          location: vec2(startX, i),
          length: startY - i,
        };
      }
    }
    return false;
  }

  if (dir == "left") {
    for (let i = startX - 1; i > startX - 100; i--) {
      if (isCollidableBlockAt(i, startY)) {
        return {
          collided: true,
          location: vec2(i, startY),
          length: startX - i,
        };
      }
    }
    return false;
  }
  if (dir == "right") {
    for (let i = startX + 1; i < startX + 100; i++) {
      if (isCollidableBlockAt(i, startY)) {
        return {
          collided: true,
          location: vec2(i, startY),
          length: i - startX,
        };
      }
    }
    return false;
  }
}
dgeID("getEverything").addEventListener("click", (e) => {
  e.currentTarget.blur();
  for (const i of textureNames) {
    new droppedItem(
      i,
      player.coords.x,
      player.coords.y,
      thingMetaData[i].maxStack,
    );
  }
});
let ctx;
let playerTextureImageSrc;
let playerTexture;
let playerImage = new Image();
let player;
let blockBreakTexture = new Image();
let blockBreakingTexture;
let drops = {};
let dropsShadowList = [];
function drawRickAstleyAt(x, y, rot = 0) {
  drawTile(vec2(x, y), vec2(0.25), texture["rickRoll"], WHITE, rot);
}
class droppedItem {
  constructor(item, posX, posY, amount = 1) {
    this.pos = vec2(posX, posY + 0.2);
    this.animationPosYOffset = 0;
    this.item = item;
    this.timeDropped = 0;
    this.dropIndex;
    this.amount = amount;
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
        }
      } else if (
        isCollidableBlockAt(
          Math.round(this.pos.x),
          Math.floor(this.pos.y + 0.22),
        )
      ) {
        this.animationPosYOffset = Math.sin(this.timeDropped) * 0.065;
      }
      if (
        !isCollidableBlockAt(
          Math.round(this.pos.x),
          Math.floor(this.pos.y + 0.42),
        )
      ) {
        drawTile(
          vec2(this.pos.x, this.pos.y + this.animationPosYOffset),
          vec2(0.35),
          texture[this.item],
        );
      }

      let elipsePosY = Math.round(this.pos.y * 100) / 100 - 0.44;

      elipsePosY = -90100011001000011;
      // find a block under

      if (
        dropsShadowList.indexOf(
          `${Math.round(this.pos.x)},${Math.floor(this.pos.y)}`,
        ) == -1
      ) {
        dropsShadowList.push(
          `${Math.round(this.pos.x)},${Math.floor(this.pos.y)}`,
        );
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

        if (
          !isCollidableBlockAt(
            Math.round(this.pos.x),
            Math.floor(this.pos.y + 0.42),
          )
        ) {
          drawEllipse(
            vec2(Math.round(this.pos.x * 100) / 100, elipsePosY),
            vec2(0.34, 0.08),
            new Color(0.2, 0.2, 0.2, 0.5),
          );
        }
      }
    } else {
      this.destroy();
    }
  }
  destroy() {
    let index = drops[`${this.pos.x},${this.pos.y}`].indexOf(this);
    if (index != -1) {
      drops[`${this.pos.x},${this.pos.y}`].splice(index, 1);

      if (drops[`${this.pos.x},${this.pos.y}`].length <= 0) {
        delete drops[`${this.pos.x},${this.pos.y}`];
      }
    }
  }
}
let worldName;
let worldDesc;
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

    playerImage.src = skinSrc;
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

  player = {
    running: false,
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
    attackAnim: false,
    hotbarSlotHoveredMouse: undefined,
    handItemAnimIndex: {
      idle: vec2(0.45, 0.05),
      walk: vec2(0.45, 0.1),
      fall: vec2(0.45, 1.65),
      raise2: vec2(0.85, 0.25),
      raise1: vec2(0.6, 0.05),
      break2: vec2(0.75, 1.4),
      break1: vec2(0.95, 1.4),
      crouch: vec2(0.4, -0.02),
    },

    handItemAnimRotateIndex: {
      idle: 0,
      walk: 0,
      fall: 0,
      raise1: -0.5,
      raise2: -1,
      break2: 0.2,
      break1: 0.85,
      crouch: 0,
    },
    handItemAnimRotateToolsIndex: {
      idle: 3.7,
      walk: 3.7,
      fall: 0.85,
      raise1: 2.7,
      raise2: 2.8,
      break2: 0.3,
      break1: 0.85,
      crouch: 3.7,
    },
    creativeInvenOrder: [],
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
    },
    itemHoldingInCursor: undefined,
    playerHaloGlow: undefined,
    screenLight: undefined,
    justLanded: false,

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
        player.getFeetCoords().x - 0.1,
        player.coords.y + 1.4,
      );
      const rightHeadCoords = vec2(
        player.getFeetCoords().x + 0.1,
        Math.floor(player.coords.y + 1.4),
      );

      return (
        getCollidableBlockTypeAt(
          Math.round(leftHeadCoords.x),
          Math.floor(leftHeadCoords.y),
        ) ||
        getCollidableBlockTypeAt(
          Math.round(rightHeadCoords.x),
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
        0.85
      ) {
        return isCollidableBlockAt(
          Math.ceil(player.coords.x),
          Math.floor(bottomRightCoords.y),
        );
      }
      return false;
    },
    isThereABlockAtBottomLeft: () => {
      const bottomRightCoords = player.getCoordsAt("bl");

      if (
        Math.abs(player.coords.x) -
          Math.abs(Math.floor(Math.abs(player.coords.x))) >
        0.05
      ) {
        return isCollidableBlockAt(
          Math.floor(player.coords.x),
          Math.floor(bottomRightCoords.y),
        );
      }
      return false;
    },
    isThereABlockAtTopRight: () => {
      const bottomRightCoords = player.getCoordsAt("tr");

      if (
        Math.abs(player.coords.x) -
          Math.abs(Math.floor(Math.abs(player.coords.x))) <
        0.85
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
        0.05
      ) {
        return isCollidableBlockAt(
          Math.floor(player.coords.x),
          Math.floor(player.coords.y + 0.5),
        );
      }
      return false;
    },
    isThereABlockAtMiddleRight: () => {
      const bottomRightCoords = player.getCoordsAt("br");

      if (
        Math.abs(player.coords.x) -
          Math.abs(Math.floor(Math.abs(player.coords.x))) <
        0.85
      ) {
        return isCollidableBlockAt(
          Math.ceil(player.coords.x),
          Math.floor(bottomRightCoords.y + 0.25),
        );
      }
      return false;
    },
    isThereABlockAtMiddleLeft: () => {
      const bottomRightCoords = player.getCoordsAt("bl");

      if (
        Math.abs(player.coords.x) -
          Math.abs(Math.floor(Math.abs(player.coords.x))) >
        0.05
      ) {
        return isCollidableBlockAt(
          Math.floor(player.coords.x),
          Math.floor(bottomRightCoords.y + 0.25),
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
      let playerWalkAnimChangeThreshold = 3;
      player.running
        ? (playerWalkAnimChangeThreshold = 1)
        : (playerWalkAnimChangeThreshold = 3);
      if (
        !player.isFalling &&
        player.isWalking &&
        !player.crouching &&
        player.animationChangeTimer > playerWalkAnimChangeThreshold
      ) {
        player.animation = "walk" + player.animationWalkingFrame;
        player.animationWalkingFrame = (player.animationWalkingFrame % 6) + 1;
        player.animationChangeTimer = 0;
        player.attackAnim = false;
      }
      if (
        !player.isFalling &&
        player.isWalking &&
        player.crouching &&
        !player.attackAnim &&
        player.animationChangeTimer > 16
      ) {
        player.attackAnim = false;
        if (player.animation == "crouchWalk") {
          player.animation = "crouch";
        } else {
          player.animation = "crouchWalk";
        }

        player.animationChangeTimer = 0;
      }

      if (
        player.attackAnim &&
        player.animationChangeTimer > 3 &&
        !player.isFalling
      ) {
        player.animationChangeTimer = 0;
        switch (player.animation) {
          case "raise2":
            player.animation = "break1";
            break;

          case "break1":
            player.animation = "raise1";

            break;
          case "raise1":
            player.animation = "idle";
            player.attackAnim = false;
            break;
          default:
            player.animation = "raise2";
            break;
        }
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
            thingMetaData[block].color1Class,
            thingMetaData[block].color2Class,
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
      let handRotTools = 0;
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
            handAnim = "raise1";
            break;
          case "raise2":
            handAnim = "raise2";
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
        handRotTools = player.handItemAnimRotateToolsIndex[handAnim];

        handRot = player.handItemAnimRotateIndex[handAnim];
        // hand item show
        if (player.directionPositive) {
          drawTile(
            vec2(
              player.coords.x + handPos.x,
              player.getFeetCoords().y + handPos.y,
            ),
            vec2(0.3),
            texture[player.inventory[player.hotbarSlotHovered].item],
            WHITE,
            thingMetaData[player.inventory[player.hotbarSlotHovered].item].tool
              ? handRotTools
              : handRot,
            !player.directionPositive,
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
            thingMetaData[player.inventory[player.hotbarSlotHovered].item].tool
              ? -handRotTools
              : -handRot,
            !player.directionPositive,
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
            thingMetaData[block].color1Class,
            thingMetaData[block].color2Class,
            CLEAR_WHITE,
            CLEAR_WHITE,
            0.1,
            0.1,
            0.1,
          );
          setTimeout(() => {
            fallParticle.destroy(true);
          }, 200);
          setTimeout(() => {
            player.justLanded = false;
          }, 32);
          player.isFalling = false;
          player.coords.y = Math.floor(player.getFeetCoords().y) + 1.5;
          player.justLanded = true;

          player.fallMultiplier = 1;
        }
      } else if (!player.isStandingOnBlock()) {
        // Fall physics

        if (!player.canFly && !player.jumping) {
          player.isFalling = true;
          if (player.fallMultiplier < 4.3) {
            player.fallMultiplier += 0.065;
          }
          player.coords.y -= 0.05 * player.fallMultiplier;
        }
      }

      if (
        !player.isWalking &&
        !player.isFalling &&
        !player.crouching &&
        !player.isBreakingBlock &&
        !player.lowerArms &&
        !player.attackAnim
      ) {
        player.animation = "idle";
      }
      if (
        !player.isWalking &&
        !player.isFalling &&
        player.crouching &&
        !player.isBreakingBlock
      ) {
        player.attackAnim = false;
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
        player.isFalling = true;
        player.jumpFrame = 1;
        player.jumpMultiplier = 1;
      }

      if (player.isFalling && !player.canFly) {
        player.animation = "fall";
        player.attackAnim = false;
      }
      if (player.jumping && player.canFly) {
        player.coords = player.coords.add(vec2(0, 0.175 * player.jumpMultiplier));
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
    isSlotEmpty: (slot) => {
      return !player.getSlot(slot) || player.getSlot(slot).item === "air";
    },
    isInvenFull: () => {
      for (let i = 0; i <= 35; i++) {
        if (!player.getSlot(i) || player.getSlot(i).amount === 0) {
          return false;
        }
      }
      return true;
    },
    playerCanPickUpItem: (item, amount) => {
      const itemMaxStack = thingMetaData[item].maxStack;
      let remainingAmount = amount;

      for (let i = 0; i <= 35; i++) {
        if (
          player.getSlot(i).item == item &&
          player.getSlot(i).amount < itemMaxStack
        ) {
          remainingAmount -= itemMaxStack - player.getSlot(i).amount;
        }
        if (remainingAmount <= 0) {
          return true;
        }
      }

      for (let i = 0; i <= 35; i++) {
        if (player.getSlot(i).item == "air") {
          remainingAmount -= itemMaxStack;
        }
        if (remainingAmount <= 0) {
          return true;
        }
      }

      return false;
    },
    addItem: (item, amount) => {
      const itemMaxStack = thingMetaData[item].maxStack;
      if (!player.playerCanPickUpItem(item, amount)) {
        return false;
      }

      let remainingAmount = amount;
      for (let i = 0; i <= 35 && remainingAmount > 0; i++) {
        const slot = player.getSlot(i);
        if (slot.item == item && slot.amount < itemMaxStack) {
          const amountToAdd = Math.min(
            remainingAmount,
            itemMaxStack - slot.amount,
          );
          player.setSlot(item, slot.amount + amountToAdd, i);
          remainingAmount -= amountToAdd;
        }
      }

      for (let i = 0; i <= 35 && remainingAmount > 0; i++) {
        if (player.getSlot(i).item == "air") {
          const amountToAdd = Math.min(remainingAmount, itemMaxStack);
          player.setSlot(item, amountToAdd, i);
          remainingAmount -= amountToAdd;
        }
      }

      return true;
    },
    changeHotbarSlot: (newHotbarSlot) => {
      if (hotbarSlot[newHotbarSlot]) {
        getInvenElement(player.hotbarSlotHovered).div.className = "invenSlot";
        hotbarSlot[player.hotbarSlotHovered].className = "slot";
        hotbarSlot[newHotbarSlot].className = "slot slotHover";
        getInvenElement(newHotbarSlot).div.className = "invenSlot slotHover";
        player.hotbarSlotHovered = newHotbarSlot;
      }
    },
    switchInventoryItemToHotbarSlot: (hotbarSlot) => {
      if (currentPopup == invenDiv) {
        if (player.hotbarSlotHoveredMouse) {
          const invenSlotStuff = {
            ...player.inventory[player.hotbarSlotHoveredMouse],
          };
          player.inventory[player.hotbarSlotHoveredMouse] =
            player.inventory[hotbarSlot];
          player.inventory[hotbarSlot] = invenSlotStuff;
          document.dispatchEvent(invenEvent);
        }

        if (creativeSlotHovered !== undefined) {
          if (typeof creativeSlotHovered === "number") {
            player.setSlot(
              player.creativeInvenOrder[creativeSlotHovered],
              thingMetaData[player.creativeInvenOrder[creativeSlotHovered]]
                .maxStack,
              hotbarSlot,
            );
          }
        }
      }
    },
    clearInventory: () => {
      for (let i = 0; i <= 35; i++) {
        player.inventory[i] = { item: "air", amount: 0 };
      }
      document.dispatchEvent(invenEvent);
    },
  };

  // creative inven

  for (let i = 0; i < textureNames.length; i++) {
    dgeID("creativeInven").innerHTML +=
      ` <div id = "creativeSlot${i}" class="creativeSlot" >
                  <img
                    draggable="false"
                    class="creativeSlotImg"
                    src="/assets/textures/${textureNames[i]}.png"
                    alt="inven slots"
                    
                  />
                </div>`;

    player.creativeInvenOrder.push(textureNames[i]);
  }

  for (let i = 0; i < player.creativeInvenOrder.length; i++) {
    const creativeSlot = document.getElementsByClassName("creativeSlot")[i];
    creativeSlot.addEventListener("click", (e) => {
      const item = player.creativeInvenOrder[i];
      console.log(item);

      if (item && !player.itemHoldingInCursor && !keyIsDown("ShiftLeft")) {
        player.itemHoldingInCursor = {
          item: item,
          amount: thingMetaData[item].maxStack,
        };
      } else if (
        item &&
        keyIsDown("ShiftLeft") &&
        !player.itemHoldingInCursor
      ) {
        new droppedItem(
          item,
          player.coords.x,
          player.coords.y,
          thingMetaData[item].maxStack,
        );
      } else if (item && player.itemHoldingInCursor) {
        new droppedItem(
          player.itemHoldingInCursor.item,
          player.coords.x + (player.directionPositive ? 1.5 : -1.5),
          player.coords.y,
          player.itemHoldingInCursor.amount,
        );
        player.itemHoldingInCursor = {
          item: item,
          amount: thingMetaData[item].maxStack,
        };
      }
      e.currentTarget.blur();
      document.dispatchEvent(invenEvent);
    });

    creativeSlot.addEventListener("mouseover", (e) => {
      creativeSlotHovered = i;
    });
    creativeSlot.addEventListener("mouseleave", (e) => {
      creativeSlotHovered = undefined;
    });
  }
  player.screenLight = new LightSystemPlugin(mainCanvasSize, surfaceColor);
  player.cameraToPlayer();
  document.addEventListener("createWorld", (event) => {
    gameId = localStorage.getItem("gameSaveTopId");
    console.log("Event received:", event.detail);
    const data = event.detail;
    worldName = data.worldName;
    worldDesc = data.worldDesc;
    backdropUI.click();
    mainMenuAudio.pause();
    document.getElementById("mainMenu").className = "popCloseHide";

    invenDiv.className = "visually-hidden";
    setPaused(false);
    isInGame = true;
    if (event.detail.worldType == "sandbox") {
      procedurallyGenerateWorld(Number(event.detail.worldSeed));
      player.coords = vec2(0, 10);
    } else if (event.detail.worldType == "flat") {
      createFlatWorld(Number(event.detail.worldSeed));

      player.coords = vec2(0, 5);
    }
  });
  console.log("Game engine initialized.");
  renderInven();
  window.player = player;
}
window.drops = drops;
for (let i = 0; i <= 8; i++) {
  hotbarSlot[i].addEventListener("click", (e) => {
    e.currentTarget.blur();
    player.changeHotbarSlot(i);
  });
}
let randomTickEvent = 0;

let threshHold = Math.floor(Math.random() * 2000) + 1500;
let lightUpdateEvent = 0;
function gameUpdate() {
  randomTickEvent += 1;
  lightUpdateEvent += 1;
  const xRangeLow = Math.floor(player.coords.x - 40);
  const yRangeLow = Math.floor(player.coords.y - 30);
  const xRangeHigh = Math.ceil(player.coords.x + 40);
  const yRangeHigh = Math.ceil(player.coords.y + 30);

  // randomTickEvents

  if (randomTickEvent > threshHold) {
    for (let x = xRangeLow; x <= xRangeHigh; x++) {
      for (let y = yRangeLow; y <= yRangeHigh; y++) {
        // change grass if it's dirt and change dirt to grass if grass next to it and sun
        let block = blocks[`${x},${y}`];
        if (block == "dirt") {
          if (
            !blockRayCast(x, y, "up") &&
            (blocks[`${x - 1},${y}`] == "grass" ||
              blocks[`${x + 1},${y}`] == "grass")
          ) {
            blocks[`${x},${y}`] = "grass";
          }
        } else if (block == "grass") {
          if (blockRayCast(x, y, "up")) {
            blocks[`${x},${y}`] = "dirt";
          }
        }
      }
      randomTickEvent = 0;
      threshHold = Math.floor(Math.random() * 2000) + 1500;
    }
  }

  if (lightUpdateEvent > 30) {
    calculateLightLevel();
  }
}

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
let mouseWasDown = false;
let halfWidth;
let halfHeight;

let startX;
let endX;

let startY;
let endY;

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
  // sky
  drawRectGradient(
    cameraPos,
    vec2(Math.ceil(window.innerWidth / 75), Math.ceil(window.innerHeight / 80)),
    new Color().setHex("#5DB8FF"),
    new Color().setHex("#CFF4FF"),
    0,
  );
};
const mouseThings = () => {
  const blockMousePos = vec2(Math.round(mousePos.x), Math.round(mousePos.y));
  let blockType = blocks[`${blockMousePos.x},${blockMousePos.y}`];

  if (mouseIsDown(0)) {
    mouseWasDown = true;
  }
  if (
    !getPaused() &&
    document.elementFromPoint(mousePosScreen.x, mousePosScreen.y) ===
      document.getElementById("ui")
  ) {
    const diff = blockMousePos.subtract(player.coords);

    const diffAbs = diff.abs();
    // break blocks
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

      if (blockType == undefined) {
        blockType = "Air";
      }

      if (mouseIsDown(0) && blockType != "Air") {
        let toolBoost = 1;
        const heldItem = player.getSlot(player.hotbarSlotHovered).item;
        let heldToolType = thingMetaData[heldItem].toolType;

        if (
          thingMetaData[heldItem].tool &&
          thingMetaData[blockType].mineWithTool == heldToolType
        ) {
          // tool boost metadata
          const toolBoostData = {
            wood: 1.9,
            stone: 2.5,
            iron: 3.7,
            diamond: 6.5,
            gold: 4,
            copper: 3.3,
            sugilite: 167.6,
          };

          toolBoost = toolBoostData[thingMetaData[heldItem].toolMaterial];
        }

        mouseWasDown = false;
        if (
          blockBreakNoSpam >
          (12 * thingMetaData[blockType]["breakTime"] || -1) / toolBoost
        ) {
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
            thingMetaData[blockType || "Air"].color1Class,
            thingMetaData[blockType || "Air"].color2Class,
            CLEAR_WHITE,
            CLEAR_WHITE,
            0.1,
            0.1,
            0.1,
          );
          if (thingMetaData[blockType].dropIfWrongTool) {
            new droppedItem(blockType, blockMousePos.x, blockMousePos.y);
          } else if (thingMetaData[blockType].mineWithTool == heldToolType) {
            new droppedItem(blockType, blockMousePos.x, blockMousePos.y);
          }
          setTimeout(() => {
            breakParticle.destroy(true);
          }, 200);
          mouseWasDown = false;
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
        if (mouseIsDown(0) && blockType != "Air" && player.isWalking) {
        }
        if (mouseIsDown(0) && blockType == "Air" && player.isBreakingBlock) {
          blockBreakNoSpam = 0;
          blockBreak = 0;
          player.isBreakingBlock = false;
          player.raisedArms = false;
          player.lowerArms = true;
          mouseWasDown = false;
        }
      }
      if (mouseWasDown && !mouseIsDown(0) && !player.isBreakingBlock) {
        mouseWasDown = false;
        player.attackAnim = true;
      }
      // place blocks
      let allowed = false;
      if (
        mouseIsDown(2) &&
        !blocks[`${blockMousePos.x},${blockMousePos.y}`] &&
        player.getSlot(player.hotbarSlotHovered).item != "air" &&
        thingMetaData[player.getSlot(player.hotbarSlotHovered).item].block
      ) {
        if (
          !thingMetaData[player.getSlot(player.hotbarSlotHovered).item]
            .collision &&
          (blocks[`${blockMousePos.x},${blockMousePos.y + 1}`] ||
            blocks[`${blockMousePos.x},${blockMousePos.y - 1}`] ||
            blocks[`${blockMousePos.x + 1},${blockMousePos.y}`] ||
            blocks[`${blockMousePos.x - 1},${blockMousePos.y}`])
        ) {
          allowed = true;
        } else {
          if (
            (blocks[`${blockMousePos.x},${blockMousePos.y + 1}`] ||
              blocks[`${blockMousePos.x},${blockMousePos.y - 1}`] ||
              blocks[`${blockMousePos.x + 1},${blockMousePos.y}`] ||
              blocks[`${blockMousePos.x - 1},${blockMousePos.y}`]) &&
            ((Math.abs(
              Math.round(player.getCoordsAt("br").x) - blockMousePos.x,
            ) != 0 &&
              Math.abs(
                Math.round(player.getCoordsAt("bl").x) - blockMousePos.x,
              ) != 0) ||
              (Math.round(player.coords.y) - blockMousePos.y != 0 &&
                Math.round(player.coords.y) - blockMousePos.y != 1))
          ) {
            allowed = true;
          }
        }

        if (allowed) {
          player.attackAnim = true;
          createBlock(
            blockMousePos.x,
            blockMousePos.y,
            player.getSlot(player.hotbarSlotHovered).item,
          );
          if (player.getSlot(player.hotbarSlotHovered).amount - 1 != 0) {
            player.setSlot(
              player.getSlot(player.hotbarSlotHovered).item,
              player.getSlot(player.hotbarSlotHovered).amount - 1,
              player.hotbarSlotHovered,
            );
          } else {
            player.setSlot("air", 0, player.hotbarSlotHovered);
          }
        }
      }
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
  dropsShadowList = [];
  if (Object.keys(drops).length > 0) {
    for (const i of Object.values(drops)) {
      dropCoords = Object.keys(drops)
        .find((key) => drops[key] === i)
        .split(",");

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
            (Math.abs(player.getFeetCoords().y - 0.1 - dropCoordsY) < 0.6 ||
              Math.abs(player.coords.y + 0.3 - dropCoordsY) < 1)
          ) {
            if (player.playerCanPickUpItem(i[e].item, i[e].amount)) {
              player.addItem(i[e].item, i[e].amount);
              i[e].destroy();
            } else {
              i[e].draw();
            }
          } else {
            i[e].draw();
          }
        }
      }
    }
  }
};
function moveSideways(direction) {
  player.isWalking = true;
  // collision checks
  if (direction == "r") {
    if (
      player.isThereABlockAtBottomRight() ||
      player.isThereABlockAtTopRight() ||
      player.isThereABlockAtMiddleRight()
    ) {
      player.isWalking = false;
    } else {
      player.isWalking = true;
    }
  } else if (direction == "l") {
    if (
      player.isThereABlockAtBottomLeft() ||
      player.isThereABlockAtTopLeft() ||
      player.isThereABlockAtMiddleLeft()
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
          !isCollidableBlockAt(
            Math.ceil(player.getCoordsAt("bl").x - 0.4),
            Math.floor(player.getFeetCoords().y - 0.2),
          )
        ) {
          if (
            !isCollidableBlockAt(
              Math.ceil(player.getCoordsAt("br").x),
              Math.floor(player.getFeetCoords().y - 0.2),
            )
          ) {
            player.isWalking = false;
          }
          if (player.isFalling) {
            player.isWalking = true;
          }
        }
      } else if (direction == "l") {
        if (
          !isCollidableBlockAt(
            Math.floor(player.getCoordsAt("br").x + 0.4),
            Math.floor(player.getFeetCoords().y - 0.2),
          )
        ) {
          if (
            !isCollidableBlockAt(
              Math.floor(player.getCoordsAt("bl").x),
              Math.floor(player.getFeetCoords().y - 0.2),
            )
          ) {
            player.isWalking = false;
          }
          if (player.isFalling) {
            player.isWalking = true;
          }
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
      if (
        (moveKeyAWerePressed < 7 && direction == "l") ||
        (moveKeyDWerePressed < 7 && direction == "r")
      ) {
        player.running = true;
      }

      if (player.running) {
        direction == "r"
          ? (player.coords = player.coords.add(vec2(0.14, 0)))
          : (player.coords = player.coords.add(vec2(-0.14, 0)));
      } else {
        direction == "r"
          ? (player.coords = player.coords.add(vec2(0.08, 0)))
          : (player.coords = player.coords.add(vec2(-0.08, 0)));
      }
    }
  }
}
async function gameRender() {
  halfWidth = mainCanvas.width / cameraScale / 2;
  halfHeight = mainCanvas.height / cameraScale / 2;

  startX = Math.floor(cameraPos.x - halfWidth) - 1;
  endX = Math.ceil(cameraPos.x + halfWidth) + 1;

  startY = Math.floor(cameraPos.y - halfHeight) - 1;
  endY = Math.ceil(cameraPos.y + halfHeight) + 1;

  renderSky();

  renderBlocks();
  renderDrops();
  mouseThings();
  player.calculatePlayerPhysics();

  player.drawPlayer();

  player.cameraToPlayer();

  player.isWalking = false;
  player.crouching = false;

  if (!getPaused()) {
    if (
      (keyIsDown("ArrowUp") || keyIsDown("Space")) &&
      !player.isFalling &&
      !player.justLanded
    ) {
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
}

function destroyBlock(x, y) {
  if (worldLights[`${x},${y}`]) {
    worldLights[`${x},${y}`].destroy();
  }
  if (blocks[`${x},${y}`]) {
    delete blocks[`${x},${y}`];
  }
}
function createBlock(x, y, blockType) {
  // check if block already exist
  if (blocks[`${x},${y}`]) {
    return;
  } else {
    if (blockType == "lantern") {
      const light = new Light(
        vec2(x, y),
        8,
        new Color(248 / 255, 199 / 255, 100 / 255),
        15,
      );
      worldLights[`${x},${y}`] = light;
    }

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
let chunks = {
  0: {
    biome: "plains",
    chunkEdited: false,
  },
};
// can also be used for idk.. tools
let thingMetaData = {
  lantern: {
    breakTime: 0.1,
    tool: "hands",
    collision: false,
    translucent: false,
    liquid: false,
    block: true,
    color1: "#F5E6C4",
    color1Class: new Color(0.961, 0.902, 0.769),
    color2: "#D9B382",
    color2Class: new Color(0.851, 0.702, 0.51),
    utility: false,
    tool: false,
    item: false,
    maxStack: 64,
    dropIfWrongTool: true,
  },
  daisy: {
    breakTime: 0.1,
    tool: "hands",
    collision: false,
    translucent: false,
    liquid: false,
    block: true,
    color1: "#FFFFFF",
    color1Class: new Color(1, 1, 1),
    color2: "#F0F0F0",
    color2Class: new Color(0.941, 0.941, 0.941),
    utility: false,
    tool: false,
    item: false,
    maxStack: 64,
    dropIfWrongTool: true,
  },
  redTulip: {
    breakTime: 0.1,
    tool: "hands",
    collision: false,
    translucent: false,
    liquid: false,
    block: true,
    color1: "#da1717",
    color1Class: new Color(1, 0, 0),
    color2: "#00ff51",
    color2Class: new Color(0, 0.941),
    utility: false,
    tool: false,
    item: false,
    maxStack: 64,
    dropIfWrongTool: true,
  },
  undefined: {
    breakTime: -1,
    tool: "hands",
    collision: false,
    translucent: true,
    liquid: false,
    color1: "#239d2d00",
    color1Class: new Color(0.137, 0.616, 0.176, 0),
    color2: "#1b7f2300",
    color2Class: new Color(0.106, 0.498, 0.141, 0),
    utility: false,
    block: false,
    tool: false,
    item: true,
    maxStack: 1,
    dropIfWrongTool: false,
  },
  air: {
    breakTime: -1,
    tool: "hands",
    collision: false,
    translucent: true,
    liquid: false,
    color1: "#239d2d00",
    color1Class: new Color(0.137, 0.616, 0.176, 0),
    color2: "#1b7f2300",
    color2Class: new Color(0.106, 0.498, 0.141, 0),
    utility: false,
    block: false,
    tool: false,
    item: true,
    maxStack: 64,
    dropIfWrongTool: true,
  },
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
    utility: false,
    block: false,
    tool: false,
    item: true,
    maxStack: 64,
    dropIfWrongTool: true,
  },
  cedarLog: {
    breakTime: 1.5,
    mineWithTool: "axe",
    collision: false,
    translucent: false,
    liquid: false,
    color1: "#8B5E3C",
    color1Class: new Color(139 / 255, 94 / 255, 60 / 255),
    color2: "#4F2F1F",
    color2Class: new Color(79 / 255, 47 / 255, 31 / 255),
    utility: false,
    block: true,
    tool: false,
    item: false,
    maxStack: 64,
    dropIfWrongTool: true,
  },
  coalBlock: {
    breakTime: 3.1,
    mineWithTool: "pickaxe",
    collision: true,
    translucent: false,
    liquid: false,
    color1: "#2A2A2A",
    color1Class: new Color(42 / 255, 42 / 255, 42 / 255),
    color2: "#0E0E0E",
    color2Class: new Color(14 / 255, 14 / 255, 14 / 255),
    utility: false,
    block: true,
    tool: false,
    item: false,
    maxStack: 64,
    dropIfWrongTool: false,
  },
  coalOre: {
    breakTime: 3.1,
    mineWithTool: "pickaxe",
    collision: true,
    translucent: false,
    liquid: false,
    color1: "#545454",
    color1Class: new Color(0.329, 0.329, 0.329, 1),
    color2: "#0E0E0E",
    color2Class: new Color(14 / 255, 14 / 255, 14 / 255),
    utility: false,
    block: true,
    tool: false,
    item: false,
    maxStack: 64,
    dropIfWrongTool: false,
  },
  copperBlock: {
    breakTime: 2.8,
    mineWithTool: "pickaxe",
    collision: true,
    translucent: false,
    liquid: false,
    color1: "#D2875B",
    color1Class: new Color(210 / 255, 135 / 255, 91 / 255),
    color2: "#7E3F1F",
    color2Class: new Color(126 / 255, 63 / 255, 31 / 255),
    utility: false,
    block: true,
    tool: false,
    item: false,
    maxStack: 64,
    dropIfWrongTool: false,
  },
  copperOre: {
    breakTime: 2.8,
    mineWithTool: "pickaxe",
    collision: true,
    translucent: false,
    liquid: false,
    color1: "#B77E5E",
    color1Class: new Color(183 / 255, 126 / 255, 94 / 255),
    color2: "#6E421D",
    color2Class: new Color(110 / 255, 66 / 255, 29 / 255),
    utility: false,
    block: true,
    tool: false,
    item: false,
    maxStack: 64,
    dropIfWrongTool: false,
  },
  diamondBlock: {
    breakTime: 4,
    mineWithTool: "pickaxe",
    collision: true,
    translucent: false,
    liquid: false,
    color1: "#75E9FF",
    color1Class: new Color(117 / 255, 233 / 255, 255 / 255),
    color2: "#1B6B9C",
    color2Class: new Color(27 / 255, 107 / 255, 156 / 255),
    utility: false,
    block: true,
    tool: false,
    item: false,
    maxStack: 64,
    dropIfWrongTool: false,
  },
  diamondOre: {
    breakTime: 4,
    mineWithTool: "pickaxe",
    collision: true,
    translucent: false,
    liquid: false,
    color1: "#73D9FF",
    color1Class: new Color(115 / 255, 217 / 255, 255 / 255),
    color2: "#1F5C7A",
    color2Class: new Color(31 / 255, 92 / 255, 122 / 255),
    utility: false,
    block: true,
    tool: false,
    item: false,
    maxStack: 64,
    dropIfWrongTool: false,
  },
  dirt: {
    breakTime: 1,
    mineWithTool: "shovel",
    collision: true,
    translucent: false,
    liquid: false,
    color1: "#593F2D",
    color1Class: new Color(0.349, 0.247, 0.176, 1),
    color2: "#493323",
    color2Class: new Color(0.286, 0.2, 0.137, 1),
    utility: false,
    block: true,
    tool: false,
    item: false,
    maxStack: 64,
    dropIfWrongTool: true,
  },
  sand: {
    breakTime: 1,
    mineWithTool: "shovel",
    collision: true,
    translucent: false,
    liquid: false,
    color1: "#bdc13c",
    color1Class: new Color(1, 1, 0.176, 1),
    color2: "#ebfe37",
    color2Class: new Color(1, 1, 0.137, 1),
    utility: false,
    block: true,
    tool: false,
    item: false,
    maxStack: 64,
    dropIfWrongTool: true,
  },
  emeraldBlock: {
    breakTime: 4,
    mineWithTool: "pickaxe",
    collision: true,
    translucent: false,
    liquid: false,
    color1: "#8BFFB1",
    color1Class: new Color(139 / 255, 255 / 255, 177 / 255),
    color2: "#1B7C40",
    color2Class: new Color(27 / 255, 124 / 255, 64 / 255),
    utility: false,
    block: true,
    tool: false,
    item: false,
    maxStack: 64,
    dropIfWrongTool: false,
  },
  emeraldOre: {
    breakTime: 4,
    mineWithTool: "pickaxe",
    collision: true,
    translucent: false,
    liquid: false,
    color1: "#82E9B2",
    color1Class: new Color(130 / 255, 233 / 255, 178 / 255),
    color2: "#1A6D39",
    color2Class: new Color(26 / 255, 109 / 255, 57 / 255),
    utility: false,
    block: true,
    tool: false,
    item: false,
    maxStack: 64,
    dropIfWrongTool: false,
  },
  goldBlock: {
    breakTime: 3.2,
    mineWithTool: "pickaxe",
    collision: true,
    translucent: false,
    liquid: false,
    color1: "#FFD66E",
    color1Class: new Color(255 / 255, 214 / 255, 110 / 255),
    color2: "#8B6A00",
    color2Class: new Color(139 / 255, 106 / 255, 0),
    utility: false,
    block: true,
    tool: false,
    item: false,
    maxStack: 64,
    dropIfWrongTool: false,
  },
  goldOre: {
    breakTime: 3.2,
    mineWithTool: "pickaxe",
    collision: true,
    translucent: false,
    liquid: false,
    color1: "#E7C96A",
    color1Class: new Color(231 / 255, 201 / 255, 106 / 255),
    color2: "#7B5E00",
    color2Class: new Color(123 / 255, 94 / 255, 0),
    utility: false,
    block: true,
    tool: false,
    item: false,
    maxStack: 64,
    dropIfWrongTool: true,
  },
  grass: {
    breakTime: 1,
    mineWithTool: "shovel",
    collision: true,
    translucent: false,
    liquid: false,
    color1: "#239d2d",
    color1Class: new Color(0.137, 0.616, 0.176, 1),
    color2: "#1b7f24",
    color2Class: new Color(0.106, 0.498, 0.141, 1),
    utility: false,
    block: true,
    tool: false,
    item: false,
    maxStack: 64,
    dropIfWrongTool: true,
  },
  ironBlock: {
    breakTime: 3,
    mineWithTool: "pickaxe",
    collision: true,
    translucent: false,
    liquid: false,
    color1: "#D6D6D6",
    color1Class: new Color(214 / 255, 214 / 255, 214 / 255),
    color2: "#7A7A7A",
    color2Class: new Color(122 / 255, 122 / 255, 122 / 255),
    utility: false,
    block: true,
    tool: false,
    item: false,
    maxStack: 64,
    dropIfWrongTool: false,
  },
  ironOre: {
    breakTime: 3,
    mineWithTool: "pickaxe",
    collision: true,
    translucent: false,
    liquid: false,
    color1: "#B4B4B4",
    color1Class: new Color(180 / 255, 180 / 255, 180 / 255),
    color2: "#656565",
    color2Class: new Color(101 / 255, 101 / 255, 101 / 255),
    utility: false,
    block: true,
    tool: false,
    item: false,
    maxStack: 64,
    dropIfWrongTool: true,
  },
  jungleLog: {
    breakTime: 1.5,
    mineWithTool: "axe",
    collision: false,
    translucent: false,
    liquid: false,
    color1: "#7D4D2A",
    color1Class: new Color(125 / 255, 77 / 255, 42 / 255),
    color2: "#472B1A",
    color2Class: new Color(71 / 255, 43 / 255, 26 / 255),
    utility: false,
    block: true,
    tool: false,
    item: false,
    maxStack: 64,
    dropIfWrongTool: true,
  },
  mapleLog: {
    breakTime: 1.5,
    mineWithTool: "axe",
    collision: false,
    translucent: false,
    liquid: false,
    color1: "#634A2E",
    color1Class: new Color(0.388, 0.29, 0.18, 1),
    color2: "#503C25",
    color2Class: new Color(0.314, 0.235, 0.145, 1),
    utility: false,
    block: true,
    tool: false,
    item: false,
    maxStack: 64,
    dropIfWrongTool: true,
  },
  mapleLeaf: {
    breakTime: 0.25,
    mineWithTool: "hoe",
    collision: false,
    translucent: false,
    liquid: false,
    color1: "#48834C",
    color1Class: new Color(0.282, 0.514, 0.298, 1),
    color2: "#396A3D",
    color2Class: new Color(0.224, 0.416, 0.239, 1),
    utility: false,
    block: true,
    tool: false,
    item: false,
    maxStack: 64,
    dropIfWrongTool: true,
  },
  snow: {
    breakTime: 0.8,
    mineWithTool: "shovel",
    collision: true,
    translucent: false,
    liquid: false,
    color1: "#FFFFFF",
    color1Class: new Color(1, 1, 1, 1),
    color2: "#e0e0e0",
    color2Class: new Color(0.878, 0.878, 0.878, 1),
    utility: false,
    block: true,
    tool: false,
    item: false,
    maxStack: 64,
    dropIfWrongTool: true,
  },
  cedarPlanks: {
    breakTime: 1.5,
    mineWithTool: "axe",
    collision: true,
    translucent: false,
    liquid: false,
    color1: "#A67C52",
    color1Class: new Color(0.651, 0.486, 0.322, 1),
    color2: "#7B5A3C",
    color2Class: new Color(0.482, 0.353, 0.235, 1),
    utility: false,
    block: true,
    tool: false,
    item: false,
    maxStack: 64,
    dropIfWrongTool: true,
  },
  maplePlanks: {
    breakTime: 1.5,
    mineWithTool: "axe",
    collision: true,
    translucent: false,
    liquid: false,
    color1: "#8B5E3C",
    color1Class: new Color(0.545, 0.369, 0.235, 1),
    color2: "#5C3A21",
    color2Class: new Color(0.361, 0.227, 0.129, 1),
    utility: false,
    block: true,
    tool: false,
    item: false,
    maxStack: 64,
    dropIfWrongTool: true,
  },
  poplarLog: {
    breakTime: 1.5,
    mineWithTool: "axe",
    collision: false,
    translucent: false,
    liquid: false,
    color1: "#9C6B3B",
    color1Class: new Color(156 / 255, 107 / 255, 59 / 255),
    color2: "#56351E",
    color2Class: new Color(86 / 255, 53 / 255, 30 / 255),
    utility: false,
    block: true,
    tool: false,
    item: false,
    maxStack: 64,
    dropIfWrongTool: true,
  },
  stone: {
    breakTime: 3,
    mineWithTool: "pickaxe",
    collision: true,
    translucent: false,
    liquid: false,
    color1: "#545454",
    color1Class: new Color(0.329, 0.329, 0.329, 1),
    color2: "#464646",
    color2Class: new Color(0.275, 0.275, 0.275, 1),
    utility: false,
    block: true,
    tool: false,
    item: false,
    maxStack: 64,
    dropIfWrongTool: false,
  },
  sugiliteBlock: {
    breakTime: 4.5,
    mineWithTool: "pickaxe",
    collision: true,
    translucent: false,
    liquid: false,
    color1: "#D3A7FF",
    color1Class: new Color(211 / 255, 167 / 255, 255 / 255),
    color2: "#5D2E8E",
    color2Class: new Color(93 / 255, 46 / 255, 142 / 255),
    utility: false,
    block: true,
    tool: false,
    item: false,
    maxStack: 64,
    dropIfWrongTool: false,
  },
  sugiliteOre: {
    breakTime: 4.5,
    mineWithTool: "pickaxe",
    collision: true,
    translucent: false,
    liquid: false,
    color1: "#C18FFF",
    color1Class: new Color(193 / 255, 143 / 255, 255 / 255),
    color2: "#4D2E77",
    color2Class: new Color(77 / 255, 46 / 255, 119 / 255),
    utility: false,
    block: true,
    tool: false,
    item: false,
    maxStack: 64,
    dropIfWrongTool: true,
  },
  bedrock: {
    breakTime: Infinity,
    mineWithTool: "hands",
    collision: true,
    translucent: false,
    liquid: false,
    color1: "#5e5b5e",
    color1Class: new Color(0.369, 0.357, 0.369, 1),
    color2: "#4d4a4d",
    color2Class: new Color(0.302, 0.29, 0.302, 1),
    utility: false,
    block: true,
    tool: false,
    item: false,
    maxStack: 64,
    dropIfWrongTool: true,
  },
  rickRoll: {
    breakTime: undefined,
    mineWithTool: "hands",
    collision: false,
    translucent: false,
    liquid: false,
    color1: "#FFFFFF",
    color1Class: new Color(1, 1, 1),
    color2: "#D0D0D0",
    color2Class: new Color(0.82, 0.82, 0.82),
    utility: false,
    block: false,
    tool: false,
    item: false,
    maxStack: 1,
    dropIfWrongTool: true,
  },
  hoverFar: {
    breakTime: undefined,
    mineWithTool: "hands",
    collision: false,
    translucent: false,
    liquid: false,
    color1: "#FFFFFF",
    color1Class: new Color(1, 1, 1),
    color2: "#D0D0D0",
    color2Class: new Color(0.82, 0.82, 0.82),
    utility: false,
    block: false,
    tool: false,
    item: false,
    maxStack: 1,
    dropIfWrongTool: true,
  },
  hoverClose: {
    breakTime: undefined,
    mineWithTool: "hands",
    collision: false,
    translucent: false,
    liquid: false,
    color1: "#FFFFFF",
    color1Class: new Color(1, 1, 1),
    color2: "#D0D0D0",
    color2Class: new Color(0.82, 0.82, 0.82),
    utility: false,
    block: false,
    tool: false,
    item: false,
    maxStack: 1,
    dropIfWrongTool: true,
  },
  chest: {
    breakTime: 1.5,
    mineWithTool: "axe",
    collision: false,
    translucent: false,
    liquid: false,
    color1: "#A07948",
    color1Class: new Color(160 / 255, 121 / 255, 72 / 255),
    color2: "#28201A",
    color2Class: new Color(40 / 255, 32 / 255, 26 / 255),
    utility: true,
    block: true,
    tool: false,
    item: false,
    maxStack: 64,
    dropIfWrongTool: false,
  },
  furnaceOff: {
    breakTime: 3,
    mineWithTool: "pickaxe",
    collision: false,
    translucent: false,
    liquid: false,
    color1: "#8A8A8A",
    color1Class: new Color(138 / 255, 138 / 255, 138 / 255),
    color2: "#3B3B3B",
    color2Class: new Color(59 / 255, 59 / 255, 59 / 255),
    utility: true,
    block: true,
    tool: false,
    item: false,
    maxStack: 64,
    dropIfWrongTool: false,
  },
  furnaceOn: {
    breakTime: 3,
    mineWithTool: "pickaxe",
    collision: false,
    translucent: false,
    liquid: false,
    color1: "#D98E3A",
    color1Class: new Color(217 / 255, 142 / 255, 58 / 255),
    color2: "#59310A",
    color2Class: new Color(89 / 255, 49 / 255, 10 / 255),
    utility: true,
    block: true,
    tool: false,
    item: false,
    maxStack: 64,
    dropIfWrongTool: true,
  },
  woodAxe: {
    breakTime: undefined,
    tool: true,
    toolMaterial: "wood",
    toolType: "axe",
    collision: false,
    translucent: false,
    liquid: false,
    color1: "#D0A56D",
    color1Class: new Color(208 / 255, 165 / 255, 109 / 255),
    color2: "#734D2A",
    color2Class: new Color(115 / 255, 77 / 255, 42 / 255),
    utility: false,
    block: false,
    item: true,
    maxStack: 1,
    dropIfWrongTool: true,
  },
  woodShovel: {
    breakTime: undefined,
    tool: true,
    toolMaterial: "wood",
    toolType: "shovel",
    collision: false,
    translucent: false,
    liquid: false,
    color1: "#D0A56D",
    color1Class: new Color(208 / 255, 165 / 255, 109 / 255),
    color2: "#734D2A",
    color2Class: new Color(115 / 255, 77 / 255, 42 / 255),
    utility: false,
    block: false,
    item: true,
    maxStack: 1,
    dropIfWrongTool: true,
  },
  woodPickaxe: {
    breakTime: undefined,
    tool: true,
    toolMaterial: "wood",
    toolType: "pickaxe",
    collision: false,
    translucent: false,
    liquid: false,
    color1: "#D0A56D",
    color1Class: new Color(208 / 255, 165 / 255, 109 / 255),
    color2: "#734D2A",
    color2Class: new Color(115 / 255, 77 / 255, 42 / 255),
    utility: false,
    block: false,
    item: true,
    maxStack: 1,
    dropIfWrongTool: true,
  },
  woodHoe: {
    breakTime: undefined,
    tool: true,
    toolMaterial: "wood",
    toolType: "hoe",
    collision: false,
    translucent: false,
    liquid: false,
    color1: "#D0A56D",
    color1Class: new Color(208 / 255, 165 / 255, 109 / 255),
    color2: "#734D2A",
    color2Class: new Color(115 / 255, 77 / 255, 42 / 255),
    utility: false,
    block: false,
    item: true,
    maxStack: 1,
    dropIfWrongTool: false,
  },
  woodSword: {
    breakTime: undefined,
    tool: true,
    toolMaterial: "wood",
    toolType: "sword",
    collision: false,
    translucent: false,
    liquid: false,
    color1: "#D0A56D",
    color1Class: new Color(208 / 255, 165 / 255, 109 / 255),
    color2: "#734D2A",
    color2Class: new Color(115 / 255, 77 / 255, 42 / 255),
    utility: false,
    block: false,
    item: true,
    maxStack: 1,
    dropIfWrongTool: true,
  },
  stoneAxe: {
    breakTime: undefined,
    tool: true,
    toolMaterial: "stone",
    toolType: "axe",
    collision: false,
    translucent: false,
    liquid: false,
    color1: "#B7B7B7",
    color1Class: new Color(183 / 255, 183 / 255, 183 / 255),
    color2: "#5B5B5B",
    color2Class: new Color(91 / 255, 91 / 255, 91 / 255),
    utility: false,
    block: false,
    item: true,
    maxStack: 1,
    dropIfWrongTool: false,
  },
  stonePickaxe: {
    breakTime: undefined,
    tool: true,
    toolMaterial: "stone",
    toolType: "pickaxe",
    collision: false,
    translucent: false,
    liquid: false,
    color1: "#B7B7B7",
    color1Class: new Color(183 / 255, 183 / 255, 183 / 255),
    color2: "#5B5B5B",
    color2Class: new Color(91 / 255, 91 / 255, 91 / 255),
    utility: false,
    block: false,
    item: true,
    maxStack: 1,
    dropIfWrongTool: true,
  },
  stoneShovel: {
    breakTime: undefined,
    tool: true,
    toolMaterial: "stone",
    toolType: "shovel",
    collision: false,
    translucent: false,
    liquid: false,
    color1: "#B7B7B7",
    color1Class: new Color(183 / 255, 183 / 255, 183 / 255),
    color2: "#5B5B5B",
    color2Class: new Color(91 / 255, 91 / 255, 91 / 255),
    utility: false,
    block: false,
    item: true,
    maxStack: 1,
    dropIfWrongTool: true,
  },
  stoneHoe: {
    breakTime: undefined,
    tool: true,
    toolMaterial: "stone",
    toolType: "hoe",
    collision: false,
    translucent: false,
    liquid: false,
    color1: "#B7B7B7",
    color1Class: new Color(183 / 255, 183 / 255, 183 / 255),
    color2: "#5B5B5B",
    color2Class: new Color(91 / 255, 91 / 255, 91 / 255),
    utility: false,
    block: false,
    item: true,
    maxStack: 1,
    dropIfWrongTool: false,
  },
  stoneSword: {
    breakTime: undefined,
    tool: true,
    toolMaterial: "stone",
    toolType: "sword",
    collision: false,
    translucent: false,
    liquid: false,
    color1: "#B7B7B7",
    color1Class: new Color(183 / 255, 183 / 255, 183 / 255),
    color2: "#5B5B5B",
    color2Class: new Color(91 / 255, 91 / 255, 91 / 255),
    utility: false,
    block: false,
    item: true,
    maxStack: 1,
    dropIfWrongTool: true,
  },
  ironAxe: {
    breakTime: undefined,
    tool: true,
    toolMaterial: "iron",
    toolType: "axe",
    collision: false,
    translucent: false,
    liquid: false,
    color1: "#D9D9D9",
    color1Class: new Color(217 / 255, 217 / 255, 217 / 255),
    color2: "#7A7A7A",
    color2Class: new Color(122 / 255, 122 / 255, 122 / 255),
    utility: false,
    block: false,
    item: true,
    maxStack: 1,
    dropIfWrongTool: true,
  },
  ironHoe: {
    breakTime: undefined,
    tool: true,
    toolMaterial: "iron",
    toolType: "hoe",
    collision: false,
    translucent: false,
    liquid: false,
    color1: "#D9D9D9",
    color1Class: new Color(217 / 255, 217 / 255, 217 / 255),
    color2: "#7A7A7A",
    color2Class: new Color(122 / 255, 122 / 255, 122 / 255),
    utility: false,
    block: false,
    item: true,
    maxStack: 1,
    dropIfWrongTool: false,
  },
  ironPickaxe: {
    breakTime: undefined,
    tool: true,
    toolMaterial: "iron",
    toolType: "pickaxe",
    collision: false,
    translucent: false,
    liquid: false,
    color1: "#D9D9D9",
    color1Class: new Color(217 / 255, 217 / 255, 217 / 255),
    color2: "#7A7A7A",
    color2Class: new Color(122 / 255, 122 / 255, 122 / 255),
    utility: false,
    block: false,
    item: true,
    maxStack: 1,
    dropIfWrongTool: true,
  },
  ironShovel: {
    breakTime: undefined,
    tool: true,
    toolMaterial: "iron",
    toolType: "shovel",
    collision: false,
    translucent: false,
    liquid: false,
    color1: "#D9D9D9",
    color1Class: new Color(217 / 255, 217 / 255, 217 / 255),
    color2: "#7A7A7A",
    color2Class: new Color(122 / 255, 122 / 255, 122 / 255),
    utility: false,
    block: false,
    item: true,
    maxStack: 1,
    dropIfWrongTool: true,
  },
  ironSword: {
    breakTime: undefined,
    tool: true,
    toolMaterial: "iron",
    toolType: "sword",
    collision: false,
    translucent: false,
    liquid: false,
    color1: "#D9D9D9",
    color1Class: new Color(217 / 255, 217 / 255, 217 / 255),
    color2: "#7A7A7A",
    color2Class: new Color(122 / 255, 122 / 255, 122 / 255),
    utility: false,
    block: false,
    item: true,
    maxStack: 1,
    dropIfWrongTool: true,
  },
  goldAxe: {
    breakTime: undefined,
    tool: true,
    toolMaterial: "gold",
    toolType: "axe",
    collision: false,
    translucent: false,
    liquid: false,
    color1: "#FFE180",
    color1Class: new Color(255 / 255, 225 / 255, 128 / 255),
    color2: "#8A6800",
    color2Class: new Color(138 / 255, 104 / 255, 0),
    utility: false,
    block: false,
    item: true,
    maxStack: 1,
    dropIfWrongTool: true,
  },
  goldHoe: {
    breakTime: undefined,
    tool: true,
    toolMaterial: "gold",
    toolType: "hoe",
    collision: false,
    translucent: false,
    liquid: false,
    color1: "#FFE180",
    color1Class: new Color(255 / 255, 225 / 255, 128 / 255),
    color2: "#8A6800",
    color2Class: new Color(138 / 255, 104 / 255, 0),
    utility: false,
    block: false,
    item: true,
    maxStack: 1,
    dropIfWrongTool: false,
  },
  goldPickaxe: {
    breakTime: undefined,
    tool: true,
    toolMaterial: "gold",
    toolType: "pickaxe",
    collision: false,
    translucent: false,
    liquid: false,
    color1: "#FFE180",
    color1Class: new Color(255 / 255, 225 / 255, 128 / 255),
    color2: "#8A6800",
    color2Class: new Color(138 / 255, 104 / 255, 0),
    utility: false,
    block: false,
    item: true,
    maxStack: 1,
    dropIfWrongTool: true,
  },
  goldShovel: {
    breakTime: undefined,
    tool: true,
    toolMaterial: "gold",
    toolType: "shovel",
    collision: false,
    translucent: false,
    liquid: false,
    color1: "#FFE180",
    color1Class: new Color(255 / 255, 225 / 255, 128 / 255),
    color2: "#8A6800",
    color2Class: new Color(138 / 255, 104 / 255, 0),
    utility: false,
    block: false,
    item: true,
    maxStack: 1,
    dropIfWrongTool: true,
  },
  goldSword: {
    breakTime: undefined,
    tool: true,
    toolMaterial: "gold",
    toolType: "sword",
    collision: false,
    translucent: false,
    liquid: false,
    color1: "#FFE180",
    color1Class: new Color(255 / 255, 225 / 255, 128 / 255),
    color2: "#8A6800",
    color2Class: new Color(138 / 255, 104 / 255, 0),
    utility: false,
    block: false,
    item: true,
    maxStack: 1,
    dropIfWrongTool: true,
  },
  diamondAxe: {
    breakTime: undefined,
    tool: true,
    toolMaterial: "diamond",
    toolType: "axe",
    collision: false,
    translucent: false,
    liquid: false,
    color1: "#A7F5FF",
    color1Class: new Color(167 / 255, 245 / 255, 255 / 255),
    color2: "#2B9BBF",
    color2Class: new Color(43 / 255, 155 / 255, 191 / 255),
    utility: false,
    block: false,
    item: true,
    maxStack: 1,
    dropIfWrongTool: true,
  },
  diamondHoe: {
    breakTime: undefined,
    tool: true,
    toolMaterial: "diamond",
    toolType: "hoe",
    collision: false,
    translucent: false,
    liquid: false,
    color1: "#A7F5FF",
    color1Class: new Color(167 / 255, 245 / 255, 255 / 255),
    color2: "#2B9BBF",
    color2Class: new Color(43 / 255, 155 / 255, 191 / 255),
    utility: false,
    block: false,
    item: true,
    maxStack: 1,
    dropIfWrongTool: false,
  },
  diamondPickaxe: {
    breakTime: undefined,
    tool: true,
    toolMaterial: "diamond",
    toolType: "pickaxe",
    collision: false,
    translucent: false,
    liquid: false,
    color1: "#A7F5FF",
    color1Class: new Color(167 / 255, 245 / 255, 255 / 255),
    color2: "#2B9BBF",
    color2Class: new Color(43 / 255, 155 / 255, 191 / 255),
    utility: false,
    block: false,
    item: true,
    maxStack: 1,
    dropIfWrongTool: true,
  },
  diamondShovel: {
    breakTime: undefined,
    tool: true,
    toolMaterial: "diamond",
    toolType: "shovel",
    collision: false,
    translucent: false,
    liquid: false,
    color1: "#A7F5FF",
    color1Class: new Color(167 / 255, 245 / 255, 255 / 255),
    color2: "#2B9BBF",
    color2Class: new Color(43 / 255, 155 / 255, 191 / 255),
    utility: false,
    block: false,
    item: true,
    maxStack: 1,
    dropIfWrongTool: true,
  },
  diamondSword: {
    breakTime: undefined,
    tool: true,
    toolMaterial: "diamond",
    toolType: "sword",
    collision: false,
    translucent: false,
    liquid: false,
    color1: "#A7F5FF",
    color1Class: new Color(167 / 255, 245 / 255, 255 / 255),
    color2: "#2B9BBF",
    color2Class: new Color(43 / 255, 155 / 255, 191 / 255),
    utility: false,
    block: false,
    item: true,
    maxStack: 1,
    dropIfWrongTool: true,
  },
  copperAxe: {
    breakTime: undefined,
    tool: true,
    toolMaterial: "copper",
    toolType: "axe",
    collision: false,
    translucent: false,
    liquid: false,
    color1: "#E6A271",
    color1Class: new Color(230 / 255, 162 / 255, 113 / 255),
    color2: "#9A4C27",
    color2Class: new Color(154 / 255, 76 / 255, 39 / 255),
    utility: false,
    block: false,
    item: true,
    maxStack: 1,
    dropIfWrongTool: false,
  },
  copperPickaxe: {
    breakTime: undefined,
    tool: true,
    toolMaterial: "copper",
    toolType: "pickaxe",
    collision: false,
    translucent: false,
    liquid: false,
    color1: "#E6A271",
    color1Class: new Color(230 / 255, 162 / 255, 113 / 255),
    color2: "#9A4C27",
    color2Class: new Color(154 / 255, 76 / 255, 39 / 255),
    utility: false,
    block: false,
    item: true,
    maxStack: 1,
    dropIfWrongTool: true,
  },
  copperShovel: {
    breakTime: undefined,
    tool: true,
    toolMaterial: "copper",
    toolType: "shovel",
    collision: false,
    translucent: false,
    liquid: false,
    color1: "#E6A271",
    color1Class: new Color(230 / 255, 162 / 255, 113 / 255),
    color2: "#9A4C27",
    color2Class: new Color(154 / 255, 76 / 255, 39 / 255),
    utility: false,
    block: false,
    item: true,
    maxStack: 1,
    dropIfWrongTool: true,
  },
  copperHoe: {
    breakTime: undefined,
    tool: true,
    toolMaterial: "copper",
    toolType: "hoe",
    collision: false,
    translucent: false,
    liquid: false,
    color1: "#E6A271",
    color1Class: new Color(230 / 255, 162 / 255, 113 / 255),
    color2: "#9A4C27",
    color2Class: new Color(154 / 255, 76 / 255, 39 / 255),
    utility: false,
    block: false,
    item: true,
    maxStack: 1,
    dropIfWrongTool: true,
  },
  copperSword: {
    breakTime: undefined,
    tool: true,
    toolMaterial: "copper",
    toolType: "sword",
    collision: false,
    translucent: false,
    liquid: false,
    color1: "#E6A271",
    color1Class: new Color(230 / 255, 162 / 255, 113 / 255),
    color2: "#9A4C27",
    color2Class: new Color(154 / 255, 76 / 255, 39 / 255),
    utility: false,
    block: false,
    item: true,
    maxStack: 1,
    dropIfWrongTool: true,
  },
  sugiliteAxe: {
    breakTime: undefined,
    tool: true,
    toolMaterial: "sugilite",
    toolType: "axe",
    collision: false,
    translucent: false,
    liquid: false,
    color1: "#E3B5FF",
    color1Class: new Color(227 / 255, 181 / 255, 255 / 255),
    color2: "#5C2D8C",
    color2Class: new Color(92 / 255, 45 / 255, 140 / 255),
    utility: false,
    block: false,
    item: true,
    maxStack: 1,
    dropIfWrongTool: true,
  },
  sugilitePickaxe: {
    breakTime: undefined,
    tool: true,
    toolMaterial: "sugilite",
    toolType: "pickaxe",
    collision: false,
    translucent: false,
    liquid: false,
    color1: "#E3B5FF",
    color1Class: new Color(227 / 255, 181 / 255, 255 / 255),
    color2: "#5C2D8C",
    color2Class: new Color(92 / 255, 45 / 255, 140 / 255),
    utility: false,
    block: false,
    item: true,
    maxStack: 1,
    dropIfWrongTool: true,
  },
  sugiliteShovel: {
    breakTime: undefined,
    tool: true,
    toolMaterial: "sugilite",
    toolType: "shovel",
    collision: false,
    translucent: false,
    liquid: false,
    color1: "#E3B5FF",
    color1Class: new Color(227 / 255, 181 / 255, 255 / 255),
    color2: "#5C2D8C",
    color2Class: new Color(92 / 255, 45 / 255, 140 / 255),
    utility: false,
    block: false,
    item: true,
    maxStack: 1,
    dropIfWrongTool: true,
  },
  sugiliteSword: {
    breakTime: undefined,
    tool: true,
    toolMaterial: "sugilite",
    toolType: "sword",
    collision: false,
    translucent: false,
    liquid: false,
    color1: "#E3B5FF",
    color1Class: new Color(227 / 255, 181 / 255, 255 / 255),
    color2: "#5C2D8C",
    color2Class: new Color(92 / 255, 45 / 255, 140 / 255),
    utility: false,
    block: false,
    item: true,
    maxStack: 1,
    dropIfWrongTool: true,
  },
  acatiaLog: {
    breakTime: 1.5,
    tool: "axe",
    collision: false,
    translucent: false,
    liquid: false,
    color2: "#4A3A12",
    color2Class: new Color(76 / 255, 60 / 255, 25 / 255),
    color1: "#5D4F1A",
    color1Class: new Color(93 / 255, 79 / 255, 26 / 255),
    utility: false,
    block: true,
    tool: false,
    item: false,
    maxStack: 64,
    dropIfWrongTool: true,
  },
  acatiaLeaf: {
    breakTime: 0.25,
    tool: "hoe",
    collision: false,
    translucent: false,
    liquid: false,
    color1: "#3B9813",
    color1Class: new Color(59 / 255, 152 / 255, 19 / 255),
    color2: "#357219",
    color2Class: new Color(53 / 255, 114 / 255, 25 / 255),
    utility: false,
    block: true,
    tool: false,
    item: false,

    maxStack: 64,
    dropIfWrongTool: true,
  },
  coalItem: {
    breakTime: undefined,
    tool: "hands",
    collision: false,
    translucent: false,
    liquid: false,
    color1: "#2A2A2A",
    color1Class: new Color(42 / 255, 42 / 255, 42 / 255),
    color2: "#0E0E0E",
    color2Class: new Color(14 / 255, 14 / 255, 14 / 255),
    utility: false,
    block: false,
    tool: false,
    item: true,
    maxStack: 64,
    dropIfWrongTool: true,
  },
  copperAxe: {
    breakTime: undefined,
    tool: true,
    toolMaterial: "copper",
    toolType: "axe",
    collision: false,
    translucent: false,
    liquid: false,
    color1: "#E6A271",
    color1Class: new Color(230 / 255, 162 / 255, 113 / 255),
    color2: "#9A4C27",
    color2Class: new Color(154 / 255, 76 / 255, 39 / 255),
    utility: false,
    block: false,
    item: true,
    maxStack: 1,
    dropIfWrongTool: true,
  },
};

let biomes = [];

function getBiome(number) {
  const humidity = number;
  switch (humidity) {
    case 0:
      return "desert";
    case 1:
      return "plains";
    case 2:
      return "mapleForest";
    case 3:
      return "hills";
    case 4:
      return "mountains";
  }
}
const worldWidth = 1500;
const chunkSize = 16;
const seaLevel = 0;
const maxHeight = 90;
const minHeight = -50;
// Generate the world using a seeded random generator.
const flatTerrainVariations = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2,
  2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2,
  2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2,
  2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2,
  2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0,
];
const hillyTerrainVariations = [
  0, 0, 0, 1, 1, 2, 2, 3, 4, 4, 5, 6, 6, 8, 8, 9, 10, 10, 10, 10, 10, 10, 11,
  11, 11, 11, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 11, 11, 11, 11, 10, 10,
  10, 10, 11, 13, 14, 15, 16, 17, 19, 20, 21, 21, 21, 21, 21, 21, 21, 21, 19,
  18, 18, 17, 16, 15, 14, 12, 10, 9, 9, 8, 8, 7, 7, 6, 6, 5, 5, 4, 4, 3, 3, 2,
  2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  2, 2, 2, 2, 3, 3, 4, 5, 6, 7, 7, 7, 7, 7, 7, 6, 6, 6, 6, 6, 7, 7, 7, 7, 6, 5,
  5, 5, 4, 3, 2, 2, 2, 1, 1, 0, 0, 0, 0, 1, 1, 2, 2, 3, 4, 4, 5, 6, 6, 8, 8, 9,
  10, 10, 10, 10, 10, 10, 11, 11, 11, 11, 10, 10, 10, 10, 10, 10, 10, 10, 10,
  10, 11, 11, 11, 11, 10, 10, 10, 10, 11, 13, 14, 15, 16, 17, 19, 20, 21, 21,
  21, 21, 21, 21, 21, 21, 19, 18, 18, 17, 16, 15, 14, 12, 10, 9, 9, 8, 8, 7, 7,
  6, 6, 5, 5, 4, 4, 3, 3, 2, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 4, 5, 6, 7, 7, 7, 7, 7, 7, 6, 6,
  6, 6, 6, 7, 7, 7, 7, 6, 5, 5, 5, 4, 3, 2, 2, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0,
  0,
];

const mountainousTerrainVariations = [
  1, 4, 6, 9, 11, 14, 18, 21, 25, 28, 32, 36, 40, 44, 48, 52, 54, 55, 57, 58,
  60, 58, 55, 53, 50, 48, 45, 43, 40, 38, 35, 33, 32, 30, 29, 27, 28, 29, 29,
  30, 31, 34, 36, 39, 41, 44, 46, 49, 51, 54, 56, 55, 53, 52, 50, 49, 46, 44,
  41, 39, 36, 33, 30, 28, 25, 22, 20, 18, 16, 14, 12, 13, 14, 16, 17, 18, 21,
  24, 28, 31, 34, 37, 40, 44, 47, 50, 51, 53, 54, 56, 57, 54, 51, 49, 46, 43,
  40, 37, 34, 31, 28, 26, 23, 21, 18, 16, 14, 13, 11, 10, 8, 9, 10, 11, 12, 13,
  16, 19, 23, 26, 29, 32, 36, 39, 43, 46, 49, 52, 54, 57, 60, 58, 56, 55, 53,
  51, 48, 45, 43, 40, 37, 34, 32, 29, 27, 24, 23, 22, 20, 19, 18, 20, 21, 23,
  24, 26, 29, 32, 35, 38, 41, 44, 47, 49, 52, 55, 53, 52, 50, 49, 47, 44, 40,
  37, 33, 30, 27, 24, 21, 18, 15, 13, 11, 9, 7, 5, 6, 7, 9, 10, 11, 14, 17, 19,
  22, 25, 28, 31, 34, 37, 40, 43, 45, 48, 50, 53, 51, 50, 48, 47, 45, 42, 38,
  35, 31, 28, 25, 22, 19, 16, 13, 11, 9, 7, 5, 3, 4, 5, 7, 8, 9, 12, 14, 17, 19,
  22, 25, 28, 32, 35, 38, 41, 44, 48, 51, 54, 55, 56, 58, 59, 60, 58, 56, 53,
  51, 49, 46, 43, 39, 36, 33, 30, 27, 25, 22, 19, 17, 15, 14, 12, 10, 11, 13,
  14, 16, 17, 20, 23, 26, 29, 32, 35, 38, 42, 45, 48, 46, 41, 43, 40, 36, 34,
  30, 23, 15, 13, 12, 9, 5, 1,
];

function createTree(x, y, type = "maple") {
  createBlock(x, y, type + "Log");
  createBlock(x, y + 1, type + "Log");
  createBlock(x, y + 2, type + "Log");

  const randomHeight = Math.floor(Math.random() * 2);
  createBlock(x, y + 3, type + "Log");

  createBlock(x, y + 3 + randomHeight, type + "Log");

  createBlock(x - 1, y + 3 + randomHeight, type + "Leaf");
  createBlock(x, y + 3 + randomHeight, type + "Leaf");
  createBlock(x + 1, y + 3 + randomHeight, type + "Leaf");

  createBlock(x - 1, y + 4 + randomHeight, type + "Leaf");
  createBlock(x, y + 4 + randomHeight, type + "Leaf");
  createBlock(x + 1, y + 4 + randomHeight, type + "Leaf");

  createBlock(x, y + 5 + randomHeight, type + "Leaf");
}
function createMountain(pos) {
  let relativeX = 0;
  let coalRandom = 0;
  for (let i = pos; i <= pos + 300; i++) {
    coalRandom += Math.random() + 1;
    // top block
    if (mountainousTerrainVariations[relativeX] > 30) {
      createBlock(i, mountainousTerrainVariations[relativeX], "snow");
    } else if (
      mountainousTerrainVariations[relativeX] > 20 &&
      mountainousTerrainVariations[relativeX] <= 30
    ) {
      createBlock(i, mountainousTerrainVariations[relativeX], "stone");
    } else if (
      mountainousTerrainVariations[relativeX] > 15 &&
      mountainousTerrainVariations[relativeX] <= 20
    ) {
      createBlock(i, mountainousTerrainVariations[relativeX], "dirt");
    } else if (mountainousTerrainVariations[relativeX] <= 15) {
      createBlock(i, mountainousTerrainVariations[relativeX], "grass");
    }

    // underground blocks
    for (let j = mountainousTerrainVariations[relativeX] - 1; j > -5; j--) {
      if (j <= 20) {
        if (j >= mountainousTerrainVariations[relativeX] - 4) {
          createBlock(i, j, "dirt");
        } else {
          createBlock(i, j, "stone");
          if (j >= mountainousTerrainVariations[relativeX] - 10) {
            if (coalRandom > 15.5) {
              createVein(i, j, "coalOre", 4);
              coalRandom = 0;
            }
          }
        }
      } else if (j > 20) {
        createBlock(i, j, "stone");
      }

      // todo omake mountains
    }
    relativeX++;
  }
}
function createHills(pos) {
  let relativeX = 0;
  let treeChance = 0;
  let flowerChance = 0;
  for (let i = pos; i <= pos + 300; i++) {
    treeChance += Math.random() + 1;
    if (treeChance > 15.5) {
      createTree(i, hillyTerrainVariations[relativeX] + 1, "maple");
      treeChance = 0;
    }
    if (flowerChance > 3.0) {
      createBlock(i, hillyTerrainVariations[relativeX] + 1, "daisy");
      flowerChance = 0;
    }
    createBlock(i, hillyTerrainVariations[relativeX], "grass");

    // underground blocks
    for (let j = hillyTerrainVariations[relativeX] - 1; j > -5; j--) {
      if (j >= hillyTerrainVariations[relativeX] - 4) {
        createBlock(i, j, "dirt");
      } else {
        createBlock(i, j, "stone");
        if (j >= hillyTerrainVariations[relativeX] - 10) {
          if (Math.random() > 0.95) {
            createVein(i, j, "coalOre", 4);
          }
        }
      }
    }
    relativeX++;
  }
}
function createFlatTerrain(pos, blockTop, blockMid, forest = false) {
  let relativeX = 0;
  let treeChance = 0;
  let flowerChance = 0;
  for (let i = pos; i <= pos + 300; i++) {
    if (blockTop == "grass") {
      treeChance += Math.random() + 0.1;
      if (treeChance > (forest ? 4.2 : 7.4)) {
        createTree(i, flatTerrainVariations[relativeX] + 1, "maple");
        treeChance = 0;
      }

      flowerChance += Math.random() + 0.1;
      if (flowerChance > 3.0) {
        createBlock(i, flatTerrainVariations[relativeX] + 1, "redTulip");
        flowerChance = 0;
      }
    }
    createBlock(i, flatTerrainVariations[relativeX], blockTop);

    // underground blocks
    for (let j = flatTerrainVariations[relativeX] - 1; j > -5; j--) {
      if (j >= flatTerrainVariations[relativeX] - 4) {
        createBlock(i, j, blockMid);
      } else {
        createBlock(i, j, "stone");
      }
    }
    relativeX++;
  }
}
// the undergroud
function createVein(x, y, blockType, seed) {
  const veinType = Math.floor(Math.random() * 5);
  const veinOffsets = [
    [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]],
    [[0, 0], [1, 0], [0, 1], [1, 1], [-1, 0], [2, -1]],
    [[0, 0], [1, 0], [-1, 0], [-2, 0]],
    [[0, 0], [0, 1], [0, -1]],
    [[0, 0], [1, 0], [-1, 0], [0, 1]],
  ];

  for (const [offsetX, offsetY] of veinOffsets[veinType]) {
    const oreX = x + offsetX;
    const oreY = y + offsetY;
    const oreKey = `${oreX},${oreY}`;

    if (blocks[oreKey] && blocks[`${oreX},${oreY + 1}`]) {
      destroyBlock(oreX, oreY);
      createBlock(oreX, oreY, blockType);
    }
  }
}

function theDeepDark(seed) {
  for (let x = -1500; x <= 1500; x++) {
    for (let y = -5; y > -50; y--) {
      createBlock(x, y, "stone");
    }
  }
  for (let x = -1500; x <= 1500; x++) {
    createBlock(x, -50, "bedrock");
  }

  // coal ore

  const coalRange = Math.floor(Math.random() + 1 * 7) * 3;

  for (let x = -1500; x <= 1500; x += coalRange) {
    const coalY = Math.floor(Math.random() + 2 * 8) - 13;
    createVein(x, coalY, "coalOre", seed + x);
  }
  const copperRange = Math.floor(Math.random() + 1 * 7) * 3;

  for (let x = -1500; x <= 1500; x += copperRange) {
    const coalY = Math.floor(Math.random() * 8) - 21;
    createVein(x, coalY, "copperOre", seed + x);
  }

  const ironRange = Math.floor(Math.random() + 1 * 7) * 4;

  for (let x = -1500; x <= 1500; x += ironRange) {
    const coalY = Math.floor(Math.random() * 10) - 28;
    createVein(x, coalY, "ironOre", seed + x);
  }

  for (let x = -1500; x <= 1500; x += ironRange + 3) {
    const coalY = Math.floor(Math.random() * 10) - 37;
    createVein(x, coalY, "ironOre", seed + x);
  }

  const goldRange = Math.floor(Math.random() + 1 * 7) * 5;

  for (let x = -1500; x <= 1500; x += goldRange) {
    const coalY = Math.floor(Math.random() * 10) - 40;
    createVein(x, coalY, "goldOre", seed + x);
  }

  const diamondRange = Math.floor(Math.random() + 1 * 7) * 6;

  for (let x = -1500; x <= 1500; x += diamondRange) {
    const coalY = Math.floor(Math.random() * 10) - 45;
    createVein(x, coalY, "diamondOre", seed + x);
  }
}
function procedurallyGenerateWorld(seed) {
  // Validate seed
  if (seed === undefined || typeof seed !== "number" || isNaN(seed)) {
    seed = Math.floor(Math.random() * 10000);
    displayError("Invalid seed provided. Using a random seed instead.");
  }

  const biomeTypes = ["plains", "mapleForest", "desert", "hills", "mountains"];

  const biomeWeights = {
    plains: 30,
    mapleForest: 25,
    desert: 15,
    hills: 20,
    mountains: 10,
  };

  function randomBiome(rng, previousBiome) {
    // Build a list with weighted probabilities.
    let choices = [];

    for (const biome of biomeTypes) {
      let weight = biomeWeights[biome];

      // Make immediate repetition much less likely.
      if (biome === previousBiome) {
        weight *= 0.15;
      }

      for (let i = 0; i < weight; i++) {
        choices.push(biome);
      }
    }

    return choices[rng.int(choices.length)];
  }

  let previousBiome = null;
  theDeepDark(seed);
  for (let i = 0; i <= 10; i++) {
    const biomeStart = i * 300 - 1500;

    // Unique deterministic RNG for this region.
    const rng = new RandomGenerator(seed + i * 7919);

    let biome = randomBiome(rng, previousBiome);

    // Extra protection against boring repetition.
    if (biome === previousBiome) {
      const alternatives = biomeTypes.filter((b) => b !== previousBiome);
      biome = alternatives[rng.int(alternatives.length)];
    }

    biomes.push(biome);
    previousBiome = biome;

    switch (biome) {
      case "plains":
        createFlatTerrain(biomeStart, "grass", "dirt");
        break;

      case "mapleForest":
        createFlatTerrain(biomeStart, "grass", "dirt", true);
        break;

      case "desert":
        createFlatTerrain(biomeStart, "sand", "sand");
        break;

      case "hills":
        createHills(biomeStart);
        break;

      case "mountains":
        createMountain(biomeStart);
        break;

      default:
        createFlatTerrain(biomeStart, "grass", "dirt");
        break;
    }
  }
}
function createFlatWorld(seed) {
  for (let i = -1500; i < worldWidth; i++) {
    createBlock(i, 0, "grass");
    createBlock(i, -1, "dirt");
    createBlock(i, -2, "dirt");
    createBlock(i, -3, "dirt");
    createBlock(i, -4, "bedrock");
  }
  console.log(blocks);
}

function saveGame() {
  if (!localStorage.getItem("gameSaveTopId")) {
    localStorage.setItem("gameSaveTopId", 1);
  }

  let saveFile = {
    worldName: worldName,
    gameId: gameId,
    worldDesc: worldDesc,
    playerCoords: player.coords,
    playerInventory: player.inventory,
    blocks: blocks,
    biomes: biomes,
  };
  try {
    localStorage.setItem("gameSave" + gameId, JSON.stringify(saveFile));
  } catch (error) {
    displayError("Error saving game:", error);
    console.error("Error saving game:", error);
  }

  if (localStorage.getItem("gameSaveTopId") == gameId) {
    localStorage.setItem(
      "gameSaveTopId",
      Number(localStorage.getItem("gameSaveTopId")) + 1,
    );
  }

  if (localStorage.getItem("gameSave" + gameId)) {
    displayError("Game saved successfully!");
    const recentGameIdsArray =
      JSON.parse(localStorage.getItem("recentGameIds")) || [];
    if (recentGameIdsArray.includes(gameId)) {
      recentGameIdsArray.splice(recentGameIdsArray.indexOf(gameId), 1);
    }
    recentGameIdsArray.unshift(gameId);
    localStorage.setItem("recentGameIds", JSON.stringify(recentGameIdsArray));
  } else {
    displayError("Failed to save game.");
  }
}
window.saveGame = saveGame;
// Initialize textures and start the draw loop.
if (!localStorage.getItem("gameSaveTopId")) {
  localStorage.setItem("gameSaveTopId", 1);
  localStorage.setItem("recentGameIds", JSON.stringify([]));
}
engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender);
setInputPreventDefault(false);
debugKey = "Escape";
