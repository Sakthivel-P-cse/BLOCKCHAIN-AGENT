const fs = require('fs');
const path = require('path');

const BLOCKCHAIN_FILE = path.join(__dirname, 'blockchain_data.json');

function saveBlockchainToDisk(chain) {
    fs.writeFileSync(BLOCKCHAIN_FILE, JSON.stringify(chain, null, 2));
}

function loadBlockchainFromDisk() {
    if (fs.existsSync(BLOCKCHAIN_FILE)) {
        const data = fs.readFileSync(BLOCKCHAIN_FILE);
        return JSON.parse(data);
    }
    return null;
}

module.exports = { saveBlockchainToDisk, loadBlockchainFromDisk, BLOCKCHAIN_FILE };