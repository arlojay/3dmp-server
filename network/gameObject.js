import NetworkSceneObject from "./networkSceneObject.js";
import UUID from "../UUID.js";

class GameObject {
    constructor(mesh) {
        this.position = new NetworkSceneObject(mesh.position, "position");
        this.rotation = new NetworkSceneObject(mesh.rotation, "rotation");

        this.mesh = mesh;
        this.destroyed = false;

        this.id = UUID.next();
        this.hidden = new Set();
    }
    
    visibleTo(id) {
        return !this.hidden.has(id);
    }
    
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

    destroy() {
        this.destroyed = true;
    }

    serialize() {
        return {
            id: this.id,
            position: this.position.serialize(),
            rotation: this.rotation.serialize(),
            mesh: this.mesh.toJSON()
        };
    }

    static deserialize(data) {
        const obj = new GameObject(data.mesh);

        return obj;
    }
}

export default GameObject;