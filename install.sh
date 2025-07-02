#!/bin/bash

echo "🚀 Setting up Inventory Management System..."
echo "============================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Navigate to backend directory
cd backend

echo "📦 Installing backend dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed successfully!"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. cd backend"
echo "2. npm start"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "🔑 Login credentials:"
echo "   Admin: admin / admin123"
echo "   User:  user / user123"
echo ""
echo "Happy coding! 🚀"
