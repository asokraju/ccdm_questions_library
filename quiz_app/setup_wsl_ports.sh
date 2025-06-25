#!/bin/bash
# WSL Port Forwarding Setup Helper
# Run this from inside WSL to generate Windows commands

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${BLUE}WSL2 Port Forwarding Setup Helper${NC}"
echo "===================================="
echo ""

# Get WSL IP
WSL_IP=$(hostname -I | awk '{print $1}')
echo -e "${GREEN}Your WSL IP:${NC} $WSL_IP"

# Get Windows network IP using PowerShell
echo -e "\n${YELLOW}Getting Windows network IP...${NC}"
WINDOWS_NETWORK_IP=$(powershell.exe -Command "
    \$ip = Get-NetIPAddress -AddressFamily IPv4 | 
           Where-Object { \$_.IPAddress -notlike '127.*' -and \$_.IPAddress -notlike '169.254.*' } | 
           Select-Object -First 1 -ExpandProperty IPAddress
    Write-Host \$ip -NoNewline
" 2>/dev/null | tr -d '\r')

if [[ -n "$WINDOWS_NETWORK_IP" ]]; then
    echo -e "${GREEN}Windows Network IP:${NC} $WINDOWS_NETWORK_IP"
else
    echo -e "${RED}Could not detect Windows network IP${NC}"
fi

# Generate PowerShell script
cat > ~/port_forward_setup.ps1 << EOF
# WSL2 Port Forwarding Setup for CCDM Quiz App
# Generated on $(date)

Write-Host "Setting up port forwarding for WSL IP: $WSL_IP" -ForegroundColor Green

# Remove existing rules
netsh interface portproxy delete v4tov4 listenport=3000 listenaddress=0.0.0.0 2>null
netsh interface portproxy delete v4tov4 listenport=3001 listenaddress=0.0.0.0 2>null

# Add new rules
netsh interface portproxy add v4tov4 listenport=3000 listenaddress=0.0.0.0 connectport=3000 connectaddress=$WSL_IP
netsh interface portproxy add v4tov4 listenport=3001 listenaddress=0.0.0.0 connectport=3001 connectaddress=$WSL_IP

Write-Host "Port forwarding rules created!" -ForegroundColor Green

# Show current rules
Write-Host "`nCurrent port forwarding rules:" -ForegroundColor Yellow
netsh interface portproxy show v4tov4

# Check/Create firewall rules
\$frontend = Get-NetFirewallRule -DisplayName "CCDM Quiz Frontend" -ErrorAction SilentlyContinue
\$backend = Get-NetFirewallRule -DisplayName "CCDM Quiz Backend" -ErrorAction SilentlyContinue

if (-not \$frontend) {
    New-NetFirewallRule -DisplayName "CCDM Quiz Frontend" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
    Write-Host "Created firewall rule for port 3000" -ForegroundColor Green
}

if (-not \$backend) {
    New-NetFirewallRule -DisplayName "CCDM Quiz Backend" -Direction Inbound -LocalPort 3001 -Protocol TCP -Action Allow
    Write-Host "Created firewall rule for port 3001" -ForegroundColor Green
}

Write-Host "`nSetup complete!" -ForegroundColor Green
Write-Host "Access your app from other devices at:" -ForegroundColor Yellow
Write-Host "  http://$WINDOWS_NETWORK_IP:3000" -ForegroundColor Cyan
EOF

echo -e "\n${GREEN}PowerShell script generated!${NC}"
echo -e "\n${YELLOW}To complete setup, follow these steps:${NC}"
echo ""
echo "1. ${CYAN}Copy this command:${NC}"
echo -e "   ${GREEN}powershell.exe -ExecutionPolicy Bypass -File \"\\\\wsl\$\\Ubuntu\\home\\kosaraju\\port_forward_setup.ps1\"${NC}"
echo ""
echo "2. ${CYAN}Open a NEW Windows Terminal/PowerShell as Administrator${NC}"
echo "   (Right-click Windows Terminal → Run as Administrator)"
echo ""
echo "3. ${CYAN}Paste and run the command${NC}"
echo ""
echo -e "${YELLOW}After setup, access your app from:${NC}"
echo "  - This computer: http://localhost:3000"
echo "  - Other devices: http://$WINDOWS_NETWORK_IP:3000"
echo ""
echo -e "${RED}Remember:${NC} Start your servers with HOST=0.0.0.0"
echo "  cd backend && HOST=0.0.0.0 npm start"
echo "  cd frontend && HOST=0.0.0.0 npm start"