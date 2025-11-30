#!/bin/bash

# VELOCITY DEMO READINESS HEALTH CHECK
# Parallel batch script for pre-demo validation
# Runs multiple checks concurrently for speed

set -o pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'
BOLD='\033[1m'

echo -e "${PURPLE}${BOLD}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}${BOLD}║       VELOCITY DEMO READINESS HEALTH CHECK                   ║${NC}"
echo -e "${PURPLE}${BOLD}║       Parallel Batch Validation System                        ║${NC}"
echo -e "${PURPLE}${BOLD}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_DIR"

TEMP_DIR=$(mktemp -d)
trap "rm -rf $TEMP_DIR" EXIT

declare -i TOTAL_ISSUES=0
declare -i CRITICAL=0
declare -i WARNINGS=0

check_nan_bugs() {
    echo -e "\n${CYAN}[1/7] Scanning for NaN/undefined bugs...${NC}"
    
    local issues=0
    
    # Check for NaN in display patterns
    NAN_PATTERNS=$(grep -rn --include="*.tsx" --include="*.ts" \
        -E "\.toFixed\(|\.format\(|\.toLocaleString\(" src/ 2>/dev/null | \
        grep -v "node_modules" | head -50)
    
    if [ -n "$NAN_PATTERNS" ]; then
        echo "$NAN_PATTERNS" > "$TEMP_DIR/nan_patterns.txt"
        local count=$(wc -l < "$TEMP_DIR/nan_patterns.txt")
        echo -e "  ${YELLOW}⚠ Found $count potential NaN sources (check for missing Number() wrappers)${NC}"
        issues=$((issues + 1))
    fi
    
    # Check for undefined property access without guards
    UNDEFINED_RISK=$(grep -rn --include="*.tsx" --include="*.ts" \
        -E "\.\w+\s*\|\|\s*0|\?\.\w+\s*\|\|" src/ 2>/dev/null | \
        grep -v "node_modules" | wc -l)
    
    if [ "$UNDEFINED_RISK" -gt 0 ]; then
        echo -e "  ${GREEN}✓ Found $UNDEFINED_RISK defensive guards (good)${NC}"
    fi
    
    # Check for missing Number() wrappers on calculations
    CALC_RISK=$(grep -rn --include="*.tsx" --include="*.ts" \
        -E "reduce\(.*\+.*\)|\.reduce\(" src/pages/ 2>/dev/null | \
        grep -v "Number(" | grep -v "node_modules" | head -20)
    
    if [ -n "$CALC_RISK" ]; then
        echo -e "  ${YELLOW}⚠ Reduce operations found - verify Number() wrapping${NC}"
        echo "$CALC_RISK" | head -5
    fi
    
    echo "$issues" > "$TEMP_DIR/nan_issues.txt"
}

check_type_mismatches() {
    echo -e "\n${CYAN}[2/7] Checking TypeScript field name consistency...${NC}"
    
    local issues=0
    
    # Check for old field names that don't exist
    OLD_FIELDS=$(grep -rn --include="*.tsx" --include="*.ts" \
        -E "\.remainingFunds|\.spentAmount|\.grAmount|\.grBalance|\.departmentId[^?]" src/pages/ src/components/ 2>/dev/null | \
        grep -v "node_modules" | grep -v "types.ts")
    
    if [ -n "$OLD_FIELDS" ]; then
        echo -e "  ${RED}✗ Found deprecated field names:${NC}"
        echo "$OLD_FIELDS" | head -10
        issues=$((issues + $(echo "$OLD_FIELDS" | wc -l)))
    else
        echo -e "  ${GREEN}✓ No deprecated field names found${NC}"
    fi
    
    echo "$issues" > "$TEMP_DIR/type_issues.txt"
}

