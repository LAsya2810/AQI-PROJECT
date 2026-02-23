#!/bin/bash
# Quick deployment test script - run locally before deploying to Render

echo "🧪 AQI Project - Local Deployment Test"
echo "======================================"
echo ""

# Check prerequisites
echo "✓ Checking prerequisites..."

if ! command -v python &> /dev/null; then
    echo "❌ Python not found. Install Python 3.11+"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Install Node.js 14+"
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo "⚠️  Docker not found. Docker testing will be skipped."
fi

echo "✓ Python: $(python --version)"
echo "✓ Node.js: $(node --version)"
echo ""

# Setup Backend
echo "🔧 Setting up Backend..."
cd backend

if [ ! -d "venv" ]; then
    echo "  Creating virtual environment..."
    python -m venv venv
fi

echo "  Activating virtual environment..."
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi

echo "  Installing dependencies..."
pip install -r requirements.txt -q

echo "✓ Backend setup complete"
echo ""

# Setup Frontend
echo "🔧 Setting up Frontend..."
cd ../frontend

if [ ! -d "node_modules" ]; then
    echo "  Installing npm dependencies..."
    npm install -q
fi

echo "✓ Frontend setup complete"
echo ""

# Test Backend
echo "🧪 Testing Backend..."
cd ../backend

echo "  Starting Flask server (will run for 5 seconds)..."
timeout 5 python app.py &
sleep 3

if curl -s http://localhost:5000/api/health > /dev/null; then
    echo "✓ Backend health check passed"
else
    echo "⚠️  Backend health check failed"
fi

echo ""

# Build Frontend
echo "🔨 Building Frontend..."
cd ../frontend
npm run build > /dev/null 2>&1

if [ -d "build" ]; then
    echo "✓ Frontend production build successful"
    echo "  Build size: $(du -sh build | cut -f1)"
else
    echo "❌ Frontend build failed"
fi

echo ""
echo "======================================"
echo "✅ Local deployment test complete!"
echo ""
echo "Next steps:"
echo "1. Push code to GitHub"
echo "2. Create Render account at render.com"
echo "3. Follow DEPLOYMENT_GUIDE.md for cloud deployment"
echo ""
