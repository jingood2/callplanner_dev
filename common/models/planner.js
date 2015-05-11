var request = require('request');
//var logger = require('strong-logger');

module.exports = function(Planner) {

  Planner.beforeRemote('create', function(ctx, user, next) {

    var req = ctx.req;
    var host = req.headers.host;

    request({
      url: 'http://' + host + '/api/mentContainers',
      method: "POST",
      json: true,
      body: { "name" : req.body.phone}
    }, function( error, response, body ) {
      if(error)
        logger.error(error);
    });

    request({
      url: 'http://' + host + '/api/imageContainers',
      method: "POST",
      json: true,
      body: { "name" : req.body.phone}
    }, function( error, response, body ) {
      if(error)
        logger.error(error);
    });
    next();

  });
};
