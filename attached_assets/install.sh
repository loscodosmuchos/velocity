#!/bin/bash

# Missing Data Generator Module Installation Script
# Module ID: 3n4ir3
# For integration with o5g34xapps

echo "🚀 Installing Missing Data Generator Module (3n4ir3)..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this script from your o5g34xapps root directory"
    exit 1
fi

# Create modules directory if it doesn't exist
mkdir -p modules/missing-data-generator

# Copy module files
echo "📁 Copying module files..."
cp -r missing-data-module/* modules/missing-data-generator/

# Install dependencies
echo "📦 Installing NPM dependencies..."
npm install @tanstack/react-query wouter lucide-react

# Database setup
echo "🗄️ Setting up database schema..."
if command -v psql &> /dev/null; then
    echo "PostgreSQL detected. Run the following SQL to set up tables:"
    echo "psql -d your_database < modules/missing-data-generator/src/schemas/database.sql"
else
    echo "Please run the SQL schema manually:"
    echo "cat modules/missing-data-generator/src/schemas/database.sql"
fi

# Create integration example
echo "📝 Creating integration example..."
cat > example-integration.js << 'EOF'
// Example integration for o5g34xapps
import { MissingDataGenerator, ClientPortal } from './modules/missing-data-generator/dist/index.js';

// Basic usage
function App() {
  return (
    <div>
      <MissingDataGenerator 
        apiBaseUrl="/api"
        onRequirementCreated={(req) => {
          console.log('Created requirement:', req.id);
          // Add your custom logic here
        }}
        onError={(error) => {
          console.error('Module error:', error);
          // Add your error handling here
        }}
      />
    </div>
  );
}

export default App;
EOF

echo "✅ Installation complete!"
echo ""
echo "Next steps:"
echo "1. Run the database schema: psql -d your_db < modules/missing-data-generator/src/schemas/database.sql"
echo "2. Add API routes to your Express server (see integration-guide.md)"
echo "3. Import components in your React app (see example-integration.js)"
echo ""
echo "Module ID: 3n4ir3"
echo "Version: 1.0.0"
echo "Documentation: modules/missing-data-generator/README.md"