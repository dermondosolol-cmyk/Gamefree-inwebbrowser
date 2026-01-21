#!/bin/bash

###############################################################################
# Nebula Gaming - Local Development Server Startup Script
# Starts the trusted local development server on localhost:8000
###############################################################################

set -e

echo "🎮 Nebula Gaming - Starting Local Development Server"
echo "======================================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed"
    echo "   Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is not installed"
    exit 1
fi

echo "✅ Node.js $(node --version) detected"
echo "✅ npm $(npm --version) detected"
echo ""

# Navigate to script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
    echo ""
fi

# Check if server.js exists
if [ ! -f "server.js" ]; then
    echo "❌ Error: server.js not found"
    exit 1
fi

# Kill any process using port 8000
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "⚠️  Port 8000 is already in use. Attempting to free it..."
    EXISTING_PID=$(lsof -Pi :8000 -sTCP:LISTEN -t)
    kill -9 $EXISTING_PID 2>/dev/null || true
    sleep 1
    echo "✅ Port freed"
fi

echo ""
echo "🚀 Starting development server..."
echo ""

# Start the server
node server.js
