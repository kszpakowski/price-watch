require("dotenv").config();
const schedule = require("node-schedule");
const axios = require("axios");
const puppeteer = require("puppeteer");

const { buildPriceUpdateMessage } = require("./slackMessages.js");
const { productsRepository } = require("./productsRepository.js");
const { logger } = require("./logger.js");

const { SLACK_WEBHOOK_URL } = process.env;

//"0/4 * 9-23 * * *"
const job = schedule.scheduleJob("*/30 9-23 * * *", async function () {
  const browser = await puppeteer.launch();

  for (var product of productsRepository.getAllProducts()) {
    logger.info(`Fetching ${product.name} price`);
    for (var page of product.pages) {
      const { lastPrice, url, priceElemSelector } = page;
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

      page.lastPrice = price;
    }
  }

  await browser.close();
});

logger.info("PriceWatch started");
