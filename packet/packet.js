import Peer from "../peer.js";

class Packet {
    /**
     * A generic packet base class for other packets to extend
     * @param {String} id Identifier identifying which type of packet this is
     */
    constructor(id) {
        /**
         * @type {String} Packet type
         */
        this.id = id;
        
        /**
         * @type {any} Data carried with the packet
         */
        this.data = null;
    }

    /**
     * Sets the data for this packet to be sent with `packet.send()`
     * @param {any} newData Data carried with the packet
     */
    setData(newData) {
        this.data = newData;
    }

    /**
     * Sends this packet to another peer
     * @param {Peer} peer Who to sent this packet to
     */
    send(peer) {
        peer.send(this.id, this.data);
    }
}

export default Packet;