import { Euler, Vector3 } from "three";
import PlayerCameraPositionPacket from "./playerCameraPositionPacket.js";
import PlayerMessagePacket from "./playerMessagePacket.js";
import PlayerCameraRotationPacket from "./playerCameraRotationPacket.js";

class Player {
    constructor(peer) {
        this.peer = peer;
        this.position = new Vector3(0, 0, 0);
        this.rotation = new Euler(0, 0, 0);
    }

    get id() {
        return this.peer.id;
    }

    send(packet) {
        packet.send(this.peer);
    }

    sendMessage(message) {
        const packet = new PlayerMessagePacket(message);
        this.send(packet);
    }

    setPosition(position) {
        const packet = new PlayerCameraPositionPacket(position.x, position.y, position.z);
        this.position.copy(position);
        this.send(packet);
    }

    setRotation(rotation) {
        const packet = new PlayerCameraRotationPacket(rotation.x, rotation.y, rotation.z);
        this.rotation.copy(rotation);
        this.send(packet);
    }
}

export default Player;