/**
 *
 * Created by admin on 15. 4. 1..
 */

exports.planStartAt = (function(repeat,scheduledAt) {

  var startDate = scheduledAt;
  var whichday;

  logger.info('scheduledAt : %s min:%s hour:%s day:%s', startDate, startDate.getMinutes(),startDate.getHours(),startDate.getDate());

  switch(repeat) {

    case 'none' :
      return scheduledAt;
    case 'daily' :
      format = startDate.getMinutes() + ' ' + startDate.getHours() + ' ' + '* * *';
      console.log(format);
      return format;

    case 'weekly' :
      format = startDate.getMinutes() + ' ' + startDate.getHours() + ' ' + '* * ' + startDate.getDay();
      console.log(format);
      return format;

    case 'monthly' :
      format = startDate.getMinutes() + ' ' + startDate.getHours() + ' ' + startDate.getDate() + ' ' +  '* *';
      console.log(format);
      return format;

    default :
      return scheduledAt;
  }


});
