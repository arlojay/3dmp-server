import { Euler, HemisphereLight, Mesh, MeshPhongMaterial, PlaneGeometry, Vector3 } from "three";
import Server from "../../server/server.js";
import CustomSceneObject from "../../server/customSceneObject.js";
import ServerGlobals from "../../server/serverGlobals.js";
import PlayerBoundsModule from "../../modules/playerBoundsModule.js";
import PlayerChatModule from "../../modules/playerChatModule.js";
import PlayerModelModule from "../../modules/playerModelModule.js";
import DodgeableBall from "./dodgeableBall.js";


class BallDodgeServer extends Server {
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

        // Create 8 demo dodgeable balls (see ./dodgeableBall.js)
        for(let i = 0; i < 8; i++) {
            // Origins start at z=128 and increase by 64. Speed increases by 0.2.
            const ball = new DodgeableBall(this, new Vector3(0, 0, i * 64 + 128), 1 + i * 0.2, i);

            // Update the balls' positions
            setInterval(() => {
                ball.update(performance.now());
            }, 50);
        }
    }

    getGlobals() {
        return new ServerGlobals()
            .setWorldBounds(this.boundsManager.getBounds()) // Use the PlayerBounds module's bounds that we set
    }
}

export default BallDodgeServer;