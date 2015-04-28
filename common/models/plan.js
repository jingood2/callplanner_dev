
/*
var Agenda = require('agenda');
var agenda = new Agenda( {db: { address: 'localhost:27017/agenda-example'}});
*/

var request = require('request');
var planCallJob = require('../../server/jobs/planCall');

module.exports = function(Plan) {


    Plan.beforeRemote('create', function(ctx, user, next) {

      var req = ctx.req;

      req.body.plannerId = req.accessToken.userId;
      next();

    });

    Plan.observe('before save', function(ctx, next){

      if(ctx.instance) {

        ctx.instance.modified = new Date();
        console.log('[Operation hook] before created at %s',  ctx.instance.modified  );
        //console.log(ctx);
      }else {
        ctx.data.modified = new Date();
        planJobName = String(ctx.where.id);

        console.log('[Operation hook]before update : %s', planJobName);
        //planCallJob.deleteCall(planJobName);
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
          console.log('[Operation hook] after created..');

          agendaJobId = String(ctx.instance.id);

          // define planCall job for planId
          planCallJob.reqCall(agendaJobId,ctx.instance);

          // ToDo : Push Notification
          var noti = [ ];

          ctx.instance.attendants.forEach(function(attendant){
            phones.push(attendant.tel);
          });

          console.log(phones);

          var Planner = app.models.Planner;

          Planner.find( {where: { phone: {inq: phones}}},function(err,planners) {
            /*
             if(err) {
             console.log(err);
             next();
             }
             */
            console.log(err);


            planners.forEach(function(planner) {
              noti.push(planner.id);
            });

            message = '[Title:' + ctx.instance.title  + ']' + 'You were invited from ....';

            var reqBody = {
              noti : noti,
              message : message };

            request({
                  url: 'http://' + config.notiHost + ':' + config.notiPort + '/notify/' + '1111',
                  method: "POST",
                  json: true,
                  body: reqBody
                  }, function( error, response, body ) {

                  if(!error && response.statusCode == 200)
                      console.log(body);
                  else
                      console.log(error);


            });

            /*
            planners.forEach(function(planner) {
              //;noti.push(planner.id);

              request({
                url: 'http://' + config.notiHost + ':' + config.notiPort + '/notify/' +  encodeURIComponent(planner.id),
                method: "POST",
                json: false
              }, function( error, response, body ) {

                if(!error && response.statusCode == 200)
                  console.log(body);
                else
                  console.log(error);


              });

            });
            */





          });

      } else {

        console.log('[Operation hook] after updated..');

        /*
        agendaJobId = String(ctx.data.id);

        console.log('[Remote hook]before delete : %s', agendaJobId);
        planCallJob.deleteCall(agendaJobId);

        console.log('[Remote hook]before update : %s', agendaJobId);
        planCallJob.reqCall(agendaJobId,ctx.data);
        */
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
