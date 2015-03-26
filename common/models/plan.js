
var Agenda = require('agenda');
var agenda = new Agenda( {db: { address: 'localhost:27017/agenda-example'}});
var request = require('request');


module.exports = function(Plan) {

    var accessToken;



    // define Job
    requestCallToAS = function(name) {
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


      /*
        request('http://www.google.com', function (error, response, body) {
          if (!error && response.statusCode == 200) {
          console.log(body) // Show the HTML for the Google homepage.
          };
        });
      */

        done();
    });

    agenda.define ('addAttendantNotiJob', function(job,done) {
        console.log('[Pushjob_%d]Push Notification to attendants at %s',job.attrs.data.id, Date.now());
        done();
    });

    Plan.beforeRemote('create', function(ctx, user, next) {

      var req = ctx.req;

      //req.body.scheduledAt = Date.now();
      req.body.plannerId = req.accessToken.userId;
      next();

    });

    Plan.observe('after save', function(ctx, next) {

      var planJobName;
      var notiJobName;

      if(ctx.instance) {

        // planId is unique id
        planJobName = String(ctx.instance.id);

        requestCallToAS(planJobName);
        var job = agenda.create(planJobName,ctx.instance );
        job.repeatEvery('1 minute');
        job.save();

        /*
        agenda.schedule("3 minutes" ,'addPlanJob', ctx.instance);
        console.log('PlanCall will be after 3 minutes');


        // ctx.instance is plan instance
        agenda.schedule('2 minutes', 'addAttendantNotiJob', ctx.instance);
        console.log('Push noti will be after 2 minutes');
        */

        // ToDo : Push Notification
        //agenda.now('push');

        agenda.start();

      } else {
        console.log('Updated');
      }

      next();
    });

    Plan.observe('after delete', function(ctx, next) {


      agenda.cancel({name: '1'},function(err,numRemoved) {
        console.log('numRemoved : ' + numRemoved);
      });

      // delete job schedule with ctx.where
      /*
      agenda.cancel({ data.id: ctx.where}}, function(err, numRemoved){
        console.log('removed count: %d', numRemoved);
      });
      */

      next();
    });

    Plan.observe('before delete', function(ctx, next) {
        next();
    });




};
