# Node.js 18 alpine image
FROM node:18-alpine

# Ish directory yaratish
WORKDIR /app

# Package files ni copy qilish
COPY package*.json ./

# Dependencies o'rnatish
RUN npm ci --only=production

# Application kodlarini copy qilish
COPY . .

# Port expose qilish
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/ || exit 1

# Application ishga tushirish
CMD ["npm", "start"]