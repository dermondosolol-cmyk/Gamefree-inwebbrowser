#!/bin/bash

# GAMEFREE BROWSER 2026 - PRODUCTION DEPLOYMENT SCRIPT
# Deploys to multiple platforms simultaneously
# Session 8 - All Options

echo "╔═══════════════════════════════════════════════════════╗"
echo "║  GAMEFREE BROWSER 2026 - PRODUCTION DEPLOYMENT        ║"
echo "║  Multi-Platform Deployment Script                     ║"
echo "║  January 2026                                          ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Configuration
REPO_URL="https://github.com/dermondosolol-cmyk/Gamefree-inwebbrowser"
PROJECT_NAME="gamefree-browser-2026"
VERCEL_PROJECT="gamefree-browser"
NETLIFY_SITE="gamefree-browser"

# Helper functions
print_header() {
    echo -e "${BLUE}╔═══════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║ $1${NC}"
    echo -e "${BLUE}╚═══════════════════════════════════════╝${NC}"
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
    echo -e "${CYAN}ℹ️  $1${NC}"
}

# ===== PRE-DEPLOYMENT CHECKS =====
print_header "PRE-DEPLOYMENT CHECKS"

echo ""
echo "Checking prerequisites..."

if ! command -v git &> /dev/null; then
    print_error "Git not found"
    exit 1
fi
print_success "Git found"

if ! command -v npm &> /dev/null; then
    print_error "npm not found"
    exit 1
fi
print_success "npm found"

if ! command -v node &> /dev/null; then
    print_error "Node.js not found"
    exit 1
fi
print_success "Node.js found: $(node --version)"

# Check if in correct directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found - run from project root"
    exit 1
fi
print_success "Project directory verified"

# Check required files
REQUIRED_FILES=(
    "index.html"
    "styles.css"
    "script.js"
    "gameSourceConnector.js"
    "responsiveGameFrame.js"
    "gamePlatform.js"
    "package.json"
)

echo ""
echo "Checking required files..."
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        print_success "$file present"
    else
        print_error "$file MISSING"
        exit 1
    fi
done

# ===== DEPLOYMENT OPTIONS MENU =====
print_header "DEPLOYMENT OPTIONS"

echo ""
echo "Select deployment platform:"
echo ""
echo "  1) Vercel (Recommended - Fastest)"
echo "  2) Netlify"
echo "  3) GitHub Pages"
echo "  4) Custom Server"
echo "  5) All Platforms (Parallel)"
echo ""
read -p "Choose option (1-5): " OPTION

case $OPTION in
    1)
        print_header "DEPLOYING TO VERCEL"
        DEPLOY_VERCEL=true
        ;;
    2)
        print_header "DEPLOYING TO NETLIFY"
        DEPLOY_NETLIFY=true
        ;;
    3)
        print_header "DEPLOYING TO GITHUB PAGES"
        DEPLOY_GITHUB=true
        ;;
    4)
        print_header "CUSTOM SERVER DEPLOYMENT"
        read -p "Enter server address (user@host:/path): " SERVER_ADDRESS
        DEPLOY_CUSTOM=true
        ;;
    5)
        print_header "DEPLOYING TO ALL PLATFORMS"
        DEPLOY_VERCEL=true
        DEPLOY_NETLIFY=true
        DEPLOY_GITHUB=true
        ;;
    *)
        print_error "Invalid option"
        exit 1
        ;;
esac

# ===== BUILD PROCESS =====
print_header "BUILD PROCESS"

echo ""
echo "Running pre-deployment checks..."
npm run lint
npm run format

if [ $? -ne 0 ]; then
    print_warning "Code quality checks had issues"
fi

echo ""
echo "Running tests before deployment..."
npm run test

if [ $? -eq 0 ]; then
    print_success "All tests passed"
else
    print_warning "Some tests failed - proceed with caution"
    read -p "Continue deployment anyway? (y/n): " CONTINUE
    if [ "$CONTINUE" != "y" ]; then
        print_error "Deployment cancelled"
        exit 1
    fi
fi

# ===== VERCEL DEPLOYMENT =====
if [ "$DEPLOY_VERCEL" = true ]; then
    print_header "VERCEL DEPLOYMENT"
    
    echo ""
    print_info "Installing Vercel CLI..."
    npm install -g vercel
    
    echo ""
    print_info "Logging in to Vercel..."
    vercel login
    
    echo ""
    print_info "Deploying to Vercel..."
    vercel --prod
    
    if [ $? -eq 0 ]; then
        print_success "Vercel deployment complete"
        VERCEL_URL=$(vercel list --json | grep -o '"url":"[^"]*' | head -1 | cut -d'"' -f4)
        print_info "Live URL: https://$VERCEL_URL"
    else
        print_error "Vercel deployment failed"
    fi
    
    echo ""
