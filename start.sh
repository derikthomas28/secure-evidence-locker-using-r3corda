#!/bin/bash

# Secure Legal Vault - Linux Startup Script

echo "--- Initializing Secure Legal Vault Ecosystem ---"

# Kill any existing processes on ports 5000, 10050, 5173
echo "Killing any existing services on ports 5000, 10050, 5173..."
pkill -f "python3 app.py" 2>/dev/null || true
pkill -f "python3 mock_blockchain.py" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true
fuser -k 5000/tcp 10050/tcp 5173/tcp 2>/dev/null || true
sleep 1

# 1. Start Mock Blockchain (Port 10050)
echo "Starting Mock Blockchain (Port 10050)..."
cd services/ai-storage
if [ ! -d "venv" ]; then
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
else
    source venv/bin/activate
fi
python3 mock_blockchain.py &
BLOCKCHAIN_PID=$!
cd ../..

# Wait a bit for blockchain to start
sleep 2

# 2. Start AI Storage Backend (Flask)
echo "Starting AI Storage Backend (Port 5000)..."
cd services/ai-storage
source venv/bin/activate
python3 app.py &
AI_BACKEND_PID=$!
cd ../..

# Wait a bit for backend to start
sleep 2

# 3. Start Frontend (React/Vite - Port 5173)
echo "Starting React Frontend (Port 5173)..."
cd frontend
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi
npm run dev &
FRONTEND_PID=$!
cd ..

echo "--- Services Started ---"
echo "AI Backend: http://127.0.0.1:5000 (PID: $AI_BACKEND_PID)"
echo "Blockchain: http://127.0.0.1:10050 (PID: $BLOCKCHAIN_PID)"
echo "Frontend Dashboard: http://127.0.0.1:5173 (PID: $FRONTEND_PID)"
echo "----------------------------------------"
echo "NOTE: Open your browser and navigate to http://127.0.0.1:5173"
echo "Press Ctrl+C to stop all services"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Stopping all services..."
    kill $AI_BACKEND_PID 2>/dev/null || true
    kill $BLOCKCHAIN_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    echo "All services stopped."
    exit 0
}

# Trap SIGINT (Ctrl+C) to cleanup
trap cleanup SIGINT

# Wait for any process to exit
wait
