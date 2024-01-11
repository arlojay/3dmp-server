import Player from "../player.js";
import Server from "../server/server.js";
import { randomText } from "../utils.js";

class ServerModule {
    /**
     * A base class for server modules. Modules follow a "plug-and-play" registration paradigm.
     * @param {Server} server Server this module was instantiated for
     */
    constructor(server) {
        /**
         * @type {Server} Module this server was instantiated for
         */
        this.server = server;
    }

    /**
     * The ID for the module. The module can be accessed through `Server#getModule(<this id>)`.
     * @returns {String}
     */
    getId() {
        return "module-" + randomText(16, "hex");
    }

    /**
     * Runs after the plugin is registered. Initialize module fields here.
     * @param {Server} server Server this module was instantiated for
     */
    preinit(server) { }

    /**
     * Runs after the server is initialized. Initialize module handlers here.
     * @param {Server} server Server this module was instantiated for
     */
    init(server) { }

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

export default ServerModule;