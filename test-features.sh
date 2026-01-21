#!/bin/bash

# Gamefree Browser 2026 - Comprehensive Testing Script
# Session 8: Testing All Features

echo "================================"
echo "GAMEFREE BROWSER 2026"
echo "Feature Testing & Verification"
echo "Session 8"
echo "================================"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_section() {
    echo ""
    echo -e "${BLUE}=== $1 ===${NC}"
    echo ""
}

print_pass() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_fail() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

# TEST 1: File Integrity
print_section "Test 1: File Integrity Check"

FILES=(
    "index.html:212"
    "styles.css:1128"
    "script.js:950"
    "gameSourceConnector.js:409"
    "responsiveGameFrame.js:322"
    "gamePlatform.js:399"
    "gameDebugger.js:433"
    "debug-mode.js:100"
)

PASS=0
FAIL=0

for file_info in "${FILES[@]}"; do
    IFS=':' read -r file expected_lines <<< "$file_info"
    if [ -f "$file" ]; then
        actual_lines=$(wc -l < "$file")
        if [ "$actual_lines" -gt 0 ]; then
            print_pass "$file exists ($actual_lines lines)"
            ((PASS++))
        else
            print_fail "$file is empty"
            ((FAIL++))
        fi
    else
        print_fail "$file is missing"
        ((FAIL++))
    fi
done

echo "Result: $PASS passed, $FAIL failed"

# TEST 2: Syntax Validation
print_section "Test 2: JavaScript Syntax Check"

for file in script.js gameSourceConnector.js responsiveGameFrame.js gamePlatform.js gameDebugger.js debug-mode.js; do
    if node -c "$file" 2>/dev/null; then
        print_pass "$file - syntax valid"
    else
        print_fail "$file - syntax invalid"
    fi
done

# TEST 3: HTML Validation (basic)
print_section "Test 3: HTML Structure Check"

echo "Checking required IDs in HTML..."
REQUIRED_IDS=(
    "gameUrlInput"
    "addGameBtn"
    "gamesList"
    "gameModal"
    "gameFrame"
    "startBtn"
    "terminalContent"
    "virtualSearch"
)

for id in "${REQUIRED_IDS[@]}"; do
    if grep -q "id=\"$id\"" index.html; then
        print_pass "ID '$id' found in HTML"
    else
        print_fail "ID '$id' missing from HTML"
    fi
done

# TEST 4: CSS Classes
print_section "Test 4: CSS Classes Check"

REQUIRED_CLASSES=(
    "game-card"
    "modal"
    "tab-content"
    "active"
    "virtualpc-container"
)

for class in "${REQUIRED_CLASSES[@]}"; do
    if grep -q "\\.$class" styles.css; then
        print_pass "CSS class '.$class' found"
    else
        print_fail "CSS class '.$class' missing"
    fi
done

# TEST 5: Function Definitions
print_section "Test 5: Critical Functions Check"

CRITICAL_FUNCTIONS=(
    "loadGames:script.js"
    "saveGames:script.js"
    "playGame:script.js"
    "renderAllTabs:script.js"
    "runDiagnostics:gameDebugger.js"
)

for func_file in "${CRITICAL_FUNCTIONS[@]}"; do
    IFS=':' read -r func file <<< "$func_file"
    if grep -q "^\s*$func\s*(" "$file" || grep -q "$func\s*(" "$file"; then
        print_pass "Function '$func' found in $file"
    else
        print_fail "Function '$func' missing from $file"
    fi
done

# TEST 6: Error Handling
print_section "Test 6: Error Handling Check"

echo "Checking for try/catch blocks..."
TRY_CATCH_COUNT=$(grep -c "try {" script.js)
if [ "$TRY_CATCH_COUNT" -ge 5 ]; then
    print_pass "Found $TRY_CATCH_COUNT try/catch blocks"
else
    print_warning "Only found $TRY_CATCH_COUNT try/catch blocks (expected more)"
fi

# TEST 7: Security Features
print_section "Test 7: Security Features Check"

echo "Checking XSS prevention..."
if grep -q "escapeHtml" script.js; then
    print_pass "XSS prevention (escapeHtml) found"
else
    print_fail "XSS prevention missing"
fi

echo "Checking URL validation..."
if grep -q "isValidUrl" script.js; then
    print_pass "URL validation found"
else
    print_fail "URL validation missing"
fi

echo "Checking iframe sandboxing..."
if grep -q "sandbox=" index.html; then
    print_pass "Iframe sandboxing found"
else
    print_fail "Iframe sandboxing missing"
fi

# TEST 8: Null Safety
print_section "Test 8: Null Safety Checks"

NULL_CHECK_COUNT=$(grep -c "if\s*(!.*)" script.js)
echo "Found $NULL_CHECK_COUNT null safety checks in script.js"
if [ "$NULL_CHECK_COUNT" -ge 10 ]; then
    print_pass "Adequate null safety checks present"
else
    print_warning "May need more null safety checks"
fi

# TEST 9: LocalStorage Usage
print_section "Test 9: LocalStorage Integration"

if grep -q "localStorage\." script.js; then
    print_pass "LocalStorage usage found"
    STORAGE_OPS=$(grep -c "localStorage\." script.js)
    print_pass "Found $STORAGE_OPS LocalStorage operations"
else
    print_fail "LocalStorage not used"
fi

# TEST 10: Game Count
print_section "Test 10: Game Data Validation"

GAME_COUNT=$(grep -c "{ id:" script.js)
echo "Found $GAME_COUNT game definitions"
if [ "$GAME_COUNT" -ge 100 ]; then
    print_pass "Sufficient game data (100+ games)"
else
    print_fail "Insufficient games (found $GAME_COUNT)"
fi

# SUMMARY
print_section "SUMMARY"

echo "Tests completed!"
echo ""
echo "Next steps:"
echo "1. Review any failures above"
echo "2. Fix identified issues"
echo "3. Run 'npm run serve' to test locally"
echo "4. Test features in browser:"
echo "   - Adding games"
echo "   - Tab navigation"
echo "   - Game search"
echo "   - Modal interactions"
echo "   - Virtual PC features"
echo "5. Open ?debug=true to enable debug logging"
echo ""
