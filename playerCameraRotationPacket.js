import Packet from "./packet.js";

class PlayerCameraRotationPacket extends Packet {
    constructor(x, y, z) {
        super("player-camera-rotation");

        this.setData([x, y, z]);
    }
}

export default PlayerCameraRotationPacket;