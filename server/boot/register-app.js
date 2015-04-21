/**
 *
 * Created by admin on 15. 4. 20..
 */

var request = require('request');

module.exports = function(server) {
    // Install a `/` route that returns server status

    //var router = server.loopback.Router();
    //router.get('/', server.loopback.status());
    //server.use(router);

    var config = require('../config/config');

    var callPlannerApp = {

        id: 'AIzaSyD_yqOSMuUXWQFS57r5Q_7nTDxIcnyvtTI',
        userId: 'jingood2@gmail.com',
        name: config.appName,

        description: 'Realnetworks Call Planner Demo Application ',
        pushSettings: {
            apns: {
                certData: config.apnsCertData,
                keyData: config.apnsKeyData,
                pushOptions: {
                    // Extra options can go here for APN
                },
                feedbackOptions: {
                    batchFeedback: true,
                    interval: 300
                }
            },
            gcm: {
                serverApiKey: config.gcmServerApiKey
            }
        }
    };

    request({
        url: 'http://' + config.notiHost + ':' + config.notiPort + '/api/applications/' + callPlannerApp.id + '/exists',
        method: "GET",
        json: true
    }, function(error, response, body) {

        if(!error && response.statusCode == 200) {

            if(body.result) {
                console.log('Application is already registered. Update ' + callPlannerApp.name );

                request({
                    url: 'http://' + config.notiHost + ':' + config.notiPort + '/api/applications',
                    method: "PUT",
                    json: true,
                    body: callPlannerApp
                }, function( error, response, body ) {

                    if(!error && response.statusCode == 200)
                        console.log(body);
                    else
                        console.log(error);

                });
            } else {

                console.log('Registering a new Application :' + callPlannerApp.name );

                request({
                    url: 'http://' + config.notiHost + ':' + config.notiPort + '/api/applications',
                    method: "POST",
                    json: true,
                    body: callPlannerApp
                }, function( error, response, body ) {

                    if(!error && response.statusCode == 200) {
                        console.log('Registering a new Application :' + callPlannerApp.name);
                        console.log(body);
                    } else {
                        console.log(error);
                    }

                });

            }

        } else {
            console.log(error);

        }
    });

};






