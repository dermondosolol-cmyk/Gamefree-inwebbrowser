#!/bin/bash

# ================================
# Railway.app Deployment Script
# ================================

echo "🚀 Deploying to Railway.app..."
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "📦 Installing Railway CLI..."
    npm install -g railway
fi

# Link project to Railway
echo "🔗 Linking to Railway project..."
railway link

# Deploy to Railway
echo "📤 Deploying to Railway..."
railway up

echo ""
echo "✅ Deployment complete!"
echo "🌐 Your site is now live on Railway.app"
echo ""
echo "Next steps:"
echo "1. Visit https://railway.app/dashboard"
echo "2. Find your project and check the deployment logs"
echo "3. Your public URL will be displayed on the deployment page"
