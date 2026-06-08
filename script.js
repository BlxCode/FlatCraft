
function resize() {
    let canvas = document.getElementById("gameCanvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
}

function getCanvasX (x) {
    return x *75;
}
function getCanvasY (y) {
    return y *75;
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
function createTree (type,x,y,length) {
  if (type === "maple" && length == "Long") {
      ctx.drawImage(textures.mapleLog, getCanvasX(x), getCanvasY(y), 75, 75);
      ctx.drawImage(textures.mapleLog, getCanvasX(x), getCanvasY(y-1), 75, 75);
      ctx.drawImage(textures.mapleLog, getCanvasX(x), getCanvasY(y-2), 75, 75);
      ctx.drawImage(textures.mapleLog, getCanvasX(x), getCanvasY(y-3), 75, 75);
      ctx.drawImage(textures.mapleLog, getCanvasX(x), getCanvasY(y-4), 75, 75);
  }else if (type === "maple" && length == "Short") {
      ctx.drawImage(textures.mapleLog, getCanvasX(x), getCanvasY(y), 75, 75);
      ctx.drawImage(textures.mapleLog, getCanvasX(x), getCanvasY(y-1), 75, 75);
      ctx.drawImage(textures.mapleLog, getCanvasX(x), getCanvasY(y-2), 75, 75);
  }
}
async function init() {
  ctx.imageSmoothingEnabled = false;
  textures.grass = await loadTexture("grass");
  textures.dirt = await loadTexture("dirt");
  textures.stone = await loadTexture("stone");
  textures.mapleLog = await loadTexture("mapleLog");
  textures.mapleLeaf = await loadTexture("mapleLeaf");
  ctx.drawImage(textures.grass, getCanvasX(5), getCanvasY(9), 75, 75);
  ctx.drawImage(textures.grass, getCanvasX(8), getCanvasY(8), 75, 75);
  ctx.drawImage(textures.grass, getCanvasX(6), getCanvasY(9), 75, 75);
  ctx.drawImage(textures.grass, getCanvasX(7), getCanvasY(8), 75, 75);
  ctx.drawImage(textures.dirt, getCanvasX(7), getCanvasY(9), 75, 75);
  ctx.drawImage(textures.dirt, getCanvasX(6), getCanvasY(10), 75, 75);
   ctx.drawImage(textures.dirt, getCanvasX(5), getCanvasY(10), 75, 75);
    ctx.drawImage(textures.dirt, getCanvasX(4), getCanvasY(10), 75, 75);
    ctx.drawImage(textures.stone, getCanvasX(4), getCanvasY(11), 75, 75);
    createTree("maple", 5, 8,"Long");
    createTree("maple", 8, 7,"Short");
}

init();


setInterval(init, 66.667);

