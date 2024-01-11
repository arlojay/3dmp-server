import { Mesh } from "three";
import GameObject from "../network/gameObject.js";
import GameObjectObserver from "../network/gameObjectObserver.js";
import EventEmitter from "node:events";
import Player from "../player.js";

class ServerWorld extends EventEmitter {
    /**
     * Core of a server: the world it hosts
     */
    constructor() {
        super();

        /**
         * @type {Map<String, GameObject>} Contains all of the gameObjects in the world
         */
        this.gameObjects = new Map();
    }

    /**
     * Creates a GameObject with a mesh, which is synced across the server for all players
     * @param {Mesh} mesh Three.js mesh to create the gameObject for
     * @returns {GameObject}
     */
    createGameObject(mesh) {
        const gameObject = new GameObject(mesh);
        const observer = new GameObjectObserver(gameObject);

        observer.on("change", changes => {
            const packet = new Array();

            for(const networkObject of changes) {
                packet.push({
                    id: networkObject.id,
                    value: networkObject.serialize()
                });
            }

            this.emit("change", { gameObject, changes, packet });
        });

        this.gameObjects.set(gameObject.id, gameObject);

        queueMicrotask(() => {
            this.emit("add-object", gameObject);
        });

        return gameObject;
    }

    /**
     * Removes a game object from the world and broadcasts the update
     * @param {GameObject} gameObject GameObject to remove from the world
     */
    removeGameObject(gameObject) {
        gameObject.destroy();
        this.gameObjects.delete(gameObject.id);
        this.emit("remove-object", gameObject);
    }

    /**
     * Serializes all objects within the world to send to the newly connected player
     * @param {Player} player Player that just joined
     * @returns {Array<object>}
     */
    serialize(player) {
        const objects = new Array();
        for(const gameObject of this.gameObjects.values()) {
            if(!gameObject.visibleTo(player)) continue;
            objects.push(gameObject.serialize());
        }
        return objects;
    }

    /**
     * Hides or shows a game object for a player. Hiding visually destroys the object on the client until shown again.
     * @param {GameObject} gameObject GameObject to show/hide
     * @param {String} playerId Player (by ID) to show/hide the object for
     * @param {Boolean} visible Whether or not the object becomes visible
     */
    setObjectVisible(gameObject, playerId, visible) {
        let changed = false;
        if(visible) {
            if(gameObject.hidden.has(playerId)) changed = true;
            gameObject.hidden.delete(playerId);
        } else {
            if(!gameObject.hidden.has(playerId)) changed = true;
            gameObject.hidden.add(playerId);
        }
        if(changed) this.emit("set-object-visibility", { gameObject, playerId, visible });
    }
}

export default ServerWorld;