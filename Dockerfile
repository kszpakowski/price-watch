FROM node:13-slim
#RUN apt-get -qy update && apt-get -qy install openssl
RUN apt-get update \
  && apt-get install -y wget gnupg \
  && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
  && apt-get update \
  && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
  --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*
WORKDIR /usr/src/app
COPY package.json ./
RUN npm --verbose install
RUN groupadd -r pricewatch && useradd -r -g pricewatch -G audio,video pricewatch \
  && mkdir -p /home/pricewatch/Downloads \
  && chown -R pricewatch:pricewatch /home/pricewatch \
  && chown -R pricewatch:pricewatch ./node_modules
USER pricewatch
COPY schema.prisma ./
RUN npm run prisma
COPY src/ ./src
COPY migrations/ ./migrations
CMD ["npm", "run", "start"]
