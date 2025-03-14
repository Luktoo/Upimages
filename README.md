# upimages - Modern Image Sharing Platform

<a href='https://postimg.cc/sGzRFrGC' target='_blank'><img src='https://i.postimg.cc/sGzRFrGC/Shared-Screenshot.jpg' border='0' alt='Shared-Screenshot'/></a>

A lightweight image sharing website with drag-and-drop uploads and shareable links.

## Features

- Drag-and-drop image uploads
- Responsive design
- Instant shareable URLs
- PNG/JPG/GIF support
- Mobile-friendly interface
- Secure UUID-based filenames

## License

This project is licensed under the **upimages Open Source License**:

- ✅ Free to use, modify, and distribute
- ✅ Allowed for personal and commercial hosting
- ❌ Selling the source code is prohibited
- ❌ Removing footer credits ("Developed by M. Alaa Emirah © 2025 upimages. All rights reserved.") is prohibited

## VPS Deployment Guide

### Prerequisites
- Ubuntu 20.04+ server
- Node.js 16.x+
- npm 8+
- Nginx
- PM2 (for process management)

### Installation

1. **Clone repository**
```bash
git clone https://your-repo-url.git /var/www/upimages
cd /var/www/upimages
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
npm install -g pm2
pm2 startup
```

4. **Create systemd service**
```bash
pm2 start server.js --name "upimages"
pm2 save
```

5. **Configure Nginx**
Create `/etc/nginx/sites-available/upimages.conf`:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

6. **Enable site & restart Nginx**
```bash
ln -s /etc/nginx/sites-available/upimages.conf /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

7. **Secure with Let's Encrypt**
```bash
sudo apt install certbot python3-certbot-nginx
certbot --nginx -d your-domain.com
```

## Configuration Options

Environment variables (set in `.env`):
```ini
PORT=3000
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5MB
```

## Usage
```bash
# Start production server
npm start

# Development mode with hot reload
npm run dev
```

> **Note:** For production environments, ensure:
> - Regular backups of the `uploads` directory
> - Configure firewall (UFW) rules
> - Set up monitoring for the PM2 process
