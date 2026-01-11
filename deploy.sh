#!/bin/bash

# RAW-DATA Dashboard - Vercel Deployment Script

echo "🚀 Deploying RAW-DATA Dashboard to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if user is logged in
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please login to Vercel:"
    vercel login
fi

# Deploy to production
echo "📦 Building and deploying to production..."
npm run deploy

echo "✅ Deployment complete!"
echo "🌐 Your RAW-DATA Dashboard is now live on Vercel!"
echo ""
echo "📊 Check your deployment at: https://your-app.vercel.app"
echo "📈 Monitor at: https://vercel.com/dashboard"