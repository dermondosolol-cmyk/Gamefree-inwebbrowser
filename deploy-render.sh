#!/bin/bash

# ================================
# Render.com Deployment Script
# ================================

echo "🚀 Deploying to Render.com..."
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "⚠️  Git repository not found. Initializing git..."
    git init
    git add .
    git commit -m "Initial commit for Render deployment"
fi

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo "📝 Committing changes..."
    git add .
    git commit -m "Deployment update: $(date +%Y-%m-%d\ %H:%M:%S)"
fi

echo ""
echo "✅ Repository ready for Render deployment!"
echo ""
echo "Next steps:"
echo "1. Visit https://dashboard.render.com"
echo "2. Click 'New +' → 'Web Service'"
echo "3. Connect your GitHub repository"
echo "4. Select this project"
echo "5. Configure settings:"
echo "   - Build Command: npm install"
echo "   - Start Command: npm run start"
echo "   - Node Version: 18"
echo "6. Click 'Create Web Service'"
echo ""
echo "Your site will be available at: https://<your-service-name>.onrender.com"