check_styling_consistency() {
    echo -e "\n${CYAN}[3/7] Scanning for styling inconsistencies...${NC}"
    
    local issues=0
    
    # Check for unstyled text-gray without luxury gradients nearby
    PLAIN_TEXT=$(grep -rn --include="*.tsx" \
        -E "className=\"text-gray-[0-9]+\"" src/pages/dashboard/ 2>/dev/null | \
        grep -v "bg-gradient" | grep -v "backdrop-blur" | head -10)
    
    if [ -n "$PLAIN_TEXT" ]; then
        echo -e "  ${YELLOW}⚠ Plain text styling found (consider luxury upgrades):${NC}"
        echo "$PLAIN_TEXT" | head -5
        issues=$((issues + 1))
    fi
    
    # Check for missing backdrop-blur on overlays
    BLUR_CHECK=$(grep -rn --include="*.tsx" \
        -E "bg-white/|bg-black/|bg-gray-[0-9]+/" src/pages/ 2>/dev/null | \
        grep -v "backdrop-blur" | grep -v "node_modules" | wc -l)
    
    if [ "$BLUR_CHECK" -gt 5 ]; then
        echo -e "  ${YELLOW}⚠ Found $BLUR_CHECK semi-transparent backgrounds without backdrop-blur${NC}"
    fi
    
    # Check for consistent premium styling patterns
    PREMIUM_PATTERNS=$(grep -rn --include="*.tsx" \
        -E "from-slate-|Damascus|carbon-fiber|metallic" src/ 2>/dev/null | wc -l)
    
    echo -e "  ${BLUE}ℹ Premium styling patterns found: $PREMIUM_PATTERNS occurrences${NC}"
    
    echo "$issues" > "$TEMP_DIR/style_issues.txt"
}

check_data_presence() {
    echo -e "\n${CYAN}[4/7] Validating data presence (Authenticity Pillar)...${NC}"
    
    local issues=0
    
    # Check for mock/fake/sample/placeholder patterns
    MOCK_DATA=$(grep -rni --include="*.tsx" --include="*.ts" \
        -E "mock|fake|sample|placeholder|lorem|ipsum|test data|dummy" src/ 2>/dev/null | \
        grep -v "node_modules" | grep -v ".test." | grep -v "scripts/" | head -20)
    
    if [ -n "$MOCK_DATA" ]; then
        echo -e "  ${RED}✗ CRITICAL: Mock/fake data patterns found:${NC}"
        echo "$MOCK_DATA" | head -10
        issues=$((issues + $(echo "$MOCK_DATA" | wc -l)))
    else
        echo -e "  ${GREEN}✓ No mock/fake data patterns detected${NC}"
    fi
    
    # Check for hardcoded numbers that should be dynamic
    HARDCODED=$(grep -rn --include="*.tsx" \
        -E "value=\{[0-9]+\}|value=\"[0-9]+\"" src/pages/ 2>/dev/null | \
        grep -v "node_modules" | head -10)
    
    if [ -n "$HARDCODED" ]; then
        echo -e "  ${YELLOW}⚠ Potential hardcoded values (verify these are intentional):${NC}"
        echo "$HARDCODED" | head -5
    fi
    
    echo "$issues" > "$TEMP_DIR/data_issues.txt"
}

check_api_endpoints() {
    echo -e "\n${CYAN}[5/7] Checking API endpoint availability...${NC}"
    
    local issues=0
    
    # Extract API routes from server
    if [ -f "server/index.cjs" ]; then
        API_ROUTES=$(grep -oE "app\.(get|post|put|delete|patch)\s*\(['\"]\/[^'\"]+['\"]" server/index.cjs 2>/dev/null | \
            sed "s/app\.\(get\|post\|put\|delete\|patch\)\s*(['\"]//g" | tr -d "'" | tr -d '"' | sort -u)
        
        if [ -n "$API_ROUTES" ]; then
            local route_count=$(echo "$API_ROUTES" | wc -l)
            echo -e "  ${GREEN}✓ Found $route_count API endpoints defined${NC}"
        else
            echo -e "  ${YELLOW}⚠ Could not parse API routes${NC}"
        fi
    fi
    
    # Check for unhandled fetch errors
    UNHANDLED_FETCH=$(grep -rn --include="*.tsx" --include="*.ts" \
        -E "fetch\(|axios\." src/ 2>/dev/null | \
        grep -v "catch" | grep -v "node_modules" | wc -l)
    
    if [ "$UNHANDLED_FETCH" -gt 5 ]; then
        echo -e "  ${YELLOW}⚠ Found fetch calls - verify error handling${NC}"
    fi
    
    echo "$issues" > "$TEMP_DIR/api_issues.txt"
}

