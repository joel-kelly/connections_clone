
# Deployment Guide

Deploy your Connections game to your Ubuntu home server.

## Deployment Options

1. **Docker** (Recommended) - Easier, isolated
2. **Bare Metal** - Direct on Ubuntu server

---

## Option 1: Docker Deployment (Recommended)

### Prerequisites
- Docker and Docker Compose installed
- Port 80 available (or choose another port)

### 1. Build and Start

```bash
# From project root
docker-compose up -d
```

This will:
- Build the frontend
- Start the backend server
- Serve everything on port 80

### 2. Environment Configuration

Before deploying, set up your environment:

```bash
# Create backend/.env with your configuration
cat > backend/.env << EOF
PORT=3001
GOOGLE_SHEET_ID=your_sheet_id_here
SUBMIT_PASSWORD=your_password_here
EOF
```

**Environment Variables:**
- `PORT` - Backend server port (default: 3001)
- `GOOGLE_SHEET_ID` - Your Google Sheets puzzle database ID
- `SUBMIT_PASSWORD` - Password for puzzle submission page (protect this!)

Don't forget to add `backend/credentials.json` (see Google Sheets Setup guide).

### 3. Access Your Game

- **Local network**: http://YOUR_SERVER_IP
- **From anywhere**: Set up port forwarding or use a VPN

### 4. Update the App

When you make changes:

```bash
# Rebuild and restart
docker-compose down
docker-compose up -d --build
```

### 5. View Logs

```bash
# All services
docker-compose logs -f

# Just backend
docker-compose logs -f backend
```

### 6. Stop the App

```bash
docker-compose down
```

---

## Option 2: Bare Metal Deployment

### Prerequisites
- Node.js 18+ installed
- Nginx installed (optional, for production serving)
- PM2 installed globally: `npm install -g pm2`

### 1. Build Frontend

```bash
cd frontend
npm install
npm run build
```

This creates a `frontend/dist` folder with static files.

### 2. Set Up Backend

```bash
cd backend
npm install

# Copy credentials
cp /path/to/credentials.json .

# Set up environment
cat > .env << EOF
PORT=3001
GOOGLE_SHEET_ID=your_sheet_id_here
SUBMIT_PASSWORD=your_password_here
EOF
```

Make sure to replace:
- `your_sheet_id_here` with your actual Google Sheets ID
- `your_password_here` with a secure password for puzzle submissions

### 3. Start Backend with PM2

```bash
cd backend
pm2 start server.js --name connections-backend
pm2 save
pm2 startup  # Follow the instructions this gives you
```

### 4. Serve Frontend with Nginx

#### Install Nginx

```bash
sudo apt update
sudo apt install nginx
```

#### Configure Nginx

Create `/etc/nginx/sites-available/connections`:

```nginx
server {
    listen 80;
    server_name your_server_ip;  # or your domain

    # Frontend
    location / {
        root /home/user/connections_clone/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Enable Site

```bash
sudo ln -s /etc/nginx/sites-available/connections /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 5. Access Your Game

Visit http://YOUR_SERVER_IP

### 6. Update the App

```bash
# Update frontend
cd frontend
git pull  # if using git
npm install
npm run build

# Update backend
cd ../backend
pm2 restart connections-backend
```

---

## Make It Accessible to Your Family

### Option A: Local Network Only (Easiest)

Your family can access it on your home WiFi:
```
http://YOUR_SERVER_IP
```

Have them bookmark it on their phones!

**Puzzle Submissions:** Share the `SUBMIT_PASSWORD` with family members so they can submit their own puzzles at `/submit`.

### Option B: Custom Domain (Recommended)

1. Buy a domain (e.g., connections.family.com)
2. Point it to your home IP
3. Set up port forwarding on your router (port 80)
4. Update Nginx config with your domain

### Option C: Tailscale/VPN (Most Secure)

1. Install [Tailscale](https://tailscale.com) on your server and family devices
2. Access via Tailscale IP from anywhere
3. No port forwarding needed!

---

## Security Considerations

### If Exposing to Internet:

1. **Use HTTPS** with Let's Encrypt:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

2. **Firewall**:
```bash
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

3. **Keep Updated**:
```bash
sudo apt update && sudo apt upgrade
```

### If Local Network Only:

- Less security concerns
- Still protect `credentials.json`
- Regular backups of your Google Sheet

---

## Monitoring

### Check Backend Status (PM2)

```bash
pm2 status
pm2 logs connections-backend
```

### Check Nginx Status

```bash
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log
```

### Check Docker Status

```bash
docker-compose ps
docker-compose logs -f
```

---

## Backup

### What to Backup

1. Your Google Sheet (auto-saved by Google)
2. `backend/credentials.json` - Google API credentials
3. `backend/.env` - Contains your Sheet ID and submission password

### Backup Commands

```bash
# Create backup directory
mkdir -p ~/backups/connections

# Backup config files
cp backend/credentials.json ~/backups/connections/
cp backend/.env ~/backups/connections/
```

---

## Troubleshooting

### Can't access from other devices
- Check firewall: `sudo ufw status`
- Verify server IP: `hostname -I`
- Test locally first: `curl http://localhost`

### Backend not starting
- Check logs: `pm2 logs connections-backend`
- Verify port 3001 isn't in use: `lsof -i :3001`
- Check credentials.json exists

### Frontend shows "Failed to fetch puzzles"
- Backend might not be running
- Check browser console for errors
- Verify API requests go to correct backend URL

### Docker build fails
- Check Docker has enough disk space
- Try: `docker system prune` to clean up
- Check logs: `docker-compose logs`
