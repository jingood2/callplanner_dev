module.exports = function(CallHistory) {

    // listHistories
    CallHistory.listHistories = function(request, cb) {

        CallHistory.find({ where: { plannerId: request.accessToken.userId}},function(err,callHistories){
            if(err) {
               logger.error(err);
            }
            cb(err,callHistories);
        });

    };
    CallHistory.remoteMethod(
        'listHistories',
        {
            accepts: { arg: 'request', type: 'object', http:{source: 'req'}},
            http: {path: '/listHistories', verb: 'get'},
            returns : { arg: 'callHistories', type: 'array'}
        }
    );

};
