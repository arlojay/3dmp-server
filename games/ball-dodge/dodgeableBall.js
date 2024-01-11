import { Mesh, MeshPhongMaterial, SphereGeometry, Vector3 } from "three";
import Server from "../../server/server.js";

// Custom class for easier management of objects
class DodgeableBall {
    /**
     * @param {Server} server Host server instance
     * @param {Vector3} origin Origin of the movement
     * @param {Number} speed Speed of the movement (cycles per 2pi seconds)
     * @param {Number} offset Phase offset of the movement
     */
    constructor(server, origin, speed, offset) {
        // The server instance is needed in order to realize the GameObject
        this.server = server;
        this.origin = origin;
        this.speed = speed;
        this.offset = offset;
        
        // Create the Three.js mesh for the ball object
        const mesh = new Mesh(new SphereGeometry(16), new MeshPhongMaterial({ color: 0xff0000 }));

        // Realize the game object in the server world
        this.gameObject = server.world.createGameObject(mesh);
    }

    update(time) {
        // Calculate the new object position
        const offset = new Vector3(
            Math.sin(time * 0.001 * this.speed + this.offset) * 50, // Moves along the X axis in respect to time
            0,  // Static in the Y axis
            0   // Static in the Z axis
        );
        
        // Reset the game object to the ball origin and add the offset
        this.gameObject.position.value.copy(this.origin).add(offset);
    }
}

export default DodgeableBall;