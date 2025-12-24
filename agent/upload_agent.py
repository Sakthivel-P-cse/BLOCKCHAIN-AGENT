import torch
import requests
import base64
import os
import json

# Configuration
URL = "http://localhost:3001/mine"
PTH_PATH = "/home/sakthi/notes/cartpole_ppo_final.pth"

def upload_weights():
    if not os.path.exists(PTH_PATH):
        print(f"Error: .pth file not found at {PTH_PATH}")
        return

    print(f"Loading weights from {PTH_PATH}...")
    
    # Read the file as binary
    with open(PTH_PATH, "rb") as f:
        binary_data = f.read()
    
    # Encode to base64 for JSON transport
    print("Encoding weights...")
    encoded_data = base64.b64encode(binary_data).decode('utf-8')

    payload = {
        "episode": "Final Model", # Or any label
        "weights": {
            "type": "torch_pth",
            "data": encoded_data
        }
    }

    print("Submitting to blockchain (this may take a moment for large files)...")
    try:
        response = requests.post(URL, json=payload)
        response.raise_for_status()
        result = response.json()
        print("\nSuccess!")
        print(f"Block Index: {result['block']['index']}")
        print(f"Block Hash: {result['block']['hash']}")
        print(f"Metadata Hash: {result['block']['data']['weightHash']}")
        print("\nYou can now view this in the dashboard at http://localhost:5173")
    except Exception as e:
        print(f"Failed to upload: {e}")

if __name__ == "__main__":
    upload_weights()
