import NetworkSceneObject from "./networkSceneObject.js";
import UUID from "../UUID.js";
import { Euler, Mesh } from "three";

class GameObject {
    /**
     * The building block of all worlds, created with one base Three.js Mesh
     * @param {Mesh} mesh Three.js mesh to create this object for
     */
    constructor(mesh) {
        /**
         * @type {NetworkSceneObject<Vector3>} Position of this object
         */
        this.position = new NetworkSceneObject(mesh.position, "position");
        
        /**
         * @type {NetworkSceneObject<Euler>} Rotation of this object
         */
        this.rotation = new NetworkSceneObject(mesh.rotation, "rotation");

        /**
         * @type {Mesh} Three.js mesh that represents this object
         */
        this.mesh = mesh;

        /**
         * @type {Boolean} Whether or not this object has been destroyed (removed from the server world) and should be cleaned up
         */
        this.destroyed = false;

        /**
         * @type {String} UUID of this object
         */
        this.id = UUID.next();

        /**
         * @type {Set<String>} IDs of players this object is hidden for
         */
        this.hidden = new Set();
    }
    
    /**
     * Checks whether or not this object is visible to a player
     * @param {String} id Player ID
     * @returns {Boolean}
     */
    visibleTo(id) {
        return !this.hidden.has(id);
    }
    
    /**
     * Gets the changed variables of this object
     * @returns {Array<NetworkSceneObject<any>>}
     */
    getChanges() {
        const changes = new Array();

        if(this.position.changed) {
            changes.push(this.position);
            this.position.read();
        }
        if(this.rotation.changed) {
            changes.push(this.rotation);
            this.rotation.read();
        }

        return changes;
    }

    /**
     * Flags this object as destroyed
     */
    destroy() {
        this.destroyed = true;
    }

    /**
     * Serializes this object to send to a client
     * @returns {object}
     */
    serialize() {
        return {
            id: this.id,
            position: this.position.serialize(),
            rotation: this.rotation.serialize(),
            mesh: this.mesh.toJSON()
        };
    }
}

export default GameObject;