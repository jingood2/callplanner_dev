/**
 * Created by kimjin-young on 2015. 5. 8..
 */
var winston = require('winston');
winston.emitErrs = true;

var logger = new winston.Logger({
  transports: [
    new winston.transports.DailyRotateFile({
      level: 'debug',
      filename: './logs/callPlanner.log',
      handleExceptions: true,
      json: true,
      colorize: true,
      datePattern: '.yyyy-MM-dd'
    }),
    new winston.transports.Console({
      level: 'info',
      handleExceptions: true,
      json: false,
      colorize: true
    })
  ],
  exitOnError: false
});

module.exports = logger;
module.exports.stream = {
  write: function(message, encoding){
    logger.info(message);
  }
}
