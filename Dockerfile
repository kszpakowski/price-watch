FROM node:12-slim
WORKDIR /usr/src/app
COPY package.json ./
RUN npm --verbose install
COPY src/ ./src
CMD ["node", "./src/index.js"]
