import { Color, Vector2, Vector3 } from "three";
import config from "../config.js";
import ConnectionInterface from "../connectionInterface.js";
import GameObjectChangePacket from "../packet/gameObjectChangePacket.js";
import GameObjectCreatePacket from "../packet/gameObjectCreatePacket.js";
import GameObjectRemovePacket from "../packet/gameObjectRemovePacket.js";
import Packet from "../packet/packet.js";
import Player from "../player.js";
import ServerGlobals from "./serverGlobals.js";
import ServerWorld from "./serverWorld.js";
import Peer from "../peer.js";
import ServerModule from "../modules/serverModule.js";

class Server {
    constructor() {
        /**
         * @type {Map<String, Player>} All players on the server
         */
        this.players = new Map();

        /**
         * @type {ConnectionInterface} Interface which the server listens to for peer connections
         */
        this.connectionInterface = null;

        /**
         * @type {String} ID associated with this server from `ServerList#createServer()`
         */
        this.id = "";

        /**
         * @type {ServerWorld} World this server is simulating
         */
        this.world = new ServerWorld();

        /**
         * @type {Array<String, ServerModule>} List of modules this server broadcasts events to
         */
        this.modules = new Map();


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
        this.modules.forEach(module => module.init(this));
    }

    /**
     * Registers a module for this server to add events to automatically
     * @param {ServerModule} modules Module(s) to register
     */
    registerModules(...modules) {
        for(const module of modules) {
            this.modules.set(module.getId(), module);
            module.preinit(this);
        }
    }

    /**
     * Sets and listens to the connection interface for the server
     * @param {ConnectionInterface} connectionInterface New instance
     * @internal
     */
    setConnectionInterface(connectionInterface) {
        this.connectionInterface = connectionInterface;
        
        this.connectionInterface.on("connection", peer => {
            console.log("Peer connected! " + peer.id);
            this.initPeer(peer);
        });
        this.connectionInterface.on("disconnect", peer => {
            console.log("Peer disconnected! " + peer.id);
            this.freePeer(peer);
        });
    }

    /**
     * Sets the ID of the server (on creation)
     * @type {String}
     * @internal
     */
    setId(id) {
        this.id = id;
    }

    /**
     * Sends a packet to the entire server. Players can be excluded from the broadcast via the `ignore` Set.
     * @param {Packet} packet Packet to send
     * @param {Set<String>} ignore Players (by id) to ignore
     */
    broadcast(packet, ignore = new Set()) {
        for(const player of this.players.values()) {
            if(ignore.has(player.id)) continue;
            player.send(packet);
        }
    }
    
    /**
     * Get the globals for this server instance (customizable per player)
     * @param {Player} player Player joining the server
     * @returns {ServerGlobals}
     */
    getGlobals(player) {
        return new ServerGlobals();
    }

    /**
     * Initializes and initiates a peer into the server (right after the Peer wrapper is instantiated)
     * @param {Peer} peer Peer that connected
     */
    initPeer(peer) {
        const player = new Player(peer);
        this.players.set(player.id, player);

        peer.on("get-level", (packet) => {
            packet.respond({
                world: this.world.serialize(player),
                globals: Object.assign({
                    pollingRate: config.networkUpdatePollingRate
                }, this.getGlobals(player).serialize())
            });
        });

        const callback = () => {
            peer.off("ready", callback);
            
            try {
                this.modules.forEach(module => module.onConnection(player));
                this.onConnection(player);
            } catch(e) {
                console.error(e);
                peer.close();
            }
        };

        peer.on("ready", callback);
    }

    /**
     * Frees and deconstructs a peer (when the connection is terminated)
     * @param {Peer} peer Peer that disconnected
     */
    freePeer(peer) {
        const player = this.players.get(peer.id);
        this.players.delete(peer.id);

        try {
            this.modules.forEach(module => module.onDisconnection(player));
            this.onDisconnection(player);
        } catch(e) {
            console.error(e);
        }
    }
    

    /**
     * Runs right after construction. Initialize the custom server logic here.
     */
    init() { }

    /**
     * Runs when a player joins the server, after initiation. Listen for events from players here.
     * @param {Player} player Player that connected
     */
    onConnection(player) { }

    /**
     * Runs when a player leaves the server, after freeing. Clean up extra player logic here.
     * @param {Player} player Player that disconnected
     */
    onDisconnection(player) { }
}

export default Server;