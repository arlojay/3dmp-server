import { Euler, Quaternion, Vector2, Vector3, Vector4 } from "three";

class NetworkSceneObject {
    constructor(initialValue, id) {
        this.id = id;
        this._value = initialValue;
        this.oldValue = initialValue.clone();
        this._changed = false;
    }

    set value(newValue) {
        if(newValue == this._value && newValue.equals(this._value)) return;

        this.oldValue = newValue.clone();
        this._value = newValue;
        this._changed = true;
    }

    get value() {
        return this._value;
    }

    get changed() {
        return this._changed || !this._value.equals(this.oldValue);
    }

    read() {
        if(this.changed) {
            this.oldValue = this._value.clone();
            this._changed = false;
        }
        return this.value;
    }

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