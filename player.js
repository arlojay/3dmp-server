class Player {
    constructor(peer) {
        this.peer = peer;
    }

    get id() {
        return this.peer.id;
    }

    send(packet) {
        packet.send(this.peer);
    }
}

export default Player;