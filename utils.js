function randomBytes(length) {
    return Buffer.from(new Uint8Array(length).fill(0).map(v => Math.random() * 256).buffer);
}
function randomText(length, encoding) {
    return randomBytes(length).toString(encoding).slice(0, length);
}

export {
    randomBytes, randomText
};