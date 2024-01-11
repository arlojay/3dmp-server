import EventEmitter from "node:events";
import Peer from "./peer.js";
import UUID from "./UUID.js";

class ConnectionInterface extends EventEmitter {
    /**
     * Interface to act as a middleman for opened websockets
     */
    constructor() {
        super();

        /**
         * @type {Map<String, Peer>} Active connections to the server
         */
        this.connections = new Map();
    }

    /**
     * Sets up event listeners and passes the event to listening objects
     * @param {WebSocket} ws Connected user
     */
    handleConnect(ws) {
        const peer = new Peer(ws);

        peer.id = UUID.next();
        this.connections.set(peer.id, peer);

        this.emit("connection", peer);

        peer.on("close", () => {
            this.handleDisconnect(peer);
        });
    }
    
    /**
     * Deconstructs the peer and passes the event to listening objects
     * @param {Peer} peer Disconnected user
     */
    handleDisconnect(peer) {
        this.connections.delete(peer.id);

        this.emit("disconnect", peer);
    }
}

export default ConnectionInterface;