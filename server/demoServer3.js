import { BoxGeometry, HemisphereLight, Mesh, MeshBasicMaterial, MeshNormalMaterial, Object3D, SphereGeometry, Vector3 } from "three";
import PlayerMessagePacket from "../playerMessagePacket.js";
import PlayerModelManager from "./playerModelManager.js";
import Server from "./server.js";

class DemoServer3 extends Server {
    init() {
        this.playerBodies = new Map();
        this.playerModelManager = new PlayerModelManager(this);

        const playSpace = new Mesh(
            new BoxGeometry(1024, 1024, 1024),
            new MeshBasicMaterial({ color: 0x888888, wireframe: true })
        );

        this.world.createGameObject(new Mesh(new SphereGeometry(64), new MeshNormalMaterial()));

        this.world.createGameObject(playSpace);

        const light = new HemisphereLight(0xffffff, 0x443300);
        const lightParent = new Object3D();
        lightParent.add(light);
        this.world.createGameObject(lightParent);
    }

    async onConnection(player) {
        this.playerModelManager.onPlayerConnected(player);

        this.broadcast(new PlayerMessagePacket(`${player.id} joined the room`));
        player.peer.on("message", packet => {
            if(packet.content.replace(/\s\r/g, "").length == 0) return;
            console.log("(" + this.id + ") " + player.id + ": " + packet.content)
            this.broadcast(new PlayerMessagePacket(`${player.id}: ${packet.content}`));
        });
        player.peer.on("key", packet => {
            if(packet.content == "r") {
                randomPos();
            }
        });

        const MAX_DIST = 512;
        function randomPos() {
            player.setPosition(new Vector3(
                (Math.random() - 0.5) * MAX_DIST,
                (Math.random() - 0.5) * MAX_DIST,
                (Math.random() - 0.5) * MAX_DIST
            ));
        }

        const interval = setInterval(() => {
            if(
                player.position.x < -MAX_DIST || player.position.x > MAX_DIST ||
                player.position.y < -MAX_DIST || player.position.y > MAX_DIST ||
                player.position.z < -MAX_DIST || player.position.z > MAX_DIST
            ) randomPos();
        }, 50);
        player.peer.on("close", () => clearInterval(interval));
    }

    onDisconnection(player) {
        this.broadcast(new PlayerMessagePacket(`${player.id} left the room`));
        this.playerModelManager.onPlayerDisconnected(player);
    }
}

export default DemoServer3;