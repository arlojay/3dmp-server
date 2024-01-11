import { Euler, Vector3 } from "three";
import Packet from "./packet/packet.js";
import PlayerCameraPositionPacket from "./packet/playerCameraPositionPacket.js";
import PlayerMessagePacket from "./packet/playerMessagePacket.js";
import PlayerCameraRotationPacket from "./packet/playerCameraRotationPacket.js";
import VectorMask from "./vectorMask.js";
import EventEmitter from "node:events";
import Peer from "./peer.js";

class Player extends EventEmitter {
    /**
     * An instance of a player in a server, used for controlling and listening to the user
     * @param {Peer} peer Peer connection wrapper
     */
    constructor(peer) {
        super();

        /**
         * @type {Peer} Peer connection wrapper (broadcasts raw packets)
         */
        this.peer = peer;

        /**
         * @type {Vector3} Server-side position of the player. Use `setPosition(vector)` to change it on the client.
         */
        this.position = new Vector3(0, 0, 0);

        /**
         * @type {Euler} Server-side rotation of the player. Use `setRotation(vector)` to change it on the client.
         */
        this.rotation = new Euler(0, 0, 0);


        peer.on("set-player-position", packet => {
            const [x, y, z] = packet.content;
            this.position.set(x, y, z);

            this.emit("move", this.position);
        });
        peer.on("set-player-rotation", packet => {
            const [x, y, z, order] = packet.content;
            this.rotation.set(x, y, z);
            this.rotation.order = order;

            this.emit("rotate", this.rotation);
        });
    }

    /**
     * ID of the peer
     * @returns {String}
     */
    get id() {
        return this.peer.id;
    }

    /**
     * Sends a packet (automatically serializes and sends)
     * @param {Packet} packet Packet to send to the client
     */
    send(packet) {
        packet.send(this.peer);
    }

    /**
     * Sends a chat message (raw string) to the client
     * @param {String} message Chat message to send
     */
    sendMessage(message) {
        const packet = new PlayerMessagePacket(message);
        this.send(packet);
    }

    /**
     * Sets the position client-side. Use `PlayerBoundsManager` to create artificial boundaries. Use the `VectorMask` to help prevent stutter/"glitching" on the client.
     * @param {Vector3} position New positiont to set
     * @param {VectorMask?} mask Mask to determine which values to change on the client. Use of this can help prevent stutter. If no mask is specified, it will be inferred.
     */
    setPosition(position, mask = null) {
        if(mask == null) mask = new VectorMask(position.x != this.position.x, position.y != this.position.y, position.z != this.position.z);

        if(mask.i == 0) return;
        const packet = new PlayerCameraPositionPacket(position.x, position.y, position.z, mask);
        this.position.copy(position);
        this.send(packet);
    }

    /**
     * Sets the rotation client-and-server-side. Use `PlayerBoundsManager` to create artificial boundaries. Use the `VectorMask` to help prevent stutter/"glitching" on the client.
     * @param {Vector3} rotation New rotation to set
     * @param {VectorMask?} mask Mask to determine which values to change on the client. Use of this can help prevent stutter. If no mask is specified, it will be inferred.
     */
    setRotation(rotation, mask = null) {
        if(mask == null) mask = new VectorMask(rotation.x != this.rotation.x, rotation.y != this.rotation.y, rotation.z != this.rotation.z);

        if(mask.i == 0) return;
        const packet = new PlayerCameraRotationPacket(rotation.x, rotation.y, rotation.z, mask);
        this.rotation.copy(rotation);
        this.send(packet);
    }

    /**
     * Sets the player's position to itself to push an update to the client
     */
    pushPosition() {
        this.setPosition(this.position);
    }

    /**
     * Sets the player's rotation to itself to push an update to the client
     */
    pushRotation() {
        this.setRotation(this.rotation);
    }
}

export default Player;