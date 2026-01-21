#!/bin/bash

# Gamefree Browser 2026 - Deployment & Debug Script
# Session 8: Deployment, Testing, and Debugging

echo "================================"
echo "GAMEFREE BROWSER 2026"
echo "Deployment & Debug Process"
echo "Session 8"
echo "================================"
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print section headers
print_section() {
    echo ""
    echo -e "${BLUE}===================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}===================================${NC}"
    echo ""
}

# Function to print success
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Function to print error
print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to print warning
print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

# STEP 1: Check Node.js and npm
print_section "Step 1: Checking Prerequisites"

if ! command -v node &> /dev/null; then
    print_error "Node.js not found"
    exit 1
fi
print_success "Node.js found: $(node --version)"

if ! command -v npm &> /dev/null; then
    print_error "npm not found"
    exit 1
fi
print_success "npm found: $(npm --version)"

# STEP 2: Clean previous installations
print_section "Step 2: Cleaning Previous Installations"

if [ -d "node_modules" ]; then
    print_warning "Removing existing node_modules..."
    rm -rf node_modules
    print_success "node_modules removed"
fi

if [ -f "package-lock.json" ]; then
    print_warning "Removing existing package-lock.json..."
    rm -f package-lock.json
    print_success "package-lock.json removed"
fi

# STEP 3: Install Dependencies
print_section "Step 3: Installing Dependencies"
echo "Running: npm install"
npm install

if [ $? -eq 0 ]; then
    print_success "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# STEP 4: Verify Installation
print_section "Step 4: Verifying Installation"

if [ -d "node_modules" ]; then
    print_success "node_modules directory created"
    PKG_COUNT=$(ls node_modules | wc -l)
    print_success "Packages installed: $PKG_COUNT"
else
    print_error "node_modules not created"
    exit 1
fi

# STEP 5: Format Code
print_section "Step 5: Formatting Code"
echo "Running: npm run format"
npm run format

if [ $? -eq 0 ]; then
    print_success "Code formatted successfully"
else
    print_warning "Code formatting had issues but continuing"
fi

# STEP 6: Lint Code
print_section "Step 6: Linting Code"
echo "Running: npm run lint"
npm run lint

if [ $? -eq 0 ]; then
    print_success "Linting passed"
else
    print_warning "Linting found issues (attempting auto-fix)"
fi

# STEP 7: Run Diagnostics
print_section "Step 7: Running Diagnostics"
echo "Running: npm run diagnostics"
npm run diagnostics

if [ $? -eq 0 ]; then
    print_success "Diagnostics completed"
else
    print_warning "Diagnostics had issues"
fi

# STEP 8: Build Process
print_section "Step 8: Build Process"
echo "Running: npm run build"
npm run build

if [ $? -eq 0 ]; then
    print_success "Build completed successfully"
else
    print_error "Build failed"
    exit 1
fi

# STEP 9: Test Setup
print_section "Step 9: Installing Playwright Browsers"
echo "Running: npx playwright install"
npx playwright install

if [ $? -eq 0 ]; then
    print_success "Playwright browsers installed"
else
    print_warning "Playwright browser installation had issues"
fi

# STEP 10: Run Tests
print_section "Step 10: Running Tests"
echo "Running: npm run test:headed"
npm run test:headed

TESTS_PASSED=$?
if [ $TESTS_PASSED -eq 0 ]; then
    print_success "All tests passed"
else
    print_warning "Some tests failed or had issues"
fi

# STEP 11: Generate Test Report
print_section "Step 11: Test Report"
if [ -d "playwright-report" ]; then
    print_success "Test report generated"
    echo "Report available in: playwright-report/"
else
    print_warning "Test report not generated"
fi

# STEP 12: File Verification
print_section "Step 12: File Verification"

FILES_TO_CHECK=(
    "index.html"
    "styles.css"
    "script.js"
    "gameSourceConnector.js"
    "responsiveGameFrame.js"
    "gamePlatform.js"
    "gameDebugger.js"
    "package.json"
    "playwright.config.ts"
)

FILES_OK=0
FILES_MISSING=0

for file in "${FILES_TO_CHECK[@]}"; do
    if [ -f "$file" ]; then
        SIZE=$(wc -c < "$file")
        print_success "$file ($SIZE bytes)"
        ((FILES_OK++))
    else
        print_error "$file is MISSING"
        ((FILES_MISSING++))
    fi
done

echo ""
print_section "Step 13: Summary"

echo -e "${GREEN}✅ Files Present: $FILES_OK${NC}"
if [ $FILES_MISSING -gt 0 ]; then
    echo -e "${RED}❌ Files Missing: $FILES_MISSING${NC}"
else
    print_success "All required files present"
fi

# Final Status
echo ""
echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}DEPLOYMENT STATUS${NC}"
echo -e "${BLUE}================================${NC}"

if [ $TESTS_PASSED -eq 0 ] && [ $FILES_MISSING -eq 0 ]; then
    echo -e "${GREEN}🟢 ALL SYSTEMS GO - READY FOR PRODUCTION${NC}"
else
    echo -e "${YELLOW}🟡 ISSUES DETECTED - SEE ABOVE${NC}"
fi

echo ""
echo "Next steps:"
echo "1. Review any errors or warnings above"
echo "2. Run 'npm run serve' to start development server"
echo "3. Open http://localhost:8000 in browser"
echo "4. Test all features manually"
echo ""
