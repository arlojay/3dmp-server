import { Box3, Color, Vector3 } from "three";

class ServerGlobals {
    /**
     * A helper class to describe hardcoded global variables on a server
     */
    constructor() {
        /**
         * @type {Color} Frame clear color (**not** a skybox)
         */
        this.skyColor = new Color(0, 0.5, 1);

        /**
         * @type {Box3} Bounding box for the world. Players cannot escape it client-side. See `PlayerBoundsManager` for enforcement of this rule.
         */
        this.boundingBox = new Box3(new Vector3(-4096, -4096, -4096), new Vector3(4096, 4096, 4096));
    }

    /**
     * Set the sky color (`skyColor`)
     * @param {Color} color Three.js color
     * @returns {ServerGlobals}
     */
    setSkyColor(color) {
        this.skyColor = color;

        return this;
    }

    /**
     * Set the world bounding box (`boundingBox`)
     * @param {Box3} bounds Three.js Box3 depicting bounds
     * @returns {ServerGlobals}
     */
    setWorldBounds(bounds) {
        this.boundingBox = bounds;

        return this;
    }

    /**
     * Serializes the server globals for newly joining players
     * @returns {object}
     */
    serialize() {
        return {
            skyColor: [ this.skyColor.r, this.skyColor.g, this.skyColor.b ],
            boundingBox: [
                this.boundingBox.min.x, this.boundingBox.min.y, this.boundingBox.min.z,
                this.boundingBox.max.x, this.boundingBox.max.y, this.boundingBox.max.z
            ]
        };
    }
}

export default ServerGlobals;