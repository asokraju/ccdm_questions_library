#!/bin/bash

# Network-enabled startup script for CCDM Quiz Application
# This script starts both servers with network access for mobile devices

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to get network IP
get_network_ip() {
    # Try different methods to get network IP
    local ip=""
    
    # Method 1: hostname -I (Linux)
    if command -v hostname >/dev/null 2>&1; then
        ip=$(hostname -I | awk '{print $1}' 2>/dev/null)
    fi
    
    # Method 2: ip route (Linux)
    if [[ -z "$ip" ]] && command -v ip >/dev/null 2>&1; then
        ip=$(ip route get 8.8.8.8 2>/dev/null | grep -oP 'src \K\S+')
    fi
    
    # Method 3: ifconfig (fallback)
    if [[ -z "$ip" ]] && command -v ifconfig >/dev/null 2>&1; then
        ip=$(ifconfig | grep -E "inet.*broadcast" | grep -v 127.0.0.1 | awk '{print $2}' | head -n1)
    fi
    
    # Default fallback
    if [[ -z "$ip" ]]; then
        ip="localhost"
    fi
    
    echo "$ip"
}

# Function to generate QR code URL (basic text format)
generate_qr_text() {
    local url="$1"
    echo "📱 QR Code URL: https://qr-server.com/api/v1/create-qr-code/?size=200x200&data=$url"
}

# Function to cleanup background processes
cleanup() {
    echo -e "\n${YELLOW}[INFO]${NC} Stopping servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

echo -e "${BLUE}🚀 CCDM Quiz Application - Network Mode${NC}"
echo "=============================================="

# Get network IP
NETWORK_IP=$(get_network_ip)

echo -e "${GREEN}[INFO]${NC} Detected network IP: ${CYAN}$NETWORK_IP${NC}"
echo ""

# Check if Node.js is available
if ! command -v node >/dev/null 2>&1; then
    echo -e "${RED}[ERROR]${NC} Node.js is not installed!"
    exit 1
fi

# Start backend
echo -e "${BLUE}[STEP]${NC} Starting backend server..."
cd backend
npm start &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend
echo -e "${BLUE}[STEP]${NC} Starting frontend server..."
cd ../frontend
npm start &
FRONTEND_PID=$!

# Display access information
echo ""
echo "🎉 ${GREEN}Application is starting with network access!${NC}"
echo "=============================================="
echo ""
echo "💻 ${YELLOW}Local Access:${NC}"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:3001"
echo ""
echo "📱 ${YELLOW}Mobile/Network Access:${NC}"
echo "   Frontend: http://${NETWORK_IP}:3000"
echo "   Backend:  http://${NETWORK_IP}:3001"
echo ""
echo "📶 ${YELLOW}WiFi Instructions:${NC}"
echo "   1. Ensure your mobile device is on the same WiFi network"
echo "   2. Open browser and go to: http://${NETWORK_IP}:3000"
echo "   3. Bookmark the URL for easy access"
echo ""

# Generate QR code link
if [[ "$NETWORK_IP" != "localhost" ]]; then
    QR_URL="http://${NETWORK_IP}:3000"
    echo "🔗 ${YELLOW}QR Code for Mobile:${NC}"
    generate_qr_text "$QR_URL"
    echo ""
fi

echo "🛠️  ${YELLOW}Troubleshooting:${NC}"
echo "   - If mobile can't connect, check firewall settings"
echo "   - Ensure both devices are on same WiFi network"
echo "   - Some routers block device-to-device communication"
echo ""
echo "⏹️  ${YELLOW}To Stop:${NC} Press Ctrl+C"
echo ""

# Wait for processes
wait