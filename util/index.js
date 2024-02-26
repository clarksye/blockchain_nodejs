const EC = require('elliptic').ec;
const cryptoHash = require('./crypto-hash');

const ec = new EC('secp256k1');

function verifySignature({publicKey, data, signature}) {
    // Import the public key
    const importedKey = ec.keyFromPublic(publicKey, 'hex');

    // Verify the signature
    return importedKey.verify(cryptoHash(data), signature);
}

module.exports = { ec, verifySignature, cryptoHash };