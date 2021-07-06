require("dotenv").config();
const schedule = require("node-schedule");
const axios = require("axios");

//TODO schedule notifications job to every 10 seconds from 9 to 21 and price scanning every 30 mins all 24/7
const job = schedule.scheduleJob("0/10 * 9-23 * * *", async function () {
  await axios.post(process.env.SLACK_WEBHOOK_URL, {
    text: `${new Date()} - The answer to life, the universe, and everything!`,
  });
});
