import EventEmitter from "node:events";
import PeerPacket from "./peerPacket.js";

class Peer extends EventEmitter {
    /**
     * Wrapper for the websocket connection to the client
     * @param {WebSocket} ws Websocket that portrays the connection
     */
    constructor(ws) {
        super();
        
        /**
         * @type {WebSocket} Underlying websocket connection
         */
        this.ws = ws;

        /**
         * @type {String} UUID of this peer
         */
        this.id = "";

        /**
         * @type {Boolean} Whether or not the websocket connection has been terminated
         */
        this.closed = false;


        this.ws.on("close", () => {
            this.closed = true;
            this.emit("close");
        });
        this.ws.on("error", error => {
            this.emit("error", error);
        });
        this.ws.on("message", data => {
            const packet = new PeerPacket(this, data);
            this.emit(packet.type, packet);
        });
    }

    /**
     * Sends a serialized message to the client
     * @param {String} type Type of message data
     * @param {any} content Message data
     * @param {Number?} nonce Packet nonce (client index) **internally** used for responding to an exec-type message
     */
    send(type, content, nonce) {
        this.ws.send(JSON.stringify({ type, content, nonce }));
    }

    /**
     * Closes the underlying websocket connection, terminating the peer
     */
    close() {
        this.ws.close();
    }
}

export default Peer;