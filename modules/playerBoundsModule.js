import { Box3, Vector3 } from "three";
import ServerModule from "./serverModule.js";

class PlayerBoundsModule extends ServerModule {
    preinit(server) {
        /**
         * @type {Vector3} Minimum bounding box point
         */
        this.min = new Vector3(-1, -1, -1);
        
        /**
         * @type {Vector3} Maximum bounding box point
         */
        this.max = new Vector3(1, 1, 1);
        
        /**
         * @type {Box3} Bounding box represented by a Three.js Box3
         */
        this.bounds = new Box3(this.min, this.max);
    }

    getId() {
        return "player-bounds";
    }

    onConnection(player) {
        // Listens for when the player moves in the world
        player.on("move", position => {
            // Set the player position if outside the minimums or maximums
            let changed = false;
            if(position.x > this.max.x) {
                position.x = this.max.x;
                changed = true;
            }
            if(position.x < this.min.x) {
                position.x = this.min.x;
                changed = true;
            }

            if(position.y > this.max.y) {
                position.y = this.max.y;
                changed = true;
            }
            if(position.y < this.min.y) {
                position.y = this.min.y;
                changed = true;
            }
            
            if(position.z > this.max.z) {
                position.z = this.max.z;
                changed = true;
            }
            if(position.z < this.min.z) {
                position.z = this.min.z;
                changed = true;
            }

            // Moves the player to the changed coordinates
            if(changed) player.pushPosition();
        });
    }


    /**
     * Sets the minimum bounding box point
     * @param {Number} x Min X
     * @param {Number} y Min Y
     * @param {Number} z Min Z
     */
    setBoundsMin(x, y, z) {
        this.min.set(x, y, z);
    }
    
    /**
     * Sets the maximum bounding box point
     * @param {Number} x Max X
     * @param {Number} y Max Y
     * @param {Number} z Max Z
     */
    setBoundsMax(x, y, z) {
        this.max.set(x, y, z);
    }

    /**
     * Sets both minimum and maximum bounding box points
     * @param {Number} minX Min X
     * @param {Number} minY Min Y
     * @param {Number} minZ Min Z
     * @param {Number} maxX Max X
     * @param {Number} maxY Max Y
     * @param {Number} maxZ Max Z
     */
    setBounds(minX, minY, minZ, maxX, maxY, maxZ) {
        this.setBoundsMin(minX, minY, minZ);
        this.setBoundsMax(maxX, maxY, maxZ);
    }

    /**
     * Gets a clone of the bounding box. Useful for sending to clients.
     * @returns {Box3}
     */
    getBounds() {
        return this.bounds.clone();
    }
}

export default PlayerBoundsModule;