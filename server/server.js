const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Blockchain, Block } = require('./blockchain');
const { saveBlockchainToDisk, loadBlockchainFromDisk } = require('./blockchain_persistence');
const { saveWeightsOffChain, getWeightsOffChain } = require('./storage');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json({ limit: '100mb' }));

let myBlockchain;
const loadedChain = loadBlockchainFromDisk();
if (loadedChain) {
    // Reconstruct the blockchain from loaded data
    myBlockchain = new Blockchain();
    myBlockchain.chain = loadedChain.map(
        b => Object.assign(new Block(b.index, b.timestamp, b.data, b.previousHash), { nonce: b.nonce, hash: b.hash })
    );
} else {
    myBlockchain = new Blockchain();
    saveBlockchainToDisk(myBlockchain.chain);
}

// Get the full blockchain
app.get('/chain', (req, res) => {
    res.json(myBlockchain.chain);
});

// Mine a new block with weights
app.post('/mine', (req, res) => {
    const { episode, weights } = req.body;

    if (episode === undefined || !weights) {
        return res.status(400).json({ error: 'Missing episode or weights' });
    }

    // 1. Save weights off-chain
    const { weightHash } = saveWeightsOffChain(episode, weights);

    // 2. Create block data (on-chain metadata)
    const blockData = {
        episode,
        weightHash,
        timestamp: Date.now()
    };

    // 3. Mine the block
    const newBlock = new Block(
        myBlockchain.chain.length,
        Date.now(),
        blockData
    );

    myBlockchain.addBlock(newBlock);
    saveBlockchainToDisk(myBlockchain.chain);

    res.json({
        message: 'Block mined and weights stored off-chain',
        block: newBlock
    });
});

// Retrieve weights by hash
app.get('/weights/:hash', (req, res) => {
    const weights = getWeightsOffChain(req.params.hash);
    if (weights) {
        res.json(weights);
    } else {
        res.status(404).json({ error: 'Weights not found' });
    }
});

// Check chain validity
app.get('/validate', (req, res) => {
    const isValid = myBlockchain.isChainValid();
    res.json({ isValid });
});

app.listen(port, () => {
    console.log(`Blockchain server running at http://localhost:${port}`);
});
