import { BoxGeometry, HemisphereLight, Mesh, MeshPhysicalMaterial, Scene } from "three";
import GameObject from "../network/gameObject.js";
import GameObjectObserver from "../network/gameObjectObserver.js";
import EventEmitter from "events";

class ServerWorld extends EventEmitter {
    constructor() {
        super();
        this.gameObjects = new Map();
    }

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

        this.emit("add-object", gameObject);

        return gameObject;
    }

    /**
     * Removes a game object from the scene and broadcasts the update
     * @param {GameObject} gameObject
     */
    removeGameObject(gameObject) {
        gameObject.destroy();
        this.gameObjects.delete(gameObject.id);
        this.emit("remove-object", gameObject);
    }

    serialize() {
        const objects = new Array();
        for(const gameObject of this.gameObjects.values()) {
            objects.push(gameObject.serialize());
        }
        return objects;
    }

    /**
     * Hides or shows a game object for a player
     * @param {GameObject} gameObject
     * @param {String} playerId
     * @param {Boolean} visible
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