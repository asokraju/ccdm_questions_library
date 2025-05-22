#!/bin/bash

# Start the quiz application

echo "Starting CCDM Quiz Application..."

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "Port $1 is already in use. Please close the application using this port."
        return 1
    fi
    return 0
}

# Check if ports are available
check_port 3001
if [ $? -ne 0 ]; then
    exit 1
fi

check_port 3000
if [ $? -ne 0 ]; then
    exit 1
fi

# Start backend server
echo "Starting backend server..."
cd backend
npm install
npm start &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend
echo "Starting frontend application..."
cd ../frontend
npm install
npm start &
FRONTEND_PID=$!

echo "Quiz application is starting..."
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "The application will open in your browser at http://localhost:3000"
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop the application
wait $BACKEND_PID $FRONTEND_PID