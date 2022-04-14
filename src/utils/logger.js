const winston = require('winston');

const logConfiguration = {
  format: winston.format.combine(
    winston.format.label({
      label: `🏷️`,
    }),
    winston.format.timestamp({
      format: 'DD-MMM-YYYY HH:mm:ss',
    }),
    winston.format.printf(
      info =>
        `${info.level}: ${info.label}: ${[info.timestamp]}: ${info.message}`
    )
  ),
  transports: [new winston.transports.Console()],
};

exports.default = winston.createLogger(logConfiguration);
