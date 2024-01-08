class Packet {
    constructor(id) {
        this.id = id;
        this.data = null;
    }

    setData(newData) {
        this.data = newData;
    }

    send(peer) {
        peer.send(this.id, this.data);
    }
}

export default Packet;