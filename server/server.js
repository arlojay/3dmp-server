import ConnectionInterface from "../connectionInterface.js";
import GameObjectChangePacket from "../gameObjectChangePacket.js";
import GameObjectCreatePacket from "../gameObjectCreatePacket.js";
import GameObjectRemovePacket from "../gameObjectRemovePacket.js";
import PeerPacket from "../peerPacket.js";
import Player from "../player.js";
import ServerWorld from "./serverWorld.js";

class Server {
    constructor() {
        /**
         * @type {Map<String, Player>}
         */
        this.players = new Map();

        /**
         * @type {ConnectionInterface}
         */
        this.connectionInterface = null;
        this.id = "";

        this.world = new ServerWorld();
        this.world.on("change", event => {
            const packet = new GameObjectChangePacket(event.gameObject.id, event.packet);
            this.broadcast(packet, event.gameObject.hidden);
        });
        this.world.on("add-object", gameObject => {
            const packet = new GameObjectCreatePacket(gameObject);
            this.broadcast(packet, gameObject.hidden);
        });
        this.world.on("remove-object", gameObject => {
            const packet = new GameObjectRemovePacket(gameObject.id);
            this.broadcast(packet, gameObject.hidden);
        });
        this.world.on("set-object-visibility", event => {
            const player = this.players.get(event.playerId);
            let packet;
            if(event.visible) {
                packet = new GameObjectCreatePacket(event.gameObject);
            } else {
                packet = new GameObjectRemovePacket(event.gameObject.id);
            }
            player.send(packet);
        });

        this.init();
    }

    setConnectionInterface(connectionInterface) {
        this.connectionInterface = connectionInterface;
        
        this.initConnectionHandlers();
    }
    setId(id) {
        this.id = id;
    }

    broadcast(packet, ignore = new Set()) {
        for(const player of this.players.values()) {
            if(ignore.has(player.id)) continue;
            player.send(packet);
        }
    }

    initConnectionHandlers() {
        this.connectionInterface.on("connection", peer => {
            console.log("Peer connected! " + peer.id);
            this.initPeer(peer);
        });
        this.connectionInterface.on("disconnect", peer => {
            console.log("Peer disconnected! " + peer.id);
            this.freePeer(peer);
        });
    }

    initPeer(peer) {
        peer.on("get-level", /**
         * @param {PeerPacket} packet
         */ (packet) => {
            packet.respond(this.getWorld().serialize());
        });

        const player = new Player(peer);
        this.players.set(player.id, player);

        this.onConnection(player);
    }

    freePeer(peer) {
        const player = this.players.get(peer.id);
        this.players.delete(peer.id);

        this.onDisconnection(player);
    }

    getWorld() {
        return this.world;
    }
    

    init() { }
    onConnection(player) { }
    onDisconnection(player) { }
}

export default Server;