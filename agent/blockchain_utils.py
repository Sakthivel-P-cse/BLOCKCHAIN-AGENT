import requests
import base64
import json
import torch
import io
import time

class BlockchainLogger:
    def __init__(self, server_url="http://localhost:3001"):
        self.server_url = server_url

    def log_weights(self, episode, model_or_weights):
        """
        Logs model weights to the blockchain.
        model_or_weights: Can be a dictionary (state_dict) or a torch.nn.Module
        """
        print(f"Logging weights for Episode {episode}...")
        
        # 1. Prepare weight data
        if isinstance(model_or_weights, torch.nn.Module):
            weights = model_or_weights.state_dict()
        else:
            weights = model_or_weights

        # 2. Serialize to binary (using io.BytesIO to simulate a file)
        buffer = io.BytesIO()
        torch.save(weights, buffer)
        binary_data = buffer.getvalue()
        
        # 3. Encode to base64
        encoded_data = base64.b64encode(binary_data).decode('utf-8')

        payload = {
            "episode": episode,
            "weights": {
                "type": "torch_state_dict",
                "data": encoded_data
            }
        }

        # 4. Submit to blockchain
        try:
            start_time = time.time()
            response = requests.post(f"{self.server_url}/mine", json=payload)
            response.raise_for_status()
            result = response.json()
            duration = time.time() - start_time
            
            print(f"Successfully mined block #{result['block']['index']} in {duration:.2f}s")
            print(f"Block Hash: {result['block']['hash'][:20]}...")
            return result['block']['hash']
        except Exception as e:
            print(f"Error logging to blockchain: {e}")
            return None

# Usage Example:
# logger = BlockchainLogger()
# logger.log_weights(1, model)
