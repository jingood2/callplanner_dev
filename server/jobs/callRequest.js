/**
 * Created by admin on 15. 3. 25..
 */
module.exports = function(agenda) {

  callRequestToAS = function (name, agenda) {
    agenda.define(name, function (job, done) {
      console.log('[addPlanJob_%d] plannId: %d, ment : %s, attendants\'phone: %s, scheduledAt: %s',
        job.attrs.data.id,
        job.attrs.data.id, job.attrs.data.ment.name, job.attrs.data.attendants.phone, job.attrs.data.scheduledAt);
    });
  };

};
