# Etapa 1: construir la app (Vite genera ficheros estáticos en /app/dist)
FROM node:22-alpine AS build
WORKDIR /app

# Primero solo los ficheros de dependencias, para aprovechar la caché de Docker
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Etapa 2: servir los ficheros estáticos con nginx (la imagen final no lleva Node ni node_modules)
FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
# nginx arranca solo con el CMD por defecto de la imagen
