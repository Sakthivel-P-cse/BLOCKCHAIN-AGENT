const axios = require('axios');

async function simulateTraining() {
    console.log("Starting Agent Training Simulation...");

    for (let episode = 1; episode <= 5; episode++) {
        console.log(`\n--- Episode ${episode} ---`);

        // Simulate training and generating weights
        console.log("Generating weights...");
        const weights = {
            layer1: Array.from({ length: 10 }, () => Math.random()),
            layer2: Array.from({ length: 5 }, () => Math.random()),
            bias: Math.random()
        };

        // Submit weights to blockchain
        console.log("Submitting weights to blockchain...");
        try {
            const response = await axios.post('http://localhost:3001/mine', {
                episode,
                weights
            });
            console.log(`Successfully stored weights for Episode ${episode}`);
            console.log(`Block Hash: ${response.data.block.hash}`);
        } catch (error) {
            console.error(`Error storing weights for Episode ${episode}:`, error.message);
        }

        // Wait a bit between episodes
        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log("\nTraining Simulation Complete!");
}

simulateTraining();
