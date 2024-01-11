import Peer from "./peer.js";

class PeerPacket {
    /**
     * An interface for reading and responding to packets from peers
     * @param {Peer} peer Peer who sent the packet
     * @param {String} data Unparsed raw data contained within the packet
     */
    constructor(peer, data) {
        const { type, content, nonce } = JSON.parse(data);

        /**
         * @type {Peer} Peer who originally sent the packet
         */
        this.peer = peer;

        /**
         * @type {String} Type of message the peer identified this packet as
         */
        this.type = type;

        /**
         * @type {any} Data the peer sent with the packet
         */
        this.content = content;

        /**
         * @type {Number} The index (nonce) of the packet sent from the client, used to respond to exec-type messages
         */
        this.nonce = nonce;
    }

    /**
     * Responds to the peer with a packet of the same type and nonce, **used for exec-type messages**
     * @param {any} content Content to return
     */
    respond(content) {
        this.peer.send(this.type, content, this.nonce);
    }
}

export default PeerPacket;