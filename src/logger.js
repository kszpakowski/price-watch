const winston = require("winston");

const { timestamp, printf, combine, colorize } = winston.format;
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: combine(
        colorize({
          all: true,
        }),
        timestamp(),
        printf((info) => `${info.timestamp} ${info.level} : ${info.message}`)
      ),
    }),
  ],
});

module.exports.logger = logger;
