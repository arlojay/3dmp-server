/**
 * @template T
 */
class NetworkVariable {
    /**
     * Core of the network syncing. Stores a number, string, etc. and checks if it has changed from last read when called upon.
     * @param {T} initialValue First/initial value of the object
     * @param {String} id ID to determine the type/reference of the value on the client
     */
    constructor(initialValue, id) {
        /**
         * @type {String} ID to determine the type/reference of the object on the client
         */
        this.id = id;

        /**
         * @type {Boolean} Whether or not this variable has been changed since last read
         */
        this.changed = false;


        this._value = initialValue;
    }

    /**
     * @param {T} newValue Changes the value of this network object
     */
    set value(newValue) {
        if(newValue == this._value) return;

        this._value = newValue;
        this.changed = true;
    }

    /**
     * @returns {T}
     */
    get value() {
        return this._value;
    }

    /**
     * Resets the old value to the current value and marks the variable as unchanged
     * @returns {T}
     */
    read() {
        this.changed = false;
        return this.value;
    }

    /**
     * Serializes this instance into a network-safe/transferrable object or value
     * @returns {any}
     */
    serialize() {
        return this._value;
    }
}

export default NetworkVariable;