#!/bin/bash

echo "==============================================================="
echo "   🚀 Secure Evidence Locker v2.0 - Outstanding Edition 🚀   "
echo "==============================================================="

# Function to kill background processes on exit
trap "kill 0" EXIT

echo "[1/4] Starting Corda Nodes..."
# We use deployNodes first ensuring the nodes are generated
./gradlew deployNodes

# Run nodes in a separate terminal if possible, or background
if command -v gnome-terminal &> /dev/null; then
    gnome-terminal --title="Corda Nodes" -- bash -c "cd build/nodes && ./runnodes; exec bash"
    echo "✔ Nodes starting in new terminal."
else
    echo "⚠ gnome-terminal not found. Attempting to run nodes in background..."
    (cd build/nodes && ./runnodes) &
fi

echo "Waiting for nodes to initialize (approx 60s)..."
sleep 60

echo "[2/4] Starting Spring Boot Blockchain API..."
# Running in background
./gradlew runTemplateServer &
SPRING_PID=$!
echo "✔ Spring Server starting (PID: $SPRING_PID)"

echo "[3/4] Starting Python AI & Storage Service..."
source services/ai-storage/venv/bin/activate
python services/ai-storage/app.py &
PYTHON_PID=$!
echo "✔ AI Service starting (PID: $PYTHON_PID)"

echo "[4/4] Starting React Frontend Dashboard..."
cd frontend
# Check if node_modules exists, if not wait/install
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies (first run)..."
    npm install
fi

echo "✔ Launching Dashboard..."
echo "==============================================================="
echo "   🎉 SYSTEM READY! Access the Dashboard at:                "
echo "      http://localhost:5173                                  "
echo "==============================================================="

npm run dev
