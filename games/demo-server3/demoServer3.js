import { BoxGeometry, HemisphereLight, Mesh, MeshBasicMaterial, MeshNormalMaterial, SphereGeometry, Vector3 } from "three";
import CustomSceneObject from "../../server/customSceneObject.js";
import Server from "../../server/server.js";
import ServerGlobals from "../../server/serverGlobals.js";
import PlayerChatModule from "../../modules/playerChatModule.js";
import PlayerModelModule from "../../modules/playerModelModule.js";

class DemoServer3 extends Server {
    init() {
        this.registerModules(new PlayerModelModule(this), new PlayerChatModule(this));

        this.hemisphereLight = new CustomSceneObject(this, new HemisphereLight(0xffffff, 0x443300));

        this.playSpace = new Mesh(
            new BoxGeometry(1024, 1024, 1024),
            new MeshBasicMaterial({ color: 0x888888, wireframe: true })
        );
        this.playSpaceObject = this.world.createGameObject(this.playSpace);

        this.playSpace.geometry.computeBoundingBox();

        this.world.createGameObject(new Mesh(new SphereGeometry(64), new MeshNormalMaterial()));
    }

    getGlobals() {
        return new ServerGlobals()
            .setWorldBounds(this.playSpace.geometry.boundingBox)
    }

    onConnection(player) {
        player.peer.on("key", packet => {
            if(packet.content == "r") {
                randomPos();
            }
        });

        const MAX_DIST = 512;
        function randomPos() {
            player.setPosition(new Vector3(
                (Math.random() - 0.5) * MAX_DIST,
                (Math.random() - 0.5) * MAX_DIST,
                (Math.random() - 0.5) * MAX_DIST
            ));
        }
    }
}

export default DemoServer3;