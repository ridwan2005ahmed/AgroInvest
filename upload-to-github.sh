#!/bin/bash

# AgroInvest Platform - Quick GitHub Upload Guide

echo "═══════════════════════════════════════════════════════════════"
echo "   🍃 AgroInvest Platform - GitHub Upload Instructions"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Configure Git user
echo "📝 Step 1: Configure Git"
echo "-----------------------------------------------------------"
read -p "Enter your name: " GIT_NAME
read -p "Enter your email: " GIT_EMAIL

git config --global user.name "$GIT_NAME"
git config --global user.email "$GIT_EMAIL"

echo "✅ Git configured"
echo ""

# Commit the code
echo "💾 Step 2: Creating commit..."
echo "-----------------------------------------------------------"
git commit -m "Initial commit: AgroInvest Platform

Complete agro-investment and livestock management system with:
- Full-stack platform (Node.js + Express + PostgreSQL)
- Next.js 14 + TypeScript + Tailwind CSS
- Role-based access control (Admin, Manager, Investor)
- Investment management (6/12 month cycles)
- Livestock tracking and market prices
- Internal resale marketplace
- Sale recommendation algorithm
- Complete authentication and audit system"

echo "✅ Commit created"
echo ""

# Instructions for GitHub
echo "🌐 Step 3: Create GitHub Repository"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "1. Open your browser and go to:"
echo "   👉 https://github.com/new"
echo ""
echo "2. Fill in the form:"
echo "   Repository name: agroinvest"
echo "   Description: Complete agro-investment and livestock management platform"
echo "   ✅ Select: Private"
echo "   ❌ DO NOT check: Add README, .gitignore, or license"
echo ""
echo "3. Click 'Create repository'"
echo ""
read -p "Press ENTER after creating the repository..."

# Get repository URL
echo ""
echo "📋 Step 4: Get Repository URL"
echo "-----------------------------------------------------------"
echo ""
echo "After creating, GitHub will show you a URL like:"
echo "  https://github.com/your-username/agroinvest.git"
echo ""
read -p "Paste your repository URL here: " REPO_URL

# Add remote and push
echo ""
echo "📤 Step 5: Uploading to GitHub..."
echo "═══════════════════════════════════════════════════════════════"

git remote add origin "$REPO_URL"
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "═══════════════════════════════════════════════════════════════"
    echo "   ✅ SUCCESS! Code uploaded to GitHub!"
    echo "═══════════════════════════════════════════════════════════════"
    echo ""
    echo "🔗 Repository: $REPO_URL"
    echo ""
    echo "Next steps:"
    echo "  • Visit your repository on GitHub"
    echo "  • Verify all files are uploaded"
    echo "  • Add collaborators (Settings → Collaborators)"
    echo ""
else
    echo ""
    echo "⚠️  Authentication required!"
    echo "═══════════════════════════════════════════════════════════════"
    echo ""
    echo "If you see 'Username for https://github.com':"
    echo "  1. Enter your GitHub username"
    echo "  2. For password, use a Personal Access Token (not your password!)"
    echo ""
    echo "To create a token:"
    echo "  1. Go to: https://github.com/settings/tokens"
    echo "  2. Click 'Generate new token' → 'Generate new token (classic)'"
    echo "  3. Give it a name: 'AgroInvest Upload'"
    echo "  4. Select scopes: ✅ repo (all options)"
    echo "  5. Click 'Generate token'"
    echo "  6. Copy the token and use it as password"
    echo ""
    echo "Then run:"
    echo "  git push -u origin main"
    echo ""
fi
