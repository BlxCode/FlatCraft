const express = require("express");
const { rateLimit } = require('express-rate-limit')
const app = express();
const crypto = require("crypto")
const http = require("http");
const { WebSocketServer } = require("ws");
const fs = require("fs");
//const isOnline = require("@esm2cjs/is-online").default;
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const limiter = rateLimit({
  windowMs: 60000, // 1 minute
  limit: 10, // Limit each IP to 10 requests per `window` (here, per 1 minutes).
standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
// store: ... , // Redis, Memcached, etc. See below.
})
function createToken() {
  return crypto.randomBytes(32).toString("hex");
}


app.use(limiter)
app.set("trust proxy", 1);
const path = require("path");
const { error } = require("console");
app.use("/files", express.static(path.join(__dirname, "files")));
app.get("/", (req, res) => {
  console.log("some guy wanted to see my server via the browser, ip:" , req.ip);
  const ipList = JSON.parse(fs.readFileSync("ipsWEB.json","utf8"));
  const dateHappened = new Date();
  ipList.push({[req.ip] :dateHappened});

  fs.writeFileSync("ipsWEB.json",JSON.stringify(ipList))




  res.sendFile(path.join(__dirname, "public", "index.html"));

});
app.use(express.static("public"))

wss.on("connection", async (ws,req) => {
  let secureAhhPassword = createToken();
  console.log(req.headers['x-real-ip']);
  const ip = req.headers['x-real-ip'];

  console.log("User connected! IP:",  ip);

  const ipList = JSON.parse(fs.readFileSync("ipsWSS.json","utf8"));

  if(!ipList.includes(ip)){
    ipList.push(ip);
    fs.writeFileSync("ipsWSS.json",JSON.stringify(ipList))
  }


  ws.send("S|p*r#e%c^r/e*a-s~wd"+secureAhhPassword);
  let data;
  fs.readFile('skins.json', 'utf8', (err, dataFile) => {
    if (err) {
      console.error(err);
      return;
    }

    data = dataFile;
    ws.send("S|c'[]s"+JSON.stringify(data))

  });

let rateLimit = true;
  ws.on("message", (msg) => {

    if(msg.toString().includes(secureAhhPassword) && rateLimit){

      rateLimit = false;
      msg = msg.toString().replace(secureAhhPassword,"")

      let data;
      setTimeout(()=>{rateLimit = true},1000)

      try {
        data = JSON.parse(msg);
      } catch {


        console.log(msg.toString())
        const text = msg.toString();
        //    console.log("Received:", text);

        if(text === "closeThisLol😭🥀🚣‍♂️"){
          ws.close();
        }

        return;
      }
      const skins = JSON.parse(fs.readFileSync("skins.json", "utf8"));

      skins.push({
        name: data.Name,
        file: `${data.Image}`,
        date:Date.now(),
                 id: crypto.randomUUID(),
      });

      fs.writeFileSync("skins.json", JSON.stringify(skins, null, 2));
      ws.send("UPLOAD_OK");
    }else{

      console.log("stupid guy trying to ddoss me get ratelimited ip:",ip)
      return
    }
  });
  ws.on("close",()=>{
    secureAhhPassword = null;
    console.log("user disconnected ip so i can nuke him:",ip);
  })
});

server.listen(8080, "0.0.0.0", () => {
  console.log("Server running on port 8080");
});
