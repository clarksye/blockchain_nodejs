const PubNub = require('pubnub');

class PubNubClient {
    constructor({ blockchain, transactionPool }) {
        this.pubnub = new PubNub({
            publishKey: "pub-c-8a408912-60eb-49d6-aca2-92af6832a45c",
            subscribeKey: "sub-c-4e77cbb2-66f9-481b-9396-070d2b6b2a62",
            secretKey: "sec-c-NjA3ZDEwOTUtMTdlZC00YjNiLWFmZTMtMzNiZjQyYWZiYTgz",
            uuid: PubNub.generateUUID(),
            logVerbosity: false, // Optional: Set to true for debugging
        });

        this.pubnub.addListener({
            message: this.handleMessage.bind(this),
            presence: this.handlePresence.bind(this),
            status: this.handleStatus.bind(this),
        });

        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
    }

    subscribe(channels) {
        this.pubnub.subscribe({
            channels: channels,
            withPresence: false,
        });
    }

    publish({ channel, message }) {
        this.pubnub.publish({
            channel: channel,
            message: JSON.stringify(message),
        });
    }

    unsubscribe(channels) {
        this.pubnub.unsubscribe({
            channels: channels,
        });
    }

    handleMessage(event) {
        // Mendapatkan UUID pengirim pesan dan UUID lokal
        const senderUUID = event.publisher;
        const localUUID = this.pubnub.getUUID();

        // Memeriksa apakah pesan diterima dari pengirim yang berbeda
        if (senderUUID === localUUID) return;

        const message = JSON.parse(event.message);
        console.log(`Received message on channel ${event.channel}:`, message);

        switch(event.channel) {
            case "BLOCKCHAIN":
                this.blockchain.replaceChain(message, true, () => {
                    this.transactionPool.clearBlockchainTransactions({
                        chain: message 
                    });
                });
                break;
            case "TRANSACTION":
                this.transactionPool.setTransaction(message);
                break;
            default:
                return;
        }
    }

    handlePresence(event) {
        console.log(`Presence event on channel ${event.channel}:`, event);
    }

    handleStatus(status) {
        console.log('PubNub Status:', status);
    }

    broadcastChain() {
        this.publish({
            channel: "BLOCKCHAIN",
            message: this.blockchain.chain
        });
    }

    broadcastTransaction(transaction) {
        this.publish({
            channel: "TRANSACTION",
            message: transaction
        })
    }
}

module.exports = PubNubClient;