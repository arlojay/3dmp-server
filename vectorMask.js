class VectorMask {
    /**
     * A vector/euler mask for controlling which fields are set on the client. When the client receives an unmasked packet, it may have moved farther than the server has acknowledged, leading to the client teleporting backwards. With a mask, the client will not set dimensions that should not be sent.
     * @param {Boolean} x
     * @param {Boolean} y
     * @param {Boolean} z
     */
    constructor(x, y, z) {
        /**
         * @type {Boolean} Whether or not to set the X
         */
        this.x = x;

        /**
         * @type {Boolean} Whether or not to set the Y
         */
        this.y = y;

        /**
         * @type {Boolean} Whether or not to set the Z
         */
        this.z = z;

        /**
         * @type {Number} Integer byte mask, bits depicting which values to mask (1b means send, 0b means omit)
         */
        this.i = (x ? 0b100 : 0b000) | (y ? 0b010 : 0b000) | (z ? 0b001 : 0b000);
    }
}

export default VectorMask;