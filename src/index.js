require("dotenv").config();
const schedule = require("node-schedule");
const axios = require("axios");
const puppeteer = require("puppeteer");

const { buildPriceUpdateMessage } = require("./slackMessages.js");
const { productsRepository } = require("./productsRepository.js");
const { logger } = require("./logger.js");

const { SLACK_WEBHOOK_URL, UPDATE_CRON } = process.env;

//"0/4 * 9-23 * * *"
const job = schedule.scheduleJob(UPDATE_CRON, async () => {
  const products = await productsRepository.getAllProducts();
  console.log(`Fetching price updates for ${products.length} products`);

  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  for (var product of products) {
    logger.info(`Fetching ${JSON.stringify(product, null, 2)} price`);
    for (var page of product.pages) {
      const { id, lastPrice, url, priceElemSelector } = page;
      const browserPage = await browser.newPage();
      await browserPage.goto(url);
      const price = await browserPage
        .$(priceElemSelector)
        .then((element) => element.getProperty("innerText"))
        .then((handle) => handle.jsonValue());

      if (!lastPrice || lastPrice !== price) {
        await axios.post(
          SLACK_WEBHOOK_URL,
          buildPriceUpdateMessage(product.name, price, url, product.photoUrl)
        );
      }

      productsRepository.updatePrice(id, price);
    }
  }

  await browser.close();
});

logger.info("PriceWatch started");
