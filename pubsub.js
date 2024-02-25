const PubNub = require('pubnub');

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
            message: this.handleMessage(),
            presence: this.handlePresence(),
            status: this.handleStatus(),
        });
    }

    subscribe(channels) {
        this.pubnub.subscribe({
            channels: channels,
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