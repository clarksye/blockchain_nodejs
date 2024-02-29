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

    createTransaction({ amount, recipient, chain }) {
        if (chain) {
            this.balance = Wallet.calculateBalance({
                chain,
                address: this.publicKey
            })
        }

        const transaction = new Transaction({ senderWallet: this, recipient, amount });

        return transaction;
    }

    static calculateBalance({ chain, address }) {
        let hasConductedTransaction = false;
        let outputTotal = 0;

        for (let i = chain.length - 1; i > 0; i--) {
            const block = chain[i];

            for (let transaction of block.data) {
                if (transaction.input.address === address) {
                    hasConductedTransaction = true;
                }

                const addressOutput = transaction.outputMap[address];

                if (addressOutput) {
                    outputTotal += addressOutput;
                }
            }

            if (hasConductedTransaction) {
                break;
            }

        }

        return hasConductedTransaction ? outputTotal : STARTING_BALANCE + outputTotal;
    }
}

module.exports = Wallet;