import Packet from "./packet.js";

class PlayerMessagePacket extends Packet {
    constructor(message) {
        super("message");

        this.setData(message);
    }
}

export default PlayerMessagePacket;