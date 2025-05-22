#!/bin/bash

echo "🔧 WSL Port Forwarding Setup"
echo "============================"

# Get WSL IP
WSL_IP=$(hostname -I | awk '{print $1}')
echo "WSL IP: $WSL_IP"

# Get Windows WiFi IP
WIN_IP=$(cmd.exe /c "ipconfig | findstr 192.168" | grep -oE '192\.168\.[0-9]+\.[0-9]+' | head -1)
echo "Windows WiFi IP: $WIN_IP"

if [[ -z "$WIN_IP" ]]; then
    echo "❌ Could not detect Windows WiFi IP"
    echo "Please run 'ipconfig' in Windows Command Prompt and find your WiFi adapter's IPv4 address"
    exit 1
fi

echo ""
echo "🚀 Setting up port forwarding..."
echo "This will allow mobile devices to connect to $WIN_IP:3000"

# Setup port forwarding from Windows to WSL
echo "Setting up port forwarding (requires Admin privileges in Windows)..."

# Remove existing forwarding rules if they exist
cmd.exe /c "netsh interface portproxy delete v4tov4 listenport=3000 listenaddress=0.0.0.0" 2>/dev/null
cmd.exe /c "netsh interface portproxy delete v4tov4 listenport=3001 listenaddress=0.0.0.0" 2>/dev/null

# Add new forwarding rules
cmd.exe /c "netsh interface portproxy add v4tov4 listenport=3000 listenaddress=0.0.0.0 connectport=3000 connectaddress=$WSL_IP"
cmd.exe /c "netsh interface portproxy add v4tov4 listenport=3001 listenaddress=0.0.0.0 connectport=3001 connectaddress=$WSL_IP"

echo ""
echo "✅ Port forwarding configured!"
echo ""
echo "📱 MOBILE ACCESS INSTRUCTIONS:"
echo "=============================="
echo "1. Ensure your iPhone is on the same WiFi network"
echo "2. Open Safari on your iPhone"
echo "3. Navigate to: http://$WIN_IP:3000"
echo "4. Bookmark this URL for easy access"
echo ""
echo "🔗 QR Code URL:"
echo "https://qr-server.com/api/v1/create-qr-code/?size=200x200&data=http://$WIN_IP:3000"
echo ""
echo "🛠️ TROUBLESHOOTING:"
echo "==================="
echo "If mobile still can't connect:"
echo "1. Run Windows Command Prompt as Administrator"
echo "2. Run: netsh advfirewall firewall add rule name=\"WSL Quiz App\" dir=in action=allow protocol=TCP localport=3000,3001"
echo "3. Or temporarily disable Windows Firewall for testing"
echo ""
echo "📊 VERIFY SETUP:"
echo "================"
echo "Run this to check port forwarding:"
echo "cmd.exe /c 'netsh interface portproxy show v4tov4'"