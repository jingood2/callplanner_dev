
var Agenda = require('agenda');
var agenda = new Agenda( {db: { address: 'localhost:27017/agenda-example'}});


module.exports = function(Plan) {

    var request = require('request');
    var accessToken;

    // agendaes
    agenda.define ('notification', function(job, done) {
        console.log('[Notification]');

        done();
    });

    agenda.define ('addPlanJob', function(job,done) {
        console.log('[addPlanJob at %s] plannId: %d, ment : %s, attendants\'phone: %s, scheduledAt: %s',
            Date.now(),
            job.attrs.data.id,job.attrs.data.ment.name, job.attrs.data.attendants.phone, job.attrs.data.scheduledAt);
        done();
    });

    agenda.define ('addAttendantNotiJob', function(job,done) {
        console.log('Push Notification to attendants at %s', Date.now());
        done();
    });

    Plan.beforeRemote('create', function(ctx, user, next) {

      var req = ctx.req;

      //req.body.scheduledAt = Date.now();
      req.body.plannerId = req.accessToken.userId;
      next();

    });

    Plan.observe('after save', function(ctx, next) {

      if(ctx.instance) {

        console.log('Saved %s#%s %s' , ctx.Model.modelName, ctx.instance.id, ctx.instance.scheduledAt);

        // Create job

        ctx.planId = ctx.instance.id;

        agenda.every("3 minutes" , 'addPlanJob', ctx.instance);
        console.log('PlanCall will be after 3 minutes');

        // ctx.instance is plan instance
        agenda.every('2 minutes', 'addAttendantNotiJob', ctx.instance);

        // ToDo : Push Notification
        //agenda.now('push');

        agenda.start();

      } else {
        console.log('Updated');
      }

      next();
    });

    Plan.observe('after delete', function(ctx, next) {

      console.log('Deleted %s matching %j', ctx.Model.app.name, ctx.where);


      agenda.jobs({name: 'addAttendantNotiJob'},function(err, jobs) {
        console.log('Job name: %s', jobs.name);
      });

      agenda.cancel({name: 'addAttendantNotiJob'},function(err,result) {
        console.log(result);
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
        console.log('> beforeDestroy triggered');
        next();
    });




};
