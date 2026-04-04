#!/bin/bash

# Secure Legal Vault - Linux Startup Script

echo "--- Initializing Secure Legal Vault Ecosystem ---"

# 1. Start AI Storage Backend (Flask)
echo "Starting AI Storage Backend (Port 5000)..."
cd services/ai-storage
if [ -d "venv" ]; then
    source venv/bin/activate
else
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
fi
python3 app.py &
cd ../..

# 2. Start Mock Blockchain (Port 10050)
echo "Starting Mock Blockchain (Port 10050)..."
cd services/ai-storage
python3 mock_blockchain.py &
cd ../..

# 3. Start Frontend (React/Vite - Port 5173)
echo "Starting React Frontend (Port 5173)..."
cd frontend
if [ ! -d "node_modules" ]; then
    npm install
fi
npm run dev &
cd ..

echo "--- Services are starting ---"
echo "AI Backend: http://127.0.0.1:5000"
echo "Blockchain: http://127.0.0.1:10050"
echo "Frontend Dashboard: http://127.0.0.1:5173"
echo "----------------------------------------"
echo "NOTE: Open Brave browser and navigate to http://127.0.0.1:5173"
