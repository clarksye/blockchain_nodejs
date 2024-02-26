const { STARTING_BALANCE } = require("../config");
const { ec, cryptoHash } = require("../util");
const Transaction = require('./transaction')

class Wallet {
    constructor() {
        this.balance = STARTING_BALANCE;
        this.keyPair = ec.genKeyPair();
        this.publicKey = this.keyPair.getPublic('hex');
    }

    sign(data) {
        return this.keyPair.sign(cryptoHash(data));
    }

    createTransaction({ amount, recipient }) {
        if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
            throw new Error('Amount not valid');
        }
        
        if (amount > this.balance) {
            throw new Error('Amount exceeds balance');
        }

        const transaction = new Transaction({ senderWallet: this, recipient, amount });

        return transaction;
    }
}

module.exports = Wallet;