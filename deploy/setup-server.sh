#!/bin/bash

# Exit on error
set -e

echo "Starting deployment setup..."

# 1. Update system packages
sudo apt update && sudo apt upgrade -y

# 2. Install Node.js (Version 20 as required by Medusa)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 3. Install PM2 globally
sudo npm install -g pm2

# 4. Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# 5. Install Nginx and Certbot
sudo apt install -y nginx certbot python3-certbot-nginx

# 6. Database Setup
# Prompt for DB password (in a real scenario, use secure vaults)
DB_USER="medusa_user"
DB_NAME="goamrit_db"
read -s -p "Enter password for PostgreSQL user $DB_USER: " DB_PASS
echo ""

sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';"
sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"

echo "Database $DB_NAME created successfully."

# Note: The actual deployment of the app requires cloning the repo,
# setting up .env, building the app, and starting with pm2.
# See deployment-guide.md for the complete steps.

echo "Server provisioning complete!"