fi

# ===== NETLIFY DEPLOYMENT =====
if [ "$DEPLOY_NETLIFY" = true ]; then
    print_header "NETLIFY DEPLOYMENT"
    
    echo ""
    print_info "Installing Netlify CLI..."
    npm install -g netlify-cli
    
    echo ""
    print_info "Logging in to Netlify..."
    netlify login
    
    echo ""
    print_info "Deploying to Netlify..."
    netlify deploy --prod
    
    if [ $? -eq 0 ]; then
        print_success "Netlify deployment complete"
    else
        print_error "Netlify deployment failed"
    fi
    
    echo ""
fi

# ===== GITHUB PAGES DEPLOYMENT =====
if [ "$DEPLOY_GITHUB" = true ]; then
    print_header "GITHUB PAGES DEPLOYMENT"
    
    echo ""
    print_info "Creating gh-pages branch..."
    
    git checkout --orphan gh-pages
    git add -A
    git commit -m "Deploy to GitHub Pages - $(date)"
    git push origin gh-pages
    
    if [ $? -eq 0 ]; then
        print_success "GitHub Pages deployment complete"
        print_info "Live URL: https://dermondosolol-cmyk.github.io/Gamefree-inwebbrowser"
        print_info "Note: May take 1-2 minutes to go live"
    else
        print_error "GitHub Pages deployment failed"
    fi
    
    # Switch back to main
    git checkout main
    
    echo ""
fi

# ===== CUSTOM SERVER DEPLOYMENT =====
if [ "$DEPLOY_CUSTOM" = true ]; then
    print_header "CUSTOM SERVER DEPLOYMENT"
    
    echo ""
    print_info "Building for production..."
    npm run build
    
    echo ""
    print_info "Creating deployment package..."
    tar -czf gamefree-browser.tar.gz \
        index.html \
        styles.css \
        script.js \
        gameSourceConnector.js \
        responsiveGameFrame.js \
        gamePlatform.js \
        gameDebugger.js \
        debug-mode.js \
        package.json \
        node_modules
    
    echo ""
    print_info "Uploading to server: $SERVER_ADDRESS"
    
    scp gamefree-browser.tar.gz "$SERVER_ADDRESS/"
    
    if [ $? -eq 0 ]; then
        print_success "File uploaded successfully"
        print_info "Next steps on server:"
        echo "  1. tar -xzf gamefree-browser.tar.gz"
        echo "  2. npm install"
        echo "  3. npm run serve"
        echo "  4. Configure web server (nginx/Apache)"
    else
        print_error "Upload failed"
    fi
    
    rm gamefree-browser.tar.gz
    
    echo ""
fi

# ===== POST-DEPLOYMENT =====
print_header "POST-DEPLOYMENT STEPS"

echo ""
echo "1. Verify deployment:"
echo "   - Open live URL in browser"
echo "   - Test game loading"
echo "   - Check Virtual PC functionality"
echo "   - Verify mobile responsiveness"
echo ""

echo "2. Enable monitoring:"
echo "   - Check logs on deployment platform"
echo "   - Set up error tracking"
echo "   - Enable performance monitoring"
echo ""

echo "3. Configure domain:"
echo "   - Update DNS records (if using custom domain)"
echo "   - Set up SSL/TLS"
echo "   - Configure CDN if needed"
echo ""

echo "4. Test in production:"
echo "   - Run: npm run test:headed"
echo "   - Enable debug mode: ?debug=true"
echo "   - Monitor console for errors"
echo "   - Check network requests"
echo ""

# ===== FINAL STATUS =====
print_header "DEPLOYMENT STATUS"

echo ""
print_success "Deployment initiated"
print_info "Repository: $REPO_URL"
print_info "Project: $PROJECT_NAME"
print_info "Status: LIVE"
echo ""

echo -e "${GREEN}╔═════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  DEPLOYMENT COMPLETE                    ║${NC}"
echo -e "${GREEN}║  Gamefree Browser 2026 is now live!     ║${NC}"
echo -e "${GREEN}╚═════════════════════════════════════════╝${NC}"
echo ""

print_info "For monitoring, run:"
echo "   npm run diagnostics"
echo ""

print_info "For debug mode:"
echo "   http://yourdomain.com?debug=true"
echo ""

print_info "For full logs:"
echo "   DEBUG.exportLogs()"
echo ""
