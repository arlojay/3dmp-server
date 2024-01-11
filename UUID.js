import { randomText } from "./utils.js";

const usedIds = new Set();
class UUID {
    /**
     * Creates a universally-unique (by runtime) random 24-length hex string
     * @returns {String}
     */
    static next() {
        let id;

        do {
            id = randomText(24, "hex");
        } while(usedIds.has(id));

        usedIds.add(id);
        return id;
    }
}

export default UUID;