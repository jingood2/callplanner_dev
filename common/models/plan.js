
/*
var Agenda = require('agenda');
var agenda = new Agenda( {db: { address: 'localhost:27017/agenda-example'}});
var request = require('request');
*/

var planCallJob = require('../../server/jobs/planCall');

module.exports = function(Plan) {

    var accessToken;

    // define Job

    /*
    defineCallRequestJob = function(name) {
      agenda.define (name, function(job,done) {

        // ToDo : request Conference to AS
        console.log('[addPlanJob_%d] plannId: %d, ment : %s, attendants\'phone: %s, scheduledAt: %s',
          job.attrs.data.id,
          job.attrs.data.id, job.attrs.data.ment.name, job.attrs.data.attendants.phone, job.attrs.data.scheduledAt);
      });
    };
    agenda.define ('addPlanJob', function(job,done) {
        console.log('[addPlanJob_%d] plannId: %d, ment : %s, attendants\'phone: %s, scheduledAt: %s',
            job.attrs.data.id,
            job.attrs.data.id,job.attrs.data.ment.name, job.attrs.data.attendants.phone, job.attrs.data.scheduledAt);


        request('http://www.google.com', function (error, response, body) {
          if (!error && response.statusCode == 200) {
          console.log(body) // Show the HTML for the Google homepage.
          };
        });

        done();
    });

    agenda.define ('addAttendantNotiJob', function(job,done) {
        console.log('[Pushjob_%d]Push Notification to attendants at %s',job.attrs.data.id, Date.now());
        done();
    });
    */

    Plan.beforeRemote('create', function(ctx, user, next) {

      var req = ctx.req;

      //req.body.scheduledAt = Date.now();
      req.body.plannerId = req.accessToken.userId;
      next();

    });

    Plan.observe('before save', function(ctx, next){

      if(ctx.instance) {

        ctx.instance.modified = new Date();
        console.log('[Operation hook] before created..');

        console.log(ctx);

      }else {
        ctx.data.modified = new Date();
        planJobName = String(ctx.where.id);

        console.log('[Operation hook]before update : %s', planJobName);
        planCallJob.deleteCall(planJobName);
      }
      next();

    });

    Plan.observe('after save', function(ctx, next) {

      var planJobName;
      var notiJobName;


      if(ctx.instance) {

        /* after save job list
         *
         * 1. planCall job
         * 2. (ToDo) push notification job
         */
        console.log('[Operation hook] after created..');

        planJobName = String(ctx.instance.id);

        // define planCall job for planId
        planCallJob.reqCall(planJobName,ctx.instance);

        // ToDo : Push Notification

      } else {

        console.log('[Operation hook] after updated..');

        /*
        planJobName = String(ctx.data.id);

        console.log('[Remote hook]before delete : %s', planJobName);
        planCallJob.deleteCall(planJobName);

        console.log('[Remote hook]before update : %s', planJobName);
        planCallJob.reqCall(planJobName,ctx.data);
        */
      }
      next();

    });

    Plan.observe('after delete', function(ctx, next) {

      planCallJob.deleteCall(String(ctx.where.id));
      next();
    });

    Plan.observe('before delete', function(ctx, next) {
      next();
    });




};
