/**
 * Created by admin on 15. 3. 25..
 */
var Agenda = require('agenda');
var request = require('request');
var dateUtil = require('../utils/date');

var app = require('../server');

var agenda = new Agenda({db: {address: 'localhost:27017/agenda-example'}});

exports.reqCall = function (jobName, plan) {

    // define job for planId
    agenda.define(jobName, function (job, done) {

        var reqBody = {};
        var ment = '';
        var reqCallResult ;

        // get a reference to models
        var CallHistory = app.models.callHistory;
        var planInfo = [];

        console.log(CallHistory.modelName);

        // planCall off
        if(job.attrs.data.enabled == false) {
            console.log('disabled planCall id : ' + job.attrs.data.id);
            done();
            return;
        }

        if(job.attrs.data.ment.file)
            ment = 'ments/' + job.attrs.data.ment.container + '/' + job.attrs.data.ment.file;

        reqBody = {
            "method" : "INIT",
            "id": jobName,
            "record": job.attrs.data.record,
            "callType" : job.attrs.data.callType,
            "greetingAnn" : ment,
            "attendants" : job.attrs.data.attendants };

        console.log(JSON.stringify(reqBody));

        request({
        url: "http://221.146.204.182:9087/FamilyCallCore/FamilyCallHttpServlet",
        method: "POST",
        json: true,
        body: reqBody
        }, function( error, response, body ) {

            if(!error && response.statusCode == 200) {

                var calledAt = new Date();

                CallHistory.create({
                    planId: job.attrs.data.id,
                    plannerId: job.attrs.data.plannerId,
                    planInfo : {
                        'title': job.attrs.data.title,
                        'enabled': job.attrs.data.enabled,
                        'callType': job.attrs.data.callType,
                        'record': job.attrs.data.record,
                        'ment': job.attrs.data.ment,
                        'scheduledAt': job.attrs.data.scheduledAt,
                        'repeat': job.attrs.data.repeat,
                        'attendants': job.attrs.data.attendants},
                    planCalledAt : calledAt,
                    result : response.statusCode},function(err,obj) {

                    if(error) {
                        console.log(err);
                    }
                });

            };
        });

        done();
    });

    // run job for planId
    if(plan.repeat == 'once') {
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

