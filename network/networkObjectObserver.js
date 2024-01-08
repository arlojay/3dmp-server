import EventEmitter from "node:events";


class NetworkObjectObserver extends EventEmitter {
    constructor(networkObject) {
        super();

        this.networkObject = networkObject;

        setInterval(() => {
            if(this.networkObject.changed) {
                this.emit("change", this.networkObject.read());
            }
        }, 1000 / config.networkUpdatePollingRate);
    }
}

export default NetworkObjectObserver;