import Packet from "./packet.js";

class PlayerCameraRotationPacket extends Packet {
    /**
     * A packet to change the rotation of the camera for a client
     * @param {Number} x X Euler rotation of the camera
     * @param {Number} y Y Euler rotation of the camera
     * @param {Number} z Z Euler rotation of the camera
     * @param {VectorMask} mask mask to apply to the changed angles
     */
    constructor(x, y, z, mask) {
        super("player-camera-rotation");

        this.setData({ rot: [x, y, z], mask: mask.i });
    }
}

export default PlayerCameraRotationPacket;