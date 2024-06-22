FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --force

# Instalar dependências do Puppeteer
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    nodejs \
    yarn \
    udev \
    ttf-freefont

# Configurar Puppeteer para usar o Chromium instalado
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Adicionar um usuário não root
RUN addgroup -S pptruser && adduser -S -G pptruser pptruser

# Mudar para o novo usuário
USER pptruser

COPY . .

CMD [ "npm", "run", "start" ]