import Packet from "./packet.js";

class PlayerMessagePacket extends Packet {
    /**
     * A packet that describes a raw text/chat message to be sent to the client
     * @param {String} message Chat message content
     */
    constructor(message) {
        super("message");

        this.setData(message);
    }
}

export default PlayerMessagePacket;