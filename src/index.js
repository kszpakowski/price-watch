require("dotenv").config();
const schedule = require("node-schedule");
const axios = require("axios");
const puppeteer = require("puppeteer");

const { buildPriceUpdateMessage } = require("./slackMessages.js");
const { productsRepository } = require("./productsRepository.js");

//"0/4 * 9-23 * * *"
const job = schedule.scheduleJob("*/30 * * * *", async function () {
  const browser = await puppeteer.launch();

  for (var product of productsRepository.getAllProducts()) {
    console.log(`Fetching ${product.name} price`);
    for (var page of product.pages) {
      const { lastPrice, url, priceElemId } = page;
      const browserPage = await browser.newPage();
      await browserPage.goto(url);
      const price = await browserPage
        .$(`#${priceElemId}`)
        .then((element) => element.getProperty("innerText"))
        .then((handle) => handle.jsonValue());

      if (!lastPrice || lastPrice !== price) {
        await axios.post(
          process.env.SLACK_WEBHOOK_URL,
          buildPriceUpdateMessage(product.name, price, url, product.photoUrl)
        );
      }

      page.lastPrice = price;
    }
  }

  await browser.close();
});
