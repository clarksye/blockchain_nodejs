const express = require('express');
const Blockchain = require('./blockchain');
const PubNubClient = require('./pubsub');

const app = express();
app.use(express.json());
const blockchain = new Blockchain();
const pubsub = new PubNubClient({ blockchain });

setTimeout(() => {
    pubsub.broadcastChain();
}, 5000);

app.get('/api/blocks', (req, res) => {
    res.json(blockchain.chain);
});

app.post('/api/mine', (req, res) => {
    const { data } = req.body;

    blockchain.addBlock({ data });

    res.redirect('/api/blocks');
});


const PORT = 3000;
app.listen(3000, () => {
    console.log(`listening at http://localhost:${PORT}`)
});