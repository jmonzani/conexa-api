# Usa la imagen oficial de Node.js como base
FROM node:20

# Establece el directorio de trabajo
WORKDIR /usr/src

# Copia el package.json y el package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código
COPY . .

# Expone el puerto que usará tu aplicación
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "run", "start:prod"]
