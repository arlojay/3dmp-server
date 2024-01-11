import { Euler, Quaternion, Vector2, Vector3, Vector4 } from "three";

/**
 * @template T
 */
class NetworkSceneObject {
    /**
     * Core of the network syncing. Stores a position, rotation, etc. and checks if it has changed from last read when called upon.
     * @param {T} initialValue First/initial value of the object
     * @param {String} id ID to determine the type/reference of the object on the client
     */
    constructor(initialValue, id) {
        /**
         * @type {String} ID to determine the type/reference of the object on the client
         */
        this.id = id;
        
        /**
         * @type {T} Value cached from last read
         */
        this.oldValue = initialValue.clone();

        this._value = initialValue;
        this._changed = false;
    }

    /**
     * @param {T} newValue Changes the base instance of this network object
     */
    set value(newValue) {
        if(newValue == this._value && newValue.equals(this._value)) return;

        this.oldValue = newValue.clone();
        this._value = newValue;
        this._changed = true;
    }

    /**
     * @returns {T}
     */
    get value() {
        return this._value;
    }

    /**
     * Checks whether or not the last read value is different from the current value
     * @returns {Boolean}
     */
    get changed() {
        return this._changed || !this._value.equals(this.oldValue);
    }

    /**
     * Resets the old value to the current value and marks the variable as unchanged
     * @returns {T}
     */
    read() {
        if(this.changed) {
            this.oldValue = this._value.clone();
            this._changed = false;
        }
        return this.value;
    }

    /**
     * Serializes this instance into a network-safe/transferrable object
     * @returns {any}
     */
    serialize() {
        if(this._value instanceof Vector2) return [this._value.x, this._value.y];
        if(this._value instanceof Vector3) return [this._value.x, this._value.y, this._value.z];
        if(this._value instanceof Vector4) return [this._value.x, this._value.y, this._value.z, this._value.w];

        if(this._value instanceof Euler) return [this._value.x, this._value.y, this._value.z, this._value.order];
        if(this._value instanceof Quaternion) return [this._value.x, this._value.y, this._value.z, this._value.w];

        return this._value;
    }
}

export default NetworkSceneObject;