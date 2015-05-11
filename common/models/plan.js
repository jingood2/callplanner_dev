var request = require('request');
var planCallJob = require(__dirname + '/../../server/jobs/planCall');

module.exports = function(Plan) {


    Plan.beforeRemote('create', function(ctx, user, next) {

      var req = ctx.req;

      req.body.plannerId = req.accessToken.userId;
      next();

    });

    Plan.observe('before save', function(ctx, next){

      if(ctx.instance) {

        ctx.instance.modified = new Date();
        logger.debug('[Operation hook] before created at %s',  ctx.instance.modified  );
      }else {
        ctx.data.modified = new Date();
        planJobName = String(ctx.where.id);

        logger.debug('[Operation hook]before update : %s', planJobName);
      }
      next();

    });

    Plan.observe('after save', function(ctx, next) {

      var agendaJobId;
      var config = require('../../server/config/config');
      var app = require('../../server/server');
      var phones = [];
      var message;


      if(ctx.instance) {

         /* after save job list
          *
          * 1. planCall job
          * 2. (ToDo) push notification job
          */
          agendaJobId = String(ctx.instance.id);

          // define planCall job for planId
          planCallJob.reqCall(agendaJobId,ctx.instance);

          // ToDo : Push Notification
          var noti = [ ];

          ctx.instance.attendants.forEach(function(attendant){
            phones.push(attendant.tel);
          });

          var Planner = app.models.Planner;

          Planner.find( {where: { phone: {inq: phones}}},function(err,planners) {
             if(err) {
                logger.error(err);
                next();
             }


            planners.forEach(function(planner) {
              noti.push(planner.id);
            });

            var reqBody = {
              noti: noti,
              title: ctx.instance.title,
              attendant: ctx.instance.attendants,
              scheduledAt: ctx.instance.scheduledAt
            };

            request({
                  url: 'http://' + config.notiHost + ':' + config.notiPort + '/notify/' + '1111',
                  method: "POST",
                  json: true,
                  body: reqBody
                  }, function( error, response, body ) {

                  if(!error && response.statusCode == 200)
                      logger.info(body);
                  else
                      logger.error(error);

            });

          });

      } else {

        logger.debug('[Operation hook] after updated..');

      } // instance
      next();

    }); // observe

    Plan.observe('after delete', function(ctx, next) {

      planCallJob.deleteCall(String(ctx.where.id));
      next();
    });

    Plan.observe('before delete', function(ctx, next) {
      next();
    });




};
