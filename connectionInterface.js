import EventEmitter from "node:events";
import Peer from "./peer.js";
import UUID from "./UUID.js";

class ConnectionInterface extends EventEmitter {
    constructor() {
        super();

        this.connections = new Map();
    }

    handleConnect(ws) {
        const peer = new Peer(ws);

        peer.id = UUID.next();
        this.connections.set(peer.id, peer);

        this.emit("connection", peer);

        peer.on("close", () => {
            this.handleDisconnect(peer);
        });
    }
    handleDisconnect(peer) {
        this.connections.delete(peer.id);

        this.emit("disconnect", peer);
    }
}

export default ConnectionInterface;