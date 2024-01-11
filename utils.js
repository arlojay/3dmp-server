/**
 * Creates and fills a buffer (with a specified `length`) with random values
 * @param {Number} length Number of bytes to randomly create
 * @returns {Buffer}
 */
function randomBytes(length) {
    return Buffer.from(new Uint8Array(length).fill(0).map(v => Math.random() * 256).buffer);
}

/**
 * Gets a random string of text following a certain encoding
 * @param {Number} length Final length of the string
 * @param {String} encoding Buffer encoding to use to stringify
 * @returns {String}
 */
function randomText(length, encoding) {
    return randomBytes(length).toString(encoding).slice(0, length);
}

export {
    randomBytes, randomText
};