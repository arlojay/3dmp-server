import EventEmitter from "node:events";
import NetworkSceneObject from "./networkSceneObject.js";


class NetworkObjectObserver extends EventEmitter {
    /**
     * Observes a NetworkVariable or NetworkSceneObject for changes
     * @param {NetworkVariable|NetworkSceneObject} networkObject Object to observe
     */
    constructor(networkObject) {
        super();

        /**
         * @type {NetworkVariable|NetworkSceneObject} Observing object
         */
        this.networkObject = networkObject;

        /**
         * @type {Number} ID of the interval used to check for changes
         */
        this.interval = setInterval(() => {
            if(this.networkObject.changed) {
                this.emit("change", this.networkObject.read());
            }
        }, 1000 / config.networkUpdatePollingRate);
    }
    
    /**
     * Stops checking for changes. Used on dereference of the network object/variable.
     */
    stop() {
        clearInterval(this.interval);
    }
}

export default NetworkObjectObserver;