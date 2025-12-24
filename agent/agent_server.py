# Root route for welcome message
@app.get("/")
def root():
    return {"message": "Agent API is running. Use /predict for inference."}

import torch
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import uvicorn

app = FastAPI()

# Add a root endpoint for a welcome message
@app.get("/")
def root():
    return {"message": "Agent API is running. Use /predict for inference."}


# ActorCritic model definition matching training
import torch.nn as nn
state_dim = 4  # CartPole-v1 observation space
action_dim = 2  # CartPole-v1 action space

class ActorCritic(nn.Module):
    def __init__(self):
        super().__init__()
        self.shared = nn.Sequential(
            nn.Linear(state_dim, 64),
            nn.ReLU(),
            nn.Linear(64, 64),
            nn.ReLU()
        )
        self.actor = nn.Linear(64, action_dim)
        self.critic = nn.Linear(64, 1)

    def forward(self, x):
        x = self.shared(x)
        return self.actor(x), self.critic(x)


MODEL_PATH = "../cartpole_ppo_final.pth"
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = ActorCritic().to(device)
model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
model.eval()

app = FastAPI()


class InferenceInput(BaseModel):
    data: List[float]  # expects a list of 4 floats as input


@app.post("/predict")
def predict(input: InferenceInput):
    try:
        x = torch.tensor([input.data], dtype=torch.float32).to(device)
        with torch.no_grad():
            logits, value = model(x)
            action_probs = torch.softmax(logits, dim=-1)
            action = torch.argmax(action_probs, dim=-1).item()
        return {"action": action, "probs": action_probs.cpu().numpy().tolist()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# To run: uvicorn agent_server:app --reload
if __name__ == "__main__":
    uvicorn.run("agent_server:app", host="0.0.0.0", port=8000, reload=True)
