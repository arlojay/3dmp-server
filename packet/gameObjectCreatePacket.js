import GameObject from "../network/gameObject.js";
import Packet from "./packet.js";

class GameObjectCreatePacket extends Packet {
    /**
     * A packet that describes the addition of an object to the level
     * @param {GameObject} gameObject Added gameObject
     */
    constructor(gameObject) {
        super("add-object");

        this.setData(gameObject.serialize());
    }
}

export default GameObjectCreatePacket;