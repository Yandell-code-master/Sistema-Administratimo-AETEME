# Imagen de desarrollo con hot-reload
FROM node:20-alpine

WORKDIR /app

# Copiamos primero package.json para aprovechar la cache de Docker
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

# Ajustar el comando según el framework (Vite, Next, CRA, etc.)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
