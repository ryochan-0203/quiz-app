FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

RUN npm install -g firebase-tools

COPY . .

EXPOSE 3000

CMD ["npm", "start"]

RUN mkdir -p /app/node_modules && chmod 777 /app/node_modules
