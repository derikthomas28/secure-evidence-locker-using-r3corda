# React Frontend Dockerfile
# Stage 1: Build the app
FROM node:18-slim AS build

WORKDIR /app

# Install dependencies (better layer caching)
COPY package*.json ./
RUN npm install --silent

# Copy source and build
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx for production-grade delivery
FROM nginx:alpine
# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy build assets
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
