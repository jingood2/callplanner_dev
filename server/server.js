var loopback = require('loopback');
var boot = require('loopback-boot');
//var morgan = require('morgan');
var Logger = require(__dirname + '/middleware/Logger');
//var logger = require('strong-logger');
//global.logger = require('strong-logger')
//var winston = require('winston');

global.log = new Logger(__dirname + "/logs/debug.log");
global.loge = new Logger(__dirname + "/logs/exception.log");

//global.appLogger = winston.loggers.get('application');
//global.httpLogger = winston.loggers.get('http');

var app = module.exports = loopback();

//app.middleware('initial',morgan('dev',[{'stream': logger.stream},{'buffer': true}]));
//app.use(require('morgan')("dev",{ "stream": logger.stream}));

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    log.info('Web server listening at: %s', app.get('url'));
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) {
    log.error(err);
    throw err;
  }

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
