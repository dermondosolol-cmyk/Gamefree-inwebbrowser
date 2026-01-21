#!/bin/bash

# ================================
# Complete Deployment Setup Guide
# ================================

echo "🎮 Gamefree Browser - Deployment Setup"
echo "======================================"
echo ""

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18 or higher"
    exit 1
fi

echo "✅ Node.js $(node --version) installed"

# Check for npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install npm"
    exit 1
fi

echo "✅ npm $(npm --version) installed"

# Check for git
if ! command -v git &> /dev/null; then
    echo "❌ git not found. Please install git"
    exit 1
fi

echo "✅ git $(git --version | cut -d' ' -f3) installed"

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "======================================"
echo "🎯 Deployment Options:"
echo "======================================"
echo ""
echo "Option 1: Railway.app (Recommended)"
echo "  Command: ./deploy-railway.sh"
echo "  Features:"
echo "    ✓ Free tier with auto-scaling"
echo "    ✓ GitHub integration"
echo "    ✓ Auto-deploys on push"
echo "    ✓ Custom domains supported"
echo ""
echo "Option 2: Render.com"
echo "  Command: ./deploy-render.sh"
echo "  Features:"
echo "    ✓ Free tier (with 15-min auto-sleep)"
echo "    ✓ GitHub integration"
echo "    ✓ Auto-deploys on push"
echo "    ✓ PostgreSQL included"
echo ""
echo "======================================"
echo "🚀 Quick Start:"
echo "======================================"
echo ""
echo "1. Test locally:"
echo "   npm run serve"
echo ""
echo "2. Push to GitHub:"
echo "   git push origin main"
echo ""
echo "3. Deploy:"
echo "   Option A: bash ./deploy-railway.sh"
echo "   Option B: bash ./deploy-render.sh"
echo ""
echo "======================================"
