var request = require('request');

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
        console.log(error);
    });

    request({
      url: 'http://' + host + '/api/imageContainers',
      method: "POST",
      json: true,
      body: { "name" : req.body.phone}
    }, function( error, response, body ) {
      if(error)
        console.log(error);
    });
    next();

  });
};
