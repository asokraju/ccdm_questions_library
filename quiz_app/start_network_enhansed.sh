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

# Function to get WSL IP
get_wsl_ip() {
    ip addr show eth0 | grep -oP '(?<=inet\s)\d+(\.\d+){3}'
}

# Function to get Windows host IP
get_windows_ip() {
    # Get the default gateway (Windows host) from WSL
    ip route show default | awk '{print $3}'
}

# Function to setup Windows port forwarding
setup_port_forwarding() {
    local wsl_ip=$1
    local windows_host=$(get_windows_ip)
    
    echo -e "${YELLOW}[INFO]${NC} Setting up Windows port forwarding..."
    echo -e "${CYAN}       WSL IP: $wsl_ip${NC}"
    
    # Create PowerShell script
    cat > /tmp/setup_portforward.ps1 << EOF
\$wslIp = "$wsl_ip"

Write-Host "Setting up port forwarding for WSL IP: \$wslIp"

# Remove existing rules
netsh interface portproxy delete v4tov4 listenport=3000 listenaddress=0.0.0.0 2>\$null
netsh interface portproxy delete v4tov4 listenport=3001 listenaddress=0.0.0.0 2>\$null

# Add new rules
netsh interface portproxy add v4tov4 listenport=3000 listenaddress=0.0.0.0 connectport=3000 connectaddress=\$wslIp
netsh interface portproxy add v4tov4 listenport=3001 listenaddress=0.0.0.0 connectport=3001 connectaddress=\$wslIp

Write-Host "Port forwarding rules created successfully"
netsh interface portproxy show all
EOF

    # Execute PowerShell script from WSL
    echo -e "${YELLOW}[ACTION]${NC} This script needs to set up Windows port forwarding."
    echo -e "${YELLOW}         Please run the following command in PowerShell as Administrator:${NC}"
    echo ""
    echo -e "${CYAN}powershell.exe -ExecutionPolicy Bypass -File '\\\\wsl$\\Ubuntu\\tmp\\setup_portforward.ps1'${NC}"
    echo ""
    echo -e "${YELLOW}Or copy and run these commands:${NC}"
    echo -e "${CYAN}netsh interface portproxy delete v4tov4 listenport=3000 listenaddress=0.0.0.0${NC}"
    echo -e "${CYAN}netsh interface portproxy delete v4tov4 listenport=3001 listenaddress=0.0.0.0${NC}"
    echo -e "${CYAN}netsh interface portproxy add v4tov4 listenport=3000 listenaddress=0.0.0.0 connectport=3000 connectaddress=$wsl_ip${NC}"
    echo -e "${CYAN}netsh interface portproxy add v4tov4 listenport=3001 listenaddress=0.0.0.0 connectport=3001 connectaddress=$wsl_ip${NC}"
    echo ""
    echo -e "${GREEN}Press Enter after running the PowerShell commands...${NC}"
    read -r
}

# Function to get Windows network IP
get_windows_network_ip() {
    # Try to get it from PowerShell
    powershell.exe -Command "Get-NetIPAddress -AddressFamily IPv4 | Where-Object {\$_.InterfaceAlias -notmatch 'WSL|Loopback' -and \$_.IPAddress -match '^192\.168\.|^10\.'} | Select-Object -First 1 -ExpandProperty IPAddress" 2>/dev/null | tr -d '\r\n'
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

# Get IPs
WSL_IP=$(get_wsl_ip)
WINDOWS_IP=$(get_windows_network_ip)

# If we couldn't get Windows IP, provide instructions
if [[ -z "$WINDOWS_IP" ]] || [[ "$WINDOWS_IP" == *"not found"* ]]; then
    echo -e "${YELLOW}[INFO]${NC} Could not automatically detect Windows IP."
    echo -e "${YELLOW}       Run this in PowerShell to find it:${NC}"
    echo -e "${CYAN}       ipconfig | findstr /i \"ipv4\"${NC}"
    echo -e "${YELLOW}       Look for the IP starting with 192.168. or 10.${NC}"
    echo ""
    echo -e "${GREEN}Enter your Windows IP address: ${NC}"
    read -r WINDOWS_IP
fi

echo -e "${GREEN}[INFO]${NC} Network Configuration:"
echo -e "${CYAN}       WSL IP: $WSL_IP${NC}"
echo -e "${CYAN}       Windows IP: $WINDOWS_IP${NC}"
echo ""

# Setup port forwarding
setup_port_forwarding "$WSL_IP"

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
echo "🎉 ${GREEN}Application is running with network access!${NC}"
echo "=============================================="
echo ""
echo "💻 ${YELLOW}Local Access (from this machine):${NC}"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:3001"
echo ""
echo "📱 ${YELLOW}Network Access (from other devices):${NC}"
echo "   Frontend: ${GREEN}http://${WINDOWS_IP}:3000${NC}"
echo "   Backend:  ${GREEN}http://${WINDOWS_IP}:3001${NC}"
echo ""
echo "📱 ${YELLOW}WSL Direct Access:${NC}"
echo "   Frontend: http://${WSL_IP}:3000"
echo "   Backend:  http://${WSL_IP}:3001"
echo ""
echo "📶 ${YELLOW}WiFi Instructions:${NC}"
echo "   1. Ensure your mobile device is on the same WiFi network"
echo "   2. Open browser and go to: ${GREEN}http://${WINDOWS_IP}:3000${NC}"
echo "   3. Bookmark the URL for easy access"
echo ""

# Generate QR code link
QR_URL="http://${WINDOWS_IP}:3000"
echo "🔗 ${YELLOW}QR Code for Mobile:${NC}"
generate_qr_text "$QR_URL"
echo ""

echo "🛠️  ${YELLOW}Troubleshooting:${NC}"
echo "   - If mobile can't connect, ensure port forwarding is set up"
echo "   - Check Windows Firewall allows ports 3000 and 3001"
echo "   - Ensure both devices are on same WiFi network"
echo ""
echo "⏹️  ${YELLOW}To Stop:${NC} Press Ctrl+C"
echo ""

# Wait for processes
wait