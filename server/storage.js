const fs = require('fs');
const path = require('path');
const CryptoJS = require('crypto-js');

const STORAGE_DIR = path.join(__dirname, '../storage');

if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR);
}

function saveWeightsOffChain(episode, weights) {
    const dataString = JSON.stringify(weights);
    const weightHash = CryptoJS.SHA256(dataString).toString();
    const fileName = `${weightHash}.json`;
    const filePath = path.join(STORAGE_DIR, fileName);

    fs.writeFileSync(filePath, dataString);

    return {
        weightHash,
        fileName,
        filePath
    };
}

function getWeightsOffChain(hash) {
    const filePath = path.join(STORAGE_DIR, `${hash}.json`);
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    }
    return null;
}

module.exports = { saveWeightsOffChain, getWeightsOffChain };
