import express from "express";
import expressWs from "express-ws";
import config from "./config.js";
import ServerList from "./serverList.js";
import DemoServer from "./games/demo-server/demoServer.js";
import DemoServer2 from "./games/demo-server2/demoServer2.js";
import DemoServer3 from "./games/demo-server3/demoServer3.js";
import BallDodgeServer from "./games/ball-dodge/ballDodge.js";
import PapaStuffServer from "./games/papa-stuff/papaStuff.js"

const app = express();
const serverList = new ServerList();
expressWs(app);

app.ws("/", (ws, req) => {
    try {
        serverList.handleConnection(ws, req);
    } catch(error) {
        ws.send(error.message);
        console.error(error.stack);
        ws.close();
    }
});

app.get("/list", (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.json(serverList.serialize());
});

app.listen(config.port, () => console.log("Listening on *:" + config.port));

serverList.createServer("demo1", new DemoServer());
serverList.createServer("demo2", new DemoServer2());
serverList.createServer("demo3", new DemoServer3());
serverList.createServer("ball-dodge", new BallDodgeServer());
serverList.createServer("papa-stuff", new PapaStuffServer());