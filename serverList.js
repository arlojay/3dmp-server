import Server from "./server/server.js";
import ConnectionInterface from "./connectionInterface.js";

class ServerList {
    /**
     * A container for listing and managing multiple concurrent servers
     */
    constructor() {
        /**
         * @type {Map<String, Server>}
         */
        this.servers = new Map();
        
        /**
         * @type {Map<String, ConnectionInterface>}
         */
        this.connectionInterfaces = new Map();
    }

    /**
     * Registers a newly created server in the server list and sets its id
     * @param {String} id ID to save the server as
     * @param {Server} server Newly created server instance. Do not run asynchronously.
     * @returns {Server}
     */
    createServer(id, server) {
        if(this.servers.has(id)) throw new Error("Server with id " + id + " already exists!");

        const connectionInterface = new ConnectionInterface();
        server.setConnectionInterface(connectionInterface);
        server.setId(id);

        this.servers.set(id, server);
        this.connectionInterfaces.set(id, connectionInterface);

        return server;
    }

    /**
     * Handle a connection to a server
     * @param {WebSocket} ws Socket opened by the client and connection
     * @param {Request} request Original http request before upgrading
     */
    handleConnection(ws, request) {
        const id = request.query.id;

        if(id == null) throw new Error("No id specified");
        if(!this.servers.has(id)) throw new Error("No server with id " + id + " exists");

        const connectionInterface = this.connectionInterfaces.get(id);
        connectionInterface.handleConnect(ws);
    }
    
    /**
     * Gets the stripped version of the server list for sending to clients
     * @returns {Array<object>}
     */
    serialize() {
        const output = new Array();

        for(const server of this.servers.values()) {
            output.push({
                id: server.id,
                players: server.players.size
            });
        }

        return output;
    }
}

export default ServerList;