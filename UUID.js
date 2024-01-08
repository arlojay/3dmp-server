import { randomText } from "./utils.js";

const usedIds = new Set();
class UUID {
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