import Packet from "./packet.js";
import VectorMask from "../vectorMask.js";

class PlayerCameraPositionPacket extends Packet {
    /**
     * A packet to change the position of the camera for a client
     * @param {Number} x X position of the camera
     * @param {Number} y Y position of the camera
     * @param {Number} z Z position of the camera
     * @param {VectorMask} mask mask to apply to the relocation
     */
    constructor(x, y, z, mask) {
        super("player-camera-position");

        this.setData({ pos: [x, y, z], mask: mask.i });
    }
}

export default PlayerCameraPositionPacket;