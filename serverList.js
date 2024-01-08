import Server from "./server/server.js";
import ConnectionInterface from "./connectionInterface.js";

class ServerList {
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
     * @param {WebSocket} ws 
     * @param {Request} request 
     */
    handleConnection(ws, request) {
        const id = request.query.id;

        if(id == null) throw new Error("No id specified");
        if(!this.servers.has(id)) throw new Error("No server with id " + id + " exists");

        const connectionInterface = this.connectionInterfaces.get(id);
        connectionInterface.handleConnect(ws);
    }
    
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