#!/bin/bash
set -e

echo "🚀 Deploying PersonalisedGifts..."

# Pull latest code
git pull origin main

# Build and restart containers
docker compose build --no-cache app
docker compose up -d

# Wait for DB
echo "⏳ Waiting for database..."
sleep 10

# Run migrations
docker compose exec app npx prisma migrate deploy

# Optionally seed (first time only)
if [ "$1" = "--seed" ]; then
  echo "🌱 Seeding database..."
  docker compose exec app npx prisma db seed
fi

echo "✅ Deployment complete!"
echo "🌐 Site is live at https://yourdomain.com"
