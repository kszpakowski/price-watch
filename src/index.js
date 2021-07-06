require("dotenv").config();
const schedule = require("node-schedule");
const axios = require("axios");
const puppeteer = require("puppeteer");

const { buildPriceUpdateMessage } = require("./slackMessages.js");
const { productsRepository } = require("./productsRepository.js");

//"0/4 * 9-23 * * *"
const job = schedule.scheduleJob("0/4 * * * * *", async function () {
  const browser = await puppeteer.launch();

  for (var product of productsRepository.getAllProducts()) {
    for (var page of product.pages) {
      const browserPage = await browser.newPage();
      await browserPage.goto(page.url);
      const price = await browserPage
        .$(`#${page.priceElemId}`)
        .then((element) => element.getProperty("innerText"))
        .then((handle) => handle.jsonValue());

      //TODO check if price has actually changed
      await axios.post(
        process.env.SLACK_WEBHOOK_URL,
        buildPriceUpdateMessage(product.name, price, page.url, product.photoUrl)
      );
    }
  }

  await browser.close();
});
