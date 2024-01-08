import express from "express";
import expressWs from "express-ws";
import config from "./config.js";
import ServerList from "./serverList.js";
import DemoServer from "./server/demoServer.js";

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

serverList.createServer("main", new DemoServer());