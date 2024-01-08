class NetworkVariable {
    constructor(initialValue, id) {
        this.id = id;
        this._value = initialValue;
        this.changed = false;
    }

    set value(newValue) {
        if(newValue == this._value) return;

        this._value = newValue;
        this.changed = true;
    }

    get value() {
        return this._value;
    }

    read() {
        this.changed = false;
        return this.value;
    }

    serialize() {
        return this._value;
    }
}

export default NetworkVariable;