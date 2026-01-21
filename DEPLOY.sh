#!/bin/bash

# ═══════════════════════════════════════════════════════════════════════════════
# GAMEFREE BROWSER 2026 - AUTOMATED DEPLOYMENT SCRIPT
# ═══════════════════════════════════════════════════════════════════════════════

set -e  # Exit on error

echo ""
echo "═══════════════════════════════════════════════════════════════════════════════"
echo "                    🚀 GAMEFREE BROWSER 2026 DEPLOYMENT"
echo "═══════════════════════════════════════════════════════════════════════════════"
echo ""

# Step 1: Install Dependencies
echo "📦 Step 1: Installing npm dependencies..."
npm install

echo ""
echo "✅ Dependencies installed successfully!"
echo ""

# Step 2: Install Playwright Browsers
echo "🌐 Step 2: Installing Playwright browsers..."
npm run pretest

echo ""
echo "✅ Browsers installed successfully!"
echo ""

# Step 3: Lint Check
echo "🔍 Step 3: Running lint check..."
npm run lint

echo ""
echo "✅ Code quality check passed!"
echo ""

# Step 4: Format Code
echo "✨ Step 4: Formatting code..."
npm run format

echo ""
echo "✅ Code formatted successfully!"
echo ""

# Step 5: Run Tests
echo "🧪 Step 5: Running test suite..."
npm test

echo ""
echo "✅ All tests passed!"
echo ""

# Step 6: Build for Production
echo "🏗️ Step 6: Building for production..."
npm run build

echo ""
echo "✅ Production build completed!"
echo ""

# Step 7: Run Diagnostics
echo "🔧 Step 7: Running system diagnostics..."
npm run diagnostics

echo ""
echo "═══════════════════════════════════════════════════════════════════════════════"
echo "                         ✅ DEPLOYMENT SUCCESSFUL!"
echo "═══════════════════════════════════════════════════════════════════════════════"
echo ""
echo "🎉 Gamefree Browser 2026 is ready for production!"
echo ""
echo "Available Commands:"
echo "  • npm run dev              - Start development server"
echo "  • npm test                 - Run tests"
echo "  • npm run test:report      - View test results"
echo "  • npm run diagnostics      - Run diagnostics"
echo ""
echo "═══════════════════════════════════════════════════════════════════════════════"
echo ""
