import EventEmitter from "node:events";
import GameObject from "./gameObject.js";
import config from "../config.js";

class GameObjectObserver extends EventEmitter {
    /**
     * Observes a GameObject for changes and emits a `change` event with a list of changes if/when it does
     * @param {GameObject} gameObject GameObject to observe
     */
    constructor(gameObject) {
        super();

        /**
         * @type {GameObject} Observing GameObject
         */
        this.gameObject = gameObject;

        /**
         * @type {Number} ID of the interval used to check for changes
         */
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
    
    /**
     * Stops checking for changes. Used on destruction of the GameObject.
     */
    stop() {
        clearInterval(this.interval);
    }
}

export default GameObjectObserver;