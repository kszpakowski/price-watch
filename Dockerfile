FROM alpine:edge

RUN apk add --no-cache \
  chromium \
  nss \
  freetype \
  harfbuzz \
  ca-certificates \
  ttf-freefont \
  nodejs \
  yarn \
  openssl

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
  PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /usr/src/app
COPY package.json ./
RUN yarn install
COPY schema.prisma ./
RUN yarn prisma
COPY src/ ./src
COPY migrations/ ./migrations
CMD ["yarn", "start"]
