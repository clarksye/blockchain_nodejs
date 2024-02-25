const PubNub = require('pubnub');

const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN',
    TRANSACTION: 'TRANSACTION'
}

class PubNubClient {
    constructor() {
        this.pubnub = new PubNub({
            publishKey: "pub-c-8a408912-60eb-49d6-aca2-92af6832a45c",
            subscribeKey: "sub-c-4e77cbb2-66f9-481b-9396-070d2b6b2a62",
            secretKey: "sec-c-NjA3ZDEwOTUtMTdlZC00YjNiLWFmZTMtMzNiZjQyYWZiYTgz",
            // uuid: PubNub.generateUUID(),
            uuid: "blockchain",
            logVerbosity: false, // Optional: Set to true for debugging
        });

        this.pubnub.addListener({
            message: this.handleMessage.bind(this),
            presence: this.handlePresence.bind(this),
            status: this.handleStatus.bind(this),
        });

        // Auto subcribe to channels
        this.subscribe();
    }

    subscribe() {
        this.pubnub.subscribe({
            channels: Object.values(CHANNELS),
            withPresence: false,
        });
    }

    publish(channel, message) {
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
        const message = JSON.parse(event.message);
        console.log(`Received message on channel ${event.channel}:`, message);
    }

    handlePresence(event) {
        console.log(`Presence event on channel ${event.channel}:`, event);
    }

    handleStatus(status) {
        console.log('PubNub Status:', status);
    }
}

module.exports = PubNubClient;