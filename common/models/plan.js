module.exports = function(Plan) {

	Plan.beforeRemote('create', function(context, user, next) {

		var req = context.req;

		req.body.scheduledAt = Date.now();
		req.body.plannerId = req.accessToken.userId;
		next();

	});	

};
