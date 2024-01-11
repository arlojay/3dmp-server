import { Object3D } from "three";
import Server from "./server.js";

class CustomSceneObject {
    /**
     * A hacky way to add stationary or custom objects to the scene without adding specific support for them
     * @param {Server} server World to add the objects to
     * @param  {...Object3D} objects Any number of 3d objects (lights, static models, etc) to add to the world
     */
    constructor(server, ...objects) {
        const parent = new Object3D();
        for(const object of objects) parent.add(object);
        server.world.createGameObject(parent);

        this.server = server;
    }
}

export default CustomSceneObject;