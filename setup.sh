#!/bin/bash
echo "🕌 Setting up Islamic Quiz Platform..."

# Create project directory
mkdir -p islamic-quiz-platform
cd islamic-quiz-platform

# Initialize npm
npm init -y

# Install dependencies
echo "📦 Installing dependencies..."
npm install react react-dom lucide-react
npm install -D @vitejs/plugin-react vite eslint eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh

# Create directory structure
echo "📁 Creating directory structure..."
mkdir -p src/components/screens
mkdir -p src/components/common  
mkdir -p src/components/admin
mkdir -p src/context
mkdir -p src/utils
mkdir -p src/data
mkdir -p src/styles
mkdir -p public

echo "✅ Setup complete! Now copy the component files to their respective directories."
echo "📖 See README.md for detailed setup instructions."
echo "🚀 Run 'npm run dev' to start the development server." 