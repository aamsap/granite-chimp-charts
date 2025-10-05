#!/bin/bash

# Chimp Chart Local Development Setup
echo "🚀 Starting Chimp Chart Local Development..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Set environment variables for local development
export VITE_API_URL=http://localhost:3000

echo "🌐 Environment configured:"
echo "   VITE_API_URL=$VITE_API_URL"

echo ""
echo "📋 Available commands:"
echo "   1. npm run dev          - Start frontend development server"
echo "   2. vercel dev           - Start serverless functions locally"
echo "   3. npm run build        - Build for production"
echo "   4. npm run preview      - Preview production build"
echo ""

echo "🔧 To run the application:"
echo "   Terminal 1: npm run dev (Frontend on http://localhost:5173)"
echo "   Terminal 2: vercel dev (API on http://localhost:3000)"
echo ""

echo "📁 Project structure:"
echo "   Frontend: React + Vite"
echo "   Backend: Vercel Serverless Functions"
echo "   API Routes: /api/health, /api/upload, /api/analysis, /api/dashboard"
echo ""

echo "✅ Setup complete! Ready for development."
