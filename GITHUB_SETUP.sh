#!/bin/bash

# GitHub Setup Script for AgroInvest Platform
# This script will help you create and push to a private GitHub repository

echo "═══════════════════════════════════════════════════════════"
echo "   AgroInvest Platform - GitHub Upload Setup"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Step 1: Create repository on GitHub
echo "STEP 1: Create Private Repository on GitHub"
echo "-----------------------------------------------------------"
echo "1. Go to: https://github.com/new"
echo "2. Repository name: agroinvest"
echo "3. Description: Complete agro-investment and livestock management platform"
echo "4. Select: ✅ Private"
echo "5. DO NOT initialize with README, .gitignore, or license"
echo "6. Click 'Create repository'"
echo ""
read -p "Press ENTER after you've created the repository on GitHub..."

# Step 2: Get repository URL
echo ""
echo "STEP 2: Get Your Repository URL"
echo "-----------------------------------------------------------"
echo "Copy the HTTPS or SSH URL from your new repository page"
echo "Example: https://github.com/your-username/agroinvest.git"
echo ""
read -p "Paste your repository URL here: " REPO_URL

# Step 3: Configure git user (if not already configured)
echo ""
echo "STEP 3: Git Configuration"
echo "-----------------------------------------------------------"
if ! git config user.name > /dev/null 2>&1; then
    read -p "Enter your GitHub name: " GIT_NAME
    git config --global user.name "$GIT_NAME"
fi

if ! git config user.email > /dev/null 2>&1; then
    read -p "Enter your GitHub email: " GIT_EMAIL
    git config --global user.email "$GIT_EMAIL"
fi

echo "✅ Git configured"
echo "   Name: $(git config user.name)"
echo "   Email: $(git config user.email)"

# Step 4: Add remote and push
echo ""
echo "STEP 4: Uploading to GitHub..."
echo "-----------------------------------------------------------"

# Add remote
git remote remove origin 2>/dev/null
git remote add origin "$REPO_URL"

# Rename branch to main if needed
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    git branch -M main
fi

# Push to GitHub
echo "Pushing code to GitHub..."
if git push -u origin main; then
    echo ""
    echo "═══════════════════════════════════════════════════════════"
    echo "   ✅ SUCCESS! Your code is now on GitHub!"
    echo "═══════════════════════════════════════════════════════════"
    echo ""
    echo "Repository: $REPO_URL"
    echo ""
    echo "Next steps:"
    echo "  1. Visit your repository on GitHub"
    echo "  2. Add a README badge if desired"
    echo "  3. Set up GitHub Actions (optional)"
    echo "  4. Invite collaborators (Settings → Collaborators)"
    echo ""
else
    echo ""
    echo "❌ Push failed. Common issues:"
    echo ""
    echo "If authentication failed:"
    echo "  1. For HTTPS: You need a Personal Access Token"
    echo "     Generate at: https://github.com/settings/tokens"
    echo "     Use token as password when prompted"
    echo ""
    echo "  2. For SSH: Set up SSH keys"
    echo "     Guide: https://docs.github.com/en/authentication/connecting-to-github-with-ssh"
    echo ""
    echo "Try running these commands manually:"
    echo "  git remote add origin $REPO_URL"
    echo "  git branch -M main"
    echo "  git push -u origin main"
    echo ""
fi