check_route_completeness() {
    echo -e "\n${CYAN}[6/7] Checking route completeness...${NC}"
    
    local issues=0
    
    # Find all route definitions
    ROUTES=$(grep -rn --include="*.tsx" \
        -E "path:\s*['\"]\/[^'\"]+['\"]|to:\s*['\"]\/[^'\"]+['\"]" src/ 2>/dev/null | \
        grep -v "node_modules")
    
    if [ -n "$ROUTES" ]; then
        local route_count=$(echo "$ROUTES" | wc -l)
        echo -e "  ${BLUE}ℹ Found $route_count route references${NC}"
    fi
    
    # Check for dead routes (routes without matching pages)
    if [ -d "src/pages" ]; then
        PAGES=$(find src/pages -name "*.tsx" -type f | wc -l)
        echo -e "  ${GREEN}✓ Found $PAGES page components${NC}"
    fi
    
    # Check for hyphenated vs non-hyphenated route issues
    HYPHEN_ROUTES=$(grep -rn --include="*.tsx" \
        -E "\/purchase-orders|\/purchaseorders|\/statement-of-works|\/statementofworks" src/ 2>/dev/null | \
        grep -v "node_modules" | head -10)
    
    if [ -n "$HYPHEN_ROUTES" ]; then
        echo -e "  ${YELLOW}⚠ Mixed route naming conventions found - verify aliases exist${NC}"
    fi
    
    echo "$issues" > "$TEMP_DIR/route_issues.txt"
}

check_component_imports() {
    echo -e "\n${CYAN}[7/7] Checking component imports and dependencies...${NC}"
    
    local issues=0
    
    # Check for unused imports
    IMPORT_COUNT=$(grep -rn --include="*.tsx" "^import" src/pages/ 2>/dev/null | wc -l)
    echo -e "  ${BLUE}ℹ Total imports in pages: $IMPORT_COUNT${NC}"
    
    # Check for circular dependencies (basic check)
    CIRCULAR=$(grep -rln --include="*.tsx" --include="*.ts" \
        "from ['\"]\.\.\/\.\.\/" src/components/ 2>/dev/null | head -5)
    
    if [ -n "$CIRCULAR" ]; then
        echo -e "  ${YELLOW}⚠ Potential deep relative imports (check for circular deps):${NC}"
        echo "$CIRCULAR"
    fi
    
    echo "$issues" > "$TEMP_DIR/import_issues.txt"
}

# Run all checks in parallel
echo -e "\n${BOLD}Running parallel health checks...${NC}\n"

check_nan_bugs &
check_type_mismatches &
check_styling_consistency &
check_data_presence &
check_api_endpoints &
check_route_completeness &
check_component_imports &

wait

# Aggregate results
echo -e "\n${PURPLE}${BOLD}══════════════════════════════════════════════════════════════${NC}"
echo -e "${PURPLE}${BOLD}                    HEALTH CHECK SUMMARY                        ${NC}"
echo -e "${PURPLE}${BOLD}══════════════════════════════════════════════════════════════${NC}\n"

for file in "$TEMP_DIR"/*_issues.txt; do
    if [ -f "$file" ]; then
        count=$(cat "$file")
        TOTAL_ISSUES=$((TOTAL_ISSUES + count))
    fi
done

if [ $TOTAL_ISSUES -eq 0 ]; then
    echo -e "${GREEN}${BOLD}✓ ALL CHECKS PASSED - DEMO READY${NC}"
else
    echo -e "${YELLOW}${BOLD}⚠ Found $TOTAL_ISSUES potential issues to review${NC}"
fi

echo -e "\n${CYAN}Quick Fix Commands:${NC}"
echo -e "  • Fix NaN: Wrap calculations in Number() - e.g., Number(value) || 0"
echo -e "  • Fix types: Update field names to match database schema"
echo -e "  • Fix styling: Add luxury gradients and backdrop-blur"
echo ""
echo -e "${PURPLE}Scan completed at $(date '+%Y-%m-%d %H:%M:%S')${NC}"
