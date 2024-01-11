import { Mesh, MeshPhongMaterial } from "three";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { readFileSync } from "node:fs";
import Player from "../player.js";
import GameObject from "../network/gameObject.js";
import ServerModule from "./serverModule.js";

class PlayerModelModule extends ServerModule {
    preinit(server) {
        /**
         * @type { Map<Player, GameObject>}
         */
        this.playerBodies = new Map();
    }

    getId() {
        return "player-model";
    }

    onConnection(player) {
        const loader = new OBJLoader();
        const skullData = readFileSync("./skull.obj").toString();
        
        const geometry = loader.parse(skullData).children[0].geometry;
        const material = new MeshPhongMaterial({ color: 0xffffff, wireframe: false });

        const playerBody = new Mesh(geometry, material);


        const gameObject = this.server.world.createGameObject(playerBody);

        this.playerBodies.set(player, gameObject);

        player.peer.on("set-player-position", packet => {
            gameObject.position.value.set(
                packet.content[0] ?? 0,
                packet.content[1] ?? 0,
                packet.content[2] ?? 0
            );
        });
        player.peer.on("set-player-rotation", packet => {
            gameObject.rotation.value.set(
                packet.content[0] ?? 0,
                packet.content[1] ?? 0,
                packet.content[2] ?? 0
            );
            gameObject.rotation.value.order = packet.content[3] ?? "ZXY";
        });

        this.server.world.setObjectVisible(gameObject, player.id, false);
    }

    onDisconnection(player) {
        const gameObject = this.playerBodies.get(player);
        this.server.world.removeGameObject(gameObject);
    }

    /**
     * Gets the gameObject that represents a player
     * @param {Player} player Player to get the model of
     * @returns {GameObject}
     */
    getPlayerBody(player) {
        return this.playerBodies.get(player);
    }
}

export default PlayerModelModule;