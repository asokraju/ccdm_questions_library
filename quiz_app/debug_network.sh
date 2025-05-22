#!/bin/bash

echo "🔍 WSL Network Debug Script"
echo "==========================="

echo ""
echo "1. WSL Internal IP:"
hostname -I

echo ""
echo "2. All Network Interfaces (WSL):"
ip addr show | grep -E "inet " | grep -v 127.0.0.1

echo ""
echo "3. Windows Network Interfaces:"
cmd.exe /c "ipconfig | findstr IPv4"

echo ""
echo "4. Default Gateway:"
ip route | grep default

echo ""
echo "5. Testing Network Connectivity:"
echo "Ping Google DNS from WSL:"
ping -c 1 8.8.8.8 > /dev/null 2>&1 && echo "✅ Internet connectivity OK" || echo "❌ No internet"

echo ""
echo "6. Port Listening Status:"
echo "Checking if ports 3000 and 3001 are listening:"
ss -tlnp | grep -E ":300[01]" || echo "❌ Ports not listening"

echo ""
echo "🔧 SOLUTIONS:"
echo "============="
echo ""
echo "For WSL + Mobile access, you have 3 options:"
echo ""
echo "Option 1 - Windows IP Forwarding:"
echo "cmd.exe /c 'netsh interface portproxy add v4tov4 listenport=3000 listenaddress=0.0.0.0 connectport=3000 connectaddress=172.22.225.86'"
echo "cmd.exe /c 'netsh interface portproxy add v4tov4 listenport=3001 listenaddress=0.0.0.0 connectport=3001 connectaddress=172.22.225.86'"
echo ""
echo "Option 2 - Find Windows WiFi IP:"
echo "Use Windows IP instead of WSL IP for mobile access"
echo ""
echo "Option 3 - WSL Network Mode (Windows 11):"
echo "Enable mirrored networking in .wslconfig"