import Packet from "./packet.js";

class GameObjectChangePacket extends Packet {
    constructor(objectId, changes) {
        super("game-object-change");

        this.setData({ objectId, changes });
    }
}

export default GameObjectChangePacket;