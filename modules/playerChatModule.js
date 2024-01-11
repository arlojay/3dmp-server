import Player from "../player.js";
import PlayerMessagePacket from "../packet/playerMessagePacket.js";
import ServerModule from "./serverModule.js";

class PlayerChatModule extends ServerModule {
    preinit(server) {
        /**
         * @type {String} Format of chat messages. Default `"{playername}: {message}"`.
         */
        this.format = "{playername}: {message}";
    }

    getId() {
        return "player-chat";
    }

    /**
     * Sets the format of chat messages. Default `"{playername}: {message}"`.
     * @param {String} format
     */
    setFormat(format) {
        this.format = format;
    }

    /**
     * Formats a chat message using this module's rule
     * @param {Player} player Player who sent the message
     * @param {String} text Content of the message
     * @returns {String}
     */
    formatMessage(player, text) {
        return this.format.replace("{playername}", player.id).replace("{message}", text);
    }

    /**
     * Broadcasts the onConnection event to this manager
     * @param {Player} player
     */
    onConnection(player) {
        player.sendMessage("Welcome, " + player.id + "!");
        player.sendMessage("There are " + this.server.players.size + " player(s) online:");
        for(const otherPlayer of this.server.players.values()) {
            player.sendMessage(" - " + otherPlayer.id);
        }
        const packet = new PlayerMessagePacket(player.id + " joined the lobby");
        this.server.broadcast(packet, new Set([player.id]));

        player.peer.on("message", event => {
            const packet = new PlayerMessagePacket(this.formatMessage(player, event.content));
            this.server.broadcast(packet);
        });
    }

    /**
     * Broadcasts the onConnection event to this manager
     * @param {Player} player
     */
    onDisconnection(player) {
        const packet = new PlayerMessagePacket(player.id + " left the lobby");
        this.server.broadcast(packet, new Set([player.id]));
    }
}

export default PlayerChatModule;