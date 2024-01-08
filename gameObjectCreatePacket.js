import Packet from "./packet.js";

class GameObjectCreatePacket extends Packet {
    constructor(gameObject) {
        super("add-object");

        this.setData(gameObject.serialize());
    }
}

export default GameObjectCreatePacket;