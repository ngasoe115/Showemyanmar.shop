#!/usr/bin/env bash

# ====================================================================
# 🚀 1-CLICK LINUX SELF-HOSTING SETUP SCRIPT FOR SHOWEMYANMAR.SHOP
# Supported OS: Ubuntu 20.04 / 22.04 / 24.04, Debian 11 / 12
# ====================================================================

set -e

echo "===================================================="
echo "📦 Starting Showemyanmar.shop Linux Setup..."
echo "===================================================="

# Update system packages
sudo apt update && sudo apt upgrade -y

# Install prerequisite tools
sudo apt install -y curl git ufw nginx certbot python3-certbot-nginx

# Install Node.js LTS (v20)
if ! command -v node &> /dev/null; then
    echo "📥 Installing Node.js LTS..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
fi

# Install PM2 Process Manager globally
if ! command -v pm2 &> /dev/null; then
    echo "⚙️ Installing PM2 Process Manager..."
    sudo npm install -g pm2
fi

# Install Server Dependencies
echo "📦 Installing Express Backend Dependencies..."
cd "$(dirname "$0")"
npm install

# Start Express API with PM2
echo "🚀 Launching Backend API with PM2..."
pm2 start ecosystem.config.js
pm2 save
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp $HOME

# Configure Nginx
echo "🌐 Configuring Nginx Reverse Proxy..."
if [ -f "nginx.conf" ]; then
    sudo cp nginx.conf /etc/nginx/sites-available/showemyanmar
    sudo ln -sf /etc/nginx/sites-available/showemyanmar /etc/nginx/sites-enabled/
    sudo rm -f /etc/nginx/sites-enabled/default
    sudo nginx -t
    sudo systemctl restart nginx
fi

# Configure UFW Firewall
echo "🛡️ Configuring Linux Firewall (UFW)..."
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

echo "===================================================="
echo "🎉 Linux Self-Hosting Setup Completed Successfully!"
echo "📍 Express API running on: http://localhost:4000/api/health"
echo "===================================================="
