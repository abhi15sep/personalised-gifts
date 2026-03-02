#!/bin/bash
set -e

DOMAIN=$1

if [ -z "$DOMAIN" ]; then
  echo "Usage: ./scripts/setup-ssl.sh yourdomain.com"
  exit 1
fi

echo "🔒 Setting up SSL for $DOMAIN..."

# Update nginx config with actual domain
sed -i "s/yourdomain.com/$DOMAIN/g" nginx/nginx.conf

# Start nginx without SSL first for certbot challenge
docker compose up -d nginx

# Get SSL certificate
docker compose run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  -d $DOMAIN \
  -d www.$DOMAIN \
  --email admin@$DOMAIN \
  --agree-tos \
  --no-eff-email

# Restart nginx with SSL
docker compose restart nginx

echo "✅ SSL configured for $DOMAIN"
