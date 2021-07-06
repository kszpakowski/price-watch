//https://app.slack.com/block-kit-builder
const buildPriceUpdateMessage = (name, price, url, imageUrl) => ({
  blocks: [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: `Aktulizacja ceny: ${name}`,
        emoji: true,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `Aktualna cena to: *${price}*`,
      },
      accessory: {
        type: "image",
        image_url: imageUrl,
        alt_text: "alt text for image",
      },
    },
    {
      type: "actions",
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "Sprwadź",
            emoji: true,
          },
          url: url,
        },
      ],
    },
    {
      type: "divider",
    },
  ],
});

module.exports.buildPriceUpdateMessage = buildPriceUpdateMessage;
