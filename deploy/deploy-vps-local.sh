#!/bin/bash
# Exit on error
set -e

echo "============================================="
echo "Starting Local VPS Deployment on Ubuntu 24.04"
echo "============================================="

# 1. Update packages and install dependencies
echo "--- Step 1: Installing System Packages ---"
sudo apt-get update -y
sudo apt-get install -y nodejs npm postgresql postgresql-contrib git build-essential nginx certbot python3-certbot-nginx

# Install PM2 globally
sudo npm install -g pm2

# 2. Configure PostgreSQL database
echo "--- Step 2: Configuring PostgreSQL ---"
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'Kunj#477';"
# Create database if not exists
sudo -u postgres psql -c "SELECT 1 FROM pg_database WHERE datname = 'medusa_db'" | grep -q 1 || sudo -u postgres psql -c "CREATE DATABASE medusa_db OWNER postgres;"

# 3. Navigate to project directory
PROJECT_DIR="/var/www/goamrit"
cd $PROJECT_DIR

# 4. Create Backend .env
echo "--- Step 3: Setting up Backend Environment Variables ---"
cat << 'EOF' > backend/.env
MEDUSA_ADMIN_ONBOARDING_TYPE=none
STORE_CORS=https://goamrit.com,https://www.goamrit.com
ADMIN_CORS=https://api.goamrit.com,https://goamrit.com
AUTH_CORS=https://goamrit.com,https://www.goamrit.com,https://api.goamrit.com
JWT_SECRET=supersecret
COOKIE_SECRET=supersecret
DATABASE_URL=postgresql://postgres:Kunj%23477@localhost:5432/medusa_db
RAZORPAY_KEY_ID=rzp_test_YourKeyHere
RAZORPAY_KEY_SECRET=YourSecretHere
RAZORPAY_WEBHOOK_SECRET=YourWebhookSecretHere
BACKEND_URL=https://api.goamrit.com
VITE_STOREFRONT_URL=https://goamrit.com
EOF

# 5. Create Storefront .env.local
echo "--- Step 4: Setting up Storefront Environment Variables ---"
cat << 'EOF' > .env.local
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://api.goamrit.com
NEXT_PUBLIC_RAZORPAY_KEY=rzp_test_YourPublicRazorpayKeyHere
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_aaf0825eff0e69ee4eb05eb6470e5d6d67f33ac6f3a71370d74e9ec004df1f77
EOF

# 6. Build and start Medusa Backend
echo "--- Step 5: Building and Starting Medusa Backend ---"
cd $PROJECT_DIR/backend
npm install
npm run build
npx medusa db:migrate

# Start with PM2
pm2 delete goamrit-backend || true
pm2 start npm --name "goamrit-backend" -- run start

# 7. Build and start Next.js Storefront
echo "--- Step 6: Building and Starting Storefront ---"
cd $PROJECT_DIR
npm install
npm run build

# Start with PM2
pm2 delete goamrit-storefront || true
pm2 start npm --name "goamrit-storefront" -- start

# 8. Configure Nginx
echo "--- Step 7: Configuring Nginx ---"
sudo cp $PROJECT_DIR/deploy/nginx.conf /etc/nginx/sites-available/goamrit.conf
sudo ln -sf /etc/nginx/sites-available/goamrit.conf /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default || true
sudo nginx -t
sudo systemctl restart nginx

# 9. Configure PM2 for automatic system startup
echo "--- Step 8: Configuring PM2 Startup ---"
pm2 save
pm2 startup | tail -n 1 | bash

echo "============================================="
echo "VPS DEPLOYMENT COMPLETED SUCCESSFULLY!"
echo "Next step: Run 'sudo certbot --nginx -d goamrit.com -d www.goamrit.com -d api.goamrit.com' to enable SSL."
echo "============================================="
