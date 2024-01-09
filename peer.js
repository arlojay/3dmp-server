import EventEmitter from "events";
import PeerPacket from "./peerPacket.js";

class Peer extends EventEmitter {
    constructor(ws) {
        super();
        
        this.ws = ws;
        this.id = "";
        this.closed = false;

        this.ws.on("close", () => {
            this.closed = true;
            this.emit("close");
        });
        this.ws.on("error", error => {
            this.emit("error", error);
        });
        this.ws.on("message", data => {
            const packet = new PeerPacket(this, data);
            this.emit(packet.type, packet);
        });
    }

    send(type, content, nonce) {
        this.ws.send(JSON.stringify({ type, content, nonce }));
    }

    close() {
        this.ws.close();
    }
}

export default Peer;