#!/bin/bash

echo "Installing Dealmaker CRM..."

# Install dependencies
echo "Installing dependencies..."
pip3 install -r backend/requirements.txt

# Initialize database
echo "Initializing database..."
cd backend
python3 init_db.py
cd ..

# Start the server
echo "Starting the server..."
cd backend
python3 app.py &
SERVER_PID=$!
echo $SERVER_PID > server.pid
cd ..

echo "Dealmaker CRM installed and running at http://localhost:5000"
echo "To stop the server, run: kill $(cat backend/server.pid)"
