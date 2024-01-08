import Packet from "./packet.js";

class GameObjectRemovePacket extends Packet {
    constructor(id) {
        super("remove-object");

        this.setData(id);
    }
}

export default GameObjectRemovePacket;