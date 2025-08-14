# Build stage
FROM node:18-alpine as build

# Ish directory yaratish
WORKDIR /app

# Package files ni copy qilish
COPY package*.json ./

# Dependencies o'rnatish
RUN npm ci

# Application kodlarini copy qilish
COPY . .

# Production build
RUN npm run build

# Production stage
FROM nginx:alpine

# Build files ni nginx ga copy qilish
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Port expose qilish
EXPOSE 80

# Nginx ishga tushirish
CMD ["nginx", "-g", "daemon off;"]