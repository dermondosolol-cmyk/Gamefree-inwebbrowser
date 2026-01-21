#!/bin/bash

###############################################################################
# Nebula Gaming - Complete Setup and Start Script
# One-command startup with dependency checking
###############################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
PORT=8000
HOST="localhost"
URL="http://localhost:8000"

# Functions
print_header() {
    echo -e "\n${CYAN}═══════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}🎮 Nebula Gaming - Local Development Server${NC}"
    echo -e "${CYAN}═══════════════════════════════════════════════════${NC}\n"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

check_command() {
    if ! command -v $1 &> /dev/null; then
        print_error "$1 is not installed"
        return 1
    fi
    return 0
}

print_header

# Check prerequisites
echo -e "${MAGENTA}Checking Prerequisites...${NC}"
echo ""

if ! check_command node; then
    print_error "Node.js not found. Install from https://nodejs.org/"
    exit 1
fi

if ! check_command npm; then
    print_error "npm not found"
    exit 1
fi

NODE_VERSION=$(node --version)
NPM_VERSION=$(npm --version)

print_success "Node.js $NODE_VERSION"
print_success "npm $NPM_VERSION"

# Navigate to project directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

print_info "Project directory: $SCRIPT_DIR"

# Check files
echo ""
echo -e "${MAGENTA}Checking Project Files...${NC}"
echo ""

REQUIRED_FILES=("index.html" "script.js" "styles.css" "server.js" "package.json")
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        print_success "$file"
    else
        print_error "$file not found"
        exit 1
    fi
done

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo ""
    echo -e "${MAGENTA}Installing Dependencies...${NC}"
    echo ""
    npm install --quiet
    print_success "Dependencies installed"
fi

# Check if port is available
echo ""
echo -e "${MAGENTA}Checking Port Availability...${NC}"
echo ""

if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    print_warning "Port $PORT is already in use"
    echo ""
    print_info "Processes using port $PORT:"
    lsof -i :$PORT || true
    echo ""
    read -p "Kill existing process and continue? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        EXISTING_PID=$(lsof -Pi :$PORT -sTCP:LISTEN -t)
        kill -9 $EXISTING_PID 2>/dev/null || true
        sleep 1
        print_success "Port $PORT freed"
    else
        print_error "Cannot start server - port $PORT is in use"
        exit 1
    fi
else
    print_success "Port $PORT is available"
fi

# Display startup information
echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════${NC}"
echo -e "${CYAN}Server Configuration${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════${NC}"
echo ""
echo -e "🌐 ${BLUE}Access URLs:${NC}"
echo "   • ${GREEN}http://localhost:8000${NC}"
echo "   • ${GREEN}http://127.0.0.1:8000${NC}"
echo ""
echo -e "🔒 ${BLUE}Trusted Origins:${NC}"
echo "   • http://localhost:8000"
echo "   • http://127.0.0.1:8000"
echo "   • http://localhost"
echo "   • http://127.0.0.1"
echo ""
echo -e "🛡️  ${BLUE}Security Features:${NC}"
echo "   • CORS enabled for localhost"
echo "   • Security headers configured"
echo "   • XSS protection enabled"
echo "   • Clickjacking protection enabled"
echo "   • Content-type sniffing prevention"
echo ""
echo -e "⚡ ${BLUE}Performance:${NC}"
echo "   • GZIP compression enabled"
echo "   • Static asset caching (1 hour)"
echo "   • Efficient MIME type detection"
echo ""
echo -e "📦 ${BLUE}Features:${NC}"
echo "   • 160+ preset games"
echo "   • Authentication (Google/GitHub/Guest)"
echo "   • WebRTC video calling"
echo "   • Real-time chat system"
echo "   • Virtual PC desktop environment"
echo "   • Custom game support"
echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════${NC}"
echo ""

# Start server
print_info "Starting development server..."
echo ""

node server.js
