import PlayerModelManager from "./playerModelManager";
import Server from "./server";

class BallDodgeServer extends Server {
    init() {
        this.playerModelManager = new PlayerModelManager(this);
    }

    onConnection(player) {
        player
    }
}