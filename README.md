# Blockchain Agent Project

## Overview
This project includes:
- FastAPI agent API (port 8000)
- Node.js blockchain API (port 3001)
- React frontend (port 5173)

## Setup

### Python Backend
1. Create and activate a virtual environment:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Copy .env.example to .env and set your values.

### Node.js Backend
1. Install dependencies:
   ```bash
   cd server
   npm install
   ```
2. Copy .env.example to .env and set your values.

### React Frontend
1. Install dependencies:
   ```bash
   cd client
   npm install
   ```
2. Start development server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```

## Running Servers
- FastAPI: `python -m uvicorn agent_server:app --host 0.0.0.0 --port 8000`
- Node.js: `cd server && node server.js`
- React: `cd client && npm run dev`

## Deployment
- Use gunicorn for FastAPI: `gunicorn -w 4 -k uvicorn.workers.UvicornWorker agent_server:app:app`
- Use PM2 for Node.js: `pm2 start server.js`
- Use Docker and docker-compose for containerization.

## Testing
- Python: `pytest`
- Node.js: `npm test`
- React: `npm test`

## Security & CORS
- Set CORS_ORIGINS in .env
- Use authentication for sensitive endpoints

## Monitoring
- Add logging and monitoring tools as needed.

## API Documentation
- FastAPI docs: http://localhost:8000/docs

---

For more details, see individual service folders and configuration files.

---

## Repository Management

### Ignored Files
To maintain a small and fast repository, several categories of files are strictly excluded from being pushed to GitHub via `.gitignore`. These files remain only on your local machine:

- **Virtual Environments & Dependencies**:
  - `.venv/`, `venv/`, `env/`: Large Python environments containing megabytes of library code (e.g., PyTorch, FastAPI).
  - `node_modules/`, `client/node_modules/`: Thousands of small files required for Node.js and React development.
- **Large Data & Model Weights**:
  - `*.pth`, `*.bin`, `*.model`: Trained machine learning weights which can be several gigabytes in size.
  - `agent.zip`: Compressed backups or archives of agent data.
- **Build Artifacts & Caches**:
  - `dist/`, `build/`: Temporary files generated during frontend or backend compilation.
  - `__pycache__/`, `*.pyc`: Python bytecode and runtime caches.
- **Experimental & Temporary Backups**:
  - `.git_backup/`: The pre-cleanup Git history backup.
  - `unpushed_files_backup.tar.gz`: The local archive of all ignored files.
- **Sensitive Information**:
  - `.env`, `.env.local`: Locally configured environment variables (API keys, secrets).
- **IDE & System Files**:
  - `.vscode/`, `.idea/`, `.DS_Store`: Personal editor settings and operating system metadata.

### Local Backup Structure
A full copy of all files not pushed to GitHub (ignored and untracked) is stored in a local compressed archive:
- **File**: `unpushed_files_backup.tar.gz`
- **Contents**: Includes all directories and files listed above, preserving the local environment state.

### Agent File Placement
All machine learning agent scripts, training logic, and model-related code should be placed in the `agent/` directory at the project root.
- **Example Location**: `agent/agent_server.py`, `agent/models/`
- **Note**: Large model weights (`.pth`, `.bin`) placed in this directory will be automatically ignored by Git to prevent repository bloat.
