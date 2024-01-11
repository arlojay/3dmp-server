import Packet from "./packet.js";

class GameObjectChangePacket extends Packet {
    /**
     * A packet to describe the change in attributes for an object
     * @param {String} objectId ID of the modified object
     * @param {Array<?>} changes List of all changes to the modified object
     */
    constructor(objectId, changes) {
        super("game-object-change");

        this.setData({ objectId, changes });
    }
}

export default GameObjectChangePacket;