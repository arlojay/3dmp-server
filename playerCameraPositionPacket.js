import Packet from "./packet.js";

class PlayerCameraPositionPacket extends Packet {
    constructor(x, y, z) {
        super("player-camera-position");

        this.setData([x, y, z]);
    }
}

export default PlayerCameraPositionPacket;