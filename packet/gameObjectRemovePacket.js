import Packet from "./packet.js";

class GameObjectRemovePacket extends Packet {
    /**
     * A packet describing the removal of an object from the level
     * @param {String} id ID of the removed object
     */
    constructor(id) {
        super("remove-object");

        this.setData(id);
    }
}

export default GameObjectRemovePacket;