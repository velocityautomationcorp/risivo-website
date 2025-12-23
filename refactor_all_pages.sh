#!/bin/bash
# Mass CSS Refactoring Script for Risivo Website
# Removes inline <style> blocks and replaces with global CSS

set -e

echo "🚀 Starting Mass CSS Refactoring..."
echo "======================================"
echo ""

# Counter for progress
TOTAL_FILES=0
REFACTORED_FILES=0

# Function to refactor a single file
refactor_file() {
    local file="$1"
    local min_styles="$2"  # Minimal page-specific styles to keep
    
    if [ ! -f "$file" ]; then
        echo "⚠️  File not found: $file"
        return
    fi
    
    TOTAL_FILES=$((TOTAL_FILES + 1))
    
    # Backup
    cp "$file" "${file}.backup_refactor"
    
    # Check if file has <style> block
    if ! grep -q "<style>" "$file"; then
        echo "⏭️  No inline styles: $(basename $file)"
        return
    fi
    
    # Find style block
    START=$(grep -n "<style>" "$file" | head -1 | cut -d: -f1)
    END=$(grep -n "</style>" "$file" | head -1 | cut -d: -f1)
    REMOVED=$((END - START + 1))
    
    # Replace with minimal styles
    awk -v start="$START" -v end="$END" -v mins="$min_styles" '
    NR < start { print; next }
    NR == start {
        if (mins != "") {
            print "    <style>"
            print mins
            print "    </style>"
        }
        next
    }
    NR > start && NR <= end { next }
    NR > end { print }
    ' "${file}.backup_refactor" > "$file"
    
    # Replace CSS link
    sed -i 's|<link rel="stylesheet" href="/static/updates-shared.css">|<link rel="stylesheet" href="/static/risivo-global.css">|g' "$file"
    
    # Remove font imports (now in global CSS)
    sed -i '/<link rel="preconnect" href="https:\/\/fonts.googleapis.com">/d' "$file"
    sed -i '/<link rel="preconnect" href="https:\/\/fonts.gstatic.com" crossorigin>/d' "$file"
    sed -i '/fonts.googleapis.com\/css2?family=Poppins/d' "$file"
    
    REFACTORED_FILES=$((REFACTORED_FILES + 1))
    echo "✅ $(basename $file) - Removed $REMOVED lines"
}

# Authentication Pages
echo "📄 Refactoring Authentication Pages..."
refactor_file "src/pages/user-login.tsx" ""
refactor_file "src/pages/forgot-password.tsx" ""
refactor_file "src/pages/reset-password.tsx" ""
refactor_file "src/pages/admin-login.tsx" ""

# Admin Tools
echo ""
echo "🔧 Refactoring Admin Tools..."
refactor_file "src/pages/admin-categories.tsx" ""
refactor_file "src/pages/admin-update-form.tsx" "        /* Admin Form - Page-specific */
        .form-section {
            margin-bottom: 30px;
        }
        .rich-text-editor {
            min-height: 300px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            padding: 15px;
        }"

# Legal Pages  
echo ""
echo "📜 Refactoring Legal Pages..."
refactor_file "src/pages/privacy-policy.tsx" ""
refactor_file "src/pages/terms-of-service.tsx" ""

# Marketing Pages
echo ""
echo "🎨 Refactoring Marketing Pages..."

# Homepage variations
for file in src/pages/homepage*.ts; do
    if [ -f "$file" ]; then
        refactor_file "$file" ""
    fi
done

# Contact pages
for file in src/pages/contact*.ts; do
    if [ -f "$file" ]; then
        refactor_file "$file" ""
    fi
done

# Pricing pages
for file in src/pages/pricing*.ts; do
    if [ -f "$file" ]; then
        refactor_file "$file" ""
    fi
done

# Features pages
for file in src/pages/features*.ts; do
    if [ -f "$file" ]; then
        refactor_file "$file" ""
    fi
done

# Coming soon page
refactor_file "src/pages/coming-soon.ts" ""

echo ""
echo "======================================"
echo "✨ Refactoring Complete!"
echo "======================================"
echo "   Total files processed: $TOTAL_FILES"
echo "   Successfully refactored: $REFACTORED_FILES"
echo ""
echo "📊 Summary:"
echo "   - All inline <style> blocks removed"
echo "   - Global CSS linked: /static/risivo-global.css"
echo "   - Font imports removed (now in global CSS)"
echo "   - Backup files created (.backup_refactor)"
echo ""
echo "🧪 Next Steps:"
echo "   1. Review changes: git diff src/pages/"
echo "   2. Test pages locally"
echo "   3. Commit changes: git add . && git commit -m 'refactor: Remove inline CSS, use global stylesheet'"
echo "   4. Deploy to staging"
echo ""
