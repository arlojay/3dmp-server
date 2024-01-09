import express from "express";
import expressWs from "express-ws";
import config from "./config.js";
import ServerList from "./serverList.js";
import DemoServer from "./server/demoServer.js";
import DemoServer2 from "./server/demoServer2.js";
import DemoServer3 from "./server/demoServer3.js";

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