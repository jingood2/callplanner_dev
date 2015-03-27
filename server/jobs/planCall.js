/**
 * Created by admin on 15. 3. 25..
 */
var Agenda = require('agenda');
var request = require('request');

var agenda = new Agenda({db: {address: 'localhost:27017/agenda-example'}});

exports.reqCall = function (jobName, modelInstance) {

    // job.attr.data -> plan instance
    agenda.define(jobName, function (job, done) {

      var jsonObject = {};
      var testJsonObj = { "requestCmd" : "INIT",
                          "phoneNumber" : "01052777581",
                          "roomName" : "room1",
                          "attedant" : "",
                          "roomId" : "",
                          "recordOpt" : "true"
                          };

      console.log('[addPlanJob_%d] plannId: %d, ment : %s, attendants\'phone: %s, scheduledAt: %s',
        job.attrs.data.id,
        job.attrs.data.id, job.attrs.data.ment.name, job.attrs.data.attendants.phone, job.attrs.data.scheduledAt);

      /*
       request('http://www.google.com', function (error, response, body) {
           if (!error && response.statusCode == 200) {
           console.log(body) // Show the HTML for the Google homepage.
           };
       });
       */

      /*
      request({
        url: "192.168.100.144:9087/FamilyCallCore/FamilyCallHttpServlet",
        method: "POST",
        json: true,
        body: testJsonObj
      }, function( error, response, body ) {

        if(!error && response.statusCode == 200) {
          console.log(body);
        };
      });
      */
      done();

    });

    var job = agenda.create(jobName, modelInstance);
    job.repeatEvery('5 minutes');
    job.save(function (err) {
      if(err) console.log(err);
    });

    agenda.start();
};

exports.deleteCall = function(jobName) {

  agenda.cancel({name: jobName}, function(err, numRemoved) {
    if(!err) console.log('[planId:%s] number of removed : %d',jobName, numRemoved);
  })

};

