# GoAmrit Deployment Guide for Hostinger VPS

This guide explains how to deploy the Medusa v2 Backend, the built-in Blog CMS, and the Next.js Storefront on a Hostinger VPS running Ubuntu.

There are two recommended ways to deploy:
1. **Method A: Docker Compose (Easiest & Self-Contained)** — Runs Postgres, Redis, Medusa, Next.js, and Nginx inside containers.
2. **Method B: PM2 & Host Services (Manual)** — Runs the apps using PM2, with Postgres and Nginx installed directly on the Hostinger VPS OS.

---

## DNS Configuration (First Step)

Before starting, log in to your Hostinger account and configure your Domain's DNS settings. Add two **A records** pointing to your VPS IP address:

| Type | Host / Name | Points to | TTL |
| :--- | :--- | :--- | :--- |
| A | `@` (or `goamrit.com`) | `YOUR_VPS_IP` | Default (e.g. 14400) |
| A | `www` (or `www.goamrit.com`) | `YOUR_VPS_IP` | Default (e.g. 14400) |
| A | `api` (or `api.goamrit.com`) | `YOUR_VPS_IP` | Default (e.g. 14400) |

---

## Method A: Docker Compose Deployment (Recommended)

This method packages all database, backend, frontend, and proxy dependencies into isolated containers.

### 1. Install Docker & Docker Compose on the VPS
Connect to your VPS via SSH and run:
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Docker
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installations
docker --version
docker-compose --version
```

### 2. Generate Let's Encrypt SSL Certificates
The Nginx configuration expects SSL certificates. Let's obtain them using Certbot on the host:
```bash
sudo apt install -y certbot

# Stop Nginx if it's running on the host to free up port 80
sudo systemctl stop nginx || true

# Generate certificate for storefront
sudo certbot certonly --standalone -d goamrit.com -d www.goamrit.com --email contact@goamrit.com --agree-tos --no-eff-email

# Generate certificate for backend API
sudo certbot certonly --standalone -d api.goamrit.com --email contact@goamrit.com --agree-tos --no-eff-email
```

Verify that the certificates exist at:
* `/etc/letsencrypt/live/goamrit.com/fullchain.pem`
* `/etc/letsencrypt/live/api.goamrit.com/fullchain.pem`

### 3. Clone and Configure Environment Variables
Clone your project onto your Hostinger VPS (usually in `/var/www/goamrit`):
```bash
cd /var/www
git clone <your-repo-url> goamrit
cd goamrit
```

#### A. Configure Root Storefront Environment (`.env.local`)
Create a `.env.local` file at the root of `/var/www/goamrit`:
```env
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://api.goamrit.com
NEXT_PUBLIC_RAZORPAY_KEY=rzp_live_YourLiveRazorpayKeyHere
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_aaf0825eff0e69ee4eb05eb6470e5d6d67f33ac6f3a71370d74e9ec004df1f77
```

#### B. Configure Backend Environment (`backend/.env`)
Create a `.env` file under `/var/www/goamrit/backend`:
```env
MEDUSA_ADMIN_ONBOARDING_TYPE=none

# Database & Redis Settings
DATABASE_URL=postgresql://postgres:securepassword@db:5432/medusa_db
REDIS_URL=redis://redis:6379

# CORS Settings to secure communication
STORE_CORS=https://goamrit.com,https://www.goamrit.com
ADMIN_CORS=https://api.goamrit.com,https://goamrit.com
AUTH_CORS=https://goamrit.com,https://www.goamrit.com,https://api.goamrit.com

# Secrets (Change these to strong random keys!)
JWT_SECRET=somelongsecurejwtsecretstring
COOKIE_SECRET=somelongsecurecookiesecretstring

# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_live_YourKeyHere
RAZORPAY_KEY_SECRET=YourSecretHere
RAZORPAY_WEBHOOK_SECRET=YourWebhookSecretHere

# URL
BACKEND_URL=https://api.goamrit.com
VITE_STOREFRONT_URL=https://goamrit.com
```

### 4. Run the Stack
To ensure Postgres and Redis databases are running inside Docker, we can extend the root `docker-compose.yml` to include them, or connect to external databases.

To spin up the containers:
```bash
docker-compose up --build -d
```
This command builds the Next.js storefront container, build the Medusa backend container, and starts them behind the Nginx reverse proxy mapped to ports `80` and `443`.

---

## Method B: PM2 & Host Services Deployment

This method runs services directly on the host system without containers.

### 1. Install Node.js, PM2, Postgres & Nginx
On the Hostinger VPS, run the script provided in your repository:
```bash
cd /var/www/goamrit/deploy
chmod +x setup-server.sh
./setup-server.sh
```
This installs Node.js v20, PM2, Postgres, Nginx, and Certbot, and creates a PostgreSQL database called `goamrit_db` owned by `medusa_user`.

### 2. Configure Environment Variables
Use the same environment variable templates listed above:
* Place `.env.local` in the root `/var/www/goamrit/.env.local`.
* Place `.env` in the backend `/var/www/goamrit/backend/.env`.
Make sure `DATABASE_URL` is set to point to your local PostgreSQL installation:
`DATABASE_URL=postgresql://medusa_user:YOUR_CHOSEN_DB_PASSWORD@localhost:5432/goamrit_db`

### 3. Build and Start the Medusa Backend
```bash
cd /var/www/goamrit/backend
npm install
npm run build

# Run database migrations
npx medusa db:migrate

# Start backend using PM2
pm2 start npm --name "goamrit-backend" -- run start
```

### 4. Build and Start the Next.js Storefront
```bash
cd /var/www/goamrit
npm install
npm run build

# Start Next.js storefront using PM2
pm2 start npm --name "goamrit-storefront" -- start
```

### 5. Setup Nginx Configuration
Copy the Nginx configuration file to Nginx's configurations folder:
```bash
sudo cp /var/www/goamrit/deploy/nginx.conf /etc/nginx/sites-available/goamrit.conf
sudo ln -s /etc/nginx/sites-available/goamrit.conf /etc/nginx/sites-enabled/

# Remove default nginx welcome site
sudo rm /etc/nginx/sites-enabled/default || true

# Test configuration and restart Nginx
sudo nginx -t
sudo systemctl restart nginx
```

### 6. Enable SSL for PM2 Setup
Use Certbot to configure SSL for your domain names:
```bash
sudo certbot --nginx -d goamrit.com -d www.goamrit.com -d api.goamrit.com
```
Certbot will modify `/etc/nginx/sites-available/goamrit.conf` automatically to map the certificates and handle SSL handshakes.

### 7. Configure PM2 Startup
To make sure your apps restart automatically if the VPS reboots:
```bash
pm2 save
pm2 startup
```
Follow the instructions printed on the screen to enable automatic startup.

---

## Verifying Setup

Once deployed, verify everything works:
1. **Backend Status:** Navigate to `https://api.goamrit.com/health` in your browser. It should return a `200 OK` status.
2. **Admin Panel:** Go to `https://api.goamrit.com/app`. You should see the Medusa admin login. Here you can write blog posts, products, and see orders.
3. **Storefront:** Visit `https://goamrit.com`. It should load your storefront and fetch blogs from `https://api.goamrit.com/store/blog-posts`.
