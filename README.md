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
