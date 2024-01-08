import EventEmitter from "node:events";
import GameObject from "./gameObject.js";
import config from "../config.js";

class GameObjectObserver extends EventEmitter {
    constructor(gameObject) {
        super();

        /**
         * @type {GameObject}
         */
        this.gameObject = gameObject;

        this.interval = setInterval(() => {
            if(this.gameObject.destroyed) {
                this.stop();
                return;
            }

            const changes = this.gameObject.getChanges();
            if(changes.length > 0) {
                this.emit("change", changes);
            }
        }, 1000 / config.networkUpdatePollingRate);
    }
    stop() {
        clearInterval(this.interval);
    }
}

export default GameObjectObserver;