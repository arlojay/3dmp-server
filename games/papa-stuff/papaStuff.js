import { Color, Euler, HemisphereLight, Mesh, MeshNormalMaterial, MeshPhongMaterial, PlaneGeometry, SphereGeometry, Vector3 } from "three";
import Server from "../../server/server.js";
import CustomSceneObject from "../../server/customSceneObject.js";
import ServerGlobals from "../../server/serverGlobals.js";
import PlayerBoundsModule from "../../modules/playerBoundsModule.js";
import PlayerChatModule from "../../modules/playerChatModule.js";
import PlayerModelModule from "../../modules/playerModelModule.js";

class PapaStuffServer extends Server {
    init() {
        // Register modules for the server
        this.registerModules(
            new PlayerModelModule(this), // Show players in the world with a skull model
            new PlayerChatModule(this), // Allow players to chat
            this.boundsManager = new PlayerBoundsModule(this) // Force players to stay within the play area
        );
        
        // Set world bounds (PlayerBounds module)
        this.boundsManager.setBounds(
            -64, 16, 0,
            64, 16, 1024
        );

        // Create the sky light
        this.hemisphereLight = new CustomSceneObject(this, new HemisphereLight(0xffffff, 0x443300));

        // Create the ground and move it
        const ground = this.world.createGameObject(new Mesh(new PlaneGeometry(128, 1024), new MeshPhongMaterial({ color: 0x888888 })));
        ground.rotation.value.copy(new Euler(Math.PI * -0.5, 0, 0)); // Rotate -90deg on the x axis to make flat
        ground.position.value.copy(new Vector3(0, 0, 512)); // Move 512 units in Z to make one of the edges at z=0 (start of the level)

        this.world.createGameObject(new Mesh(new SphereGeometry(64), new MeshNormalMaterial()));

    }

    getGlobals() {
        return new ServerGlobals()
            .setWorldBounds(this.boundsManager.getBounds()) // Use the PlayerBounds module's bounds that we set
            .setSkyColor(new Color(0.3,0,0.6))
    }
}

export default PapaStuffServer;