/**
 * Created by admin on 15. 3. 25..
 */
var Agenda = require('agenda');
var request = require('request');
var dateUtil = require('../utils/date');

var agenda = new Agenda({db: {address: 'localhost:27017/agenda-example'}});

exports.reqCall = function (jobName, plan) {

    // job.attr.data -> plan instance
    agenda.define(jobName, function (job, done) {

      var jsonObject = {};
      var testJsonObj = { "method" : "INIT",
                          "id": jobName,
                          "record": false,
                          "callType" : "planCall",
                          "greetingAnn" : "default.wav",
                          /*
                          "attendants" : [ { "tel" : "01044929599", "role": "owner" },
                            {"tel" : "01052777581", "role": "member"} ]
                           */

                          "attendants" : job.attrs.data.attendants
                          };

      console.log(JSON.stringify(testJsonObj));

      /*
       request('http://www.google.com', function (error, response, body) {
           if (!error && response.statusCode == 200) {
           console.log(body) // Show the HTML for the Google homepage.
           };
       });
       */

      request({
        url: "http://221.146.204.182:9087/FamilyCallCore/FamilyCallHttpServlet",
        method: "POST",
        json: true,
        body: testJsonObj
      }, function( error, response, body ) {

        if(!error && response.statusCode == 200) {
          console.log(body);
        };
      });
      done();

    });

    if(plan.repeat == 'none') {
      agenda.schedule(dateUtil.planStartAt(plan.repeat,plan.scheduledAt),jobName,plan);
    } else {
      agenda.every(dateUtil.planStartAt(plan.repeat,plan.scheduledAt),jobName,plan);
    }

    agenda.start();
};

exports.deleteCall = function(jobName) {

  agenda.cancel({name: jobName}, function(err, numRemoved) {
    if(!err) console.log('[planId:%s] number of removed : %d',jobName, numRemoved);
  })

};

