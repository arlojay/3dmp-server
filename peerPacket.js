class PeerPacket {
    constructor(peer, data) {
        const { type, content, nonce } = JSON.parse(data);
        this.peer = peer;
        this.type = type;
        this.content = content;
        this.nonce = nonce;
    }

    respond(content) {
        this.peer.send(this.type, content, this.nonce);
    }
}

export default PeerPacket;