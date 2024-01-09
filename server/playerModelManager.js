import { Mesh, MeshPhongMaterial } from "three";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { readFileSync } from "node:fs";
import Server from "./server.js";
import Player from "../player.js";
import GameObject from "../network/gameObject.js";

class PlayerModelManager {
    constructor(server) {
        /**
         * @type { Server }
         */
        this.server = server;

        /**
         * @type { Map<Player, GameObject>}
         */
        this.playerBodies = new Map();
    }

    getPlayerBody(player) {
        return this.playerBodies.get(player);
    }

    onPlayerConnected(player) {
        const loader = new OBJLoader();
        const skullData = readFileSync("./skull.obj").toString();
        
        const geometry = loader.parse(skullData).children[0].geometry;
        const material = new MeshPhongMaterial({ color: 0xffffff, wireframe: false });

        const playerBody = new Mesh(geometry, material);


        const gameObject = this.server.world.createGameObject(playerBody);

        this.playerBodies.set(player, gameObject);

        player.peer.on("set-player-position", packet => {
            this.onPlayerMove(gameObject, packet.content[0] ?? 0, packet.content[1] ?? 0, packet.content[2] ?? 0);
        });
        player.peer.on("set-player-rotation", packet => {
            this.onPlayerRotate(gameObject, packet.content[0] ?? 0, packet.content[1] ?? 0, packet.content[2] ?? 0, packet.content[3] ?? "ZXY");
        });

        this.server.world.setObjectVisible(gameObject, player.id, false);
    }

    onPlayerDisconnected(player) {
        const playerBody = this.playerBodies.get(player);
        this.server.world.removeGameObject(playerBody);
    }

    onPlayerMove(playerBody, x, y, z) {
        playerBody.position.value.set(x, y, z);
    }

    onPlayerRotate(playerBody, x, y, z, order) {
        playerBody.rotation.value.set(x, y, z);
        playerBody.rotation.value.order = order;
    }
}

export default PlayerModelManager;