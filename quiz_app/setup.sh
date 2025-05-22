#!/bin/bash
set -e

# CCDM Quiz Application Setup Script
# This script sets up the complete development environment

echo "🚀 CCDM Quiz Application Setup Script"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if running in WSL
is_wsl() {
    if [[ -f /proc/version ]] && grep -qi microsoft /proc/version; then
        return 0
    else
        return 1
    fi
}

# Detect environment
if is_wsl; then
    print_status "Detected WSL environment"
    ENV_TYPE="WSL"
else
    print_status "Detected native Linux environment"
    ENV_TYPE="Linux"
fi

# Step 1: Update system
print_step "1. Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Step 2: Install curl if not present
if ! command_exists curl; then
    print_step "2. Installing curl..."
    sudo apt install -y curl
else
    print_status "curl is already installed"
fi

# Step 3: Install Git if not present
if ! command_exists git; then
    print_step "3. Installing Git..."
    sudo apt install -y git
else
    print_status "Git is already installed - Version: $(git --version)"
fi

# Step 4: Install Node.js and npm
if ! command_exists node || ! command_exists npm; then
    print_step "4. Installing Node.js 18.x LTS..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
    
    # Verify installation
    print_status "Node.js installed - Version: $(node --version)"
    print_status "npm installed - Version: $(npm --version)"
else
    print_status "Node.js is already installed - Version: $(node --version)"
    print_status "npm is already installed - Version: $(npm --version)"
    
    # Check Node.js version
    NODE_VERSION=$(node --version | sed 's/v//' | cut -d. -f1)
    if [ "$NODE_VERSION" -lt 14 ]; then
        print_warning "Node.js version is less than 14. Consider upgrading."
    fi
fi

# Step 5: Clone repository if not already present
if [ ! -d "ccdm_questions_library" ]; then
    print_step "5. Cloning CCDM Questions Library repository..."
    git clone https://github.com/asokraju/ccdm_questions_library.git
    cd ccdm_questions_library/quiz_app
else
    print_status "Repository already exists. Updating..."
    cd ccdm_questions_library
    git pull origin main
    cd quiz_app
fi

# Step 6: Install backend dependencies
print_step "6. Installing backend dependencies..."
cd backend
if [ -f "package.json" ]; then
    npm install
    print_status "Backend dependencies installed successfully"
else
    print_error "Backend package.json not found!"
    exit 1
fi

# Step 7: Install frontend dependencies
print_step "7. Installing frontend dependencies..."
cd ../frontend
if [ -f "package.json" ]; then
    npm install
    print_status "Frontend dependencies installed successfully"
else
    print_error "Frontend package.json not found!"
    exit 1
fi

# Step 8: Create startup scripts
print_step "8. Creating startup scripts..."
cd ..

# Create a simple startup script
cat > run_quiz.sh << 'EOF'
#!/bin/bash

# Function to cleanup background processes
cleanup() {
    echo "Stopping servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

echo "Starting CCDM Quiz Application..."

# Start backend
echo "Starting backend server..."
cd backend
npm start &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend
echo "Starting frontend server..."
cd ../frontend
npm start &
FRONTEND_PID=$!

echo ""
echo "🎉 Application is starting!"
echo "📊 Backend API: http://localhost:3001"
echo "🌐 Frontend App: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for processes
wait
EOF

chmod +x run_quiz.sh

# Step 9: Final instructions
print_step "9. Setup completed successfully! 🎉"
echo ""
echo "======================================"
echo "📋 SETUP SUMMARY"
echo "======================================"
echo "✅ System updated"
echo "✅ Node.js $(node --version) installed"
echo "✅ npm $(npm --version) installed"
echo "✅ Git $(git --version | cut -d' ' -f3) installed"
echo "✅ Repository cloned and updated"
echo "✅ Backend dependencies installed"
echo "✅ Frontend dependencies installed"
echo "✅ Startup script created"
echo ""
echo "🚀 TO START THE APPLICATION:"
echo "   ./run_quiz.sh"
echo ""
echo "🌐 ACCESS THE APPLICATION:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:3001"
echo ""

if is_wsl; then
    echo "💡 WSL TIPS:"
    echo "   - Access from Windows browser using localhost"
    echo "   - Files are located in WSL filesystem"
    echo "   - Use 'code .' to open in VS Code from WSL"
    echo ""
fi

echo "🆘 TROUBLESHOOTING:"
echo "   - If ports are busy: sudo lsof -ti:3000,3001 | xargs kill -9"
echo "   - To restart: ./run_quiz.sh"
echo "   - For help: Check README.md"
echo ""

# Ask if user wants to start the application now
read -p "Would you like to start the application now? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Starting application..."
    ./run_quiz.sh
else
    print_status "Setup complete. Run './run_quiz.sh' when ready to start."
fi