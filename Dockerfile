 FROM node:alpine

WORKDIR User\Desktop\notificação

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]