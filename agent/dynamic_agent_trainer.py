import torch
import torch.nn as nn
from blockchain_utils import BlockchainLogger
import time

# 1. Simple Neural Network
class SimpleModel(nn.Module):
    def __init__(self):
        super(SimpleModel, self).__init__()
        self.fc = nn.Linear(4, 2) # e.g. CartPole input/output

    def forward(self, x):
        return self.fc(x)

def train_simulated():
    print("Initializing Simulated Agent...")
    model = SimpleModel()
    logger = BlockchainLogger() # Defaults to http://localhost:3001

    print("\nStarting Training Episodes...")
    for episode in range(1, 4):
        print(f"\n--- Episode {episode} Training ---")
        
        # Simulate training by slightly modifying weights
        with torch.no_grad():
            model.fc.weight += torch.randn_like(model.fc.weight) * 0.1
        
        print(f"Episode {episode} finished.")
        
        # 2. DYNAMIC LOGGING
        # This sends the weights to the blockchain and waits for the hash
        block_hash = logger.log_weights(episode, model)
        
        if block_hash:
            print(f"Episode Record Secured! Hash: {block_hash[:10]}...")
        
        time.sleep(2)

    print("\nDynamic Training Complete!")

if __name__ == "__main__":
    train_simulated()
