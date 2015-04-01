/**
 *
 * Created by admin on 15. 4. 1..
 */

exports.planStartAt = (function(repeat,scheduledAt) {

  var startDate = scheduledAt;
  var whichday;

  console.log('Weekday : %s', whichday)

  switch(repeat) {

    case 'none' :
      return scheduledAt;
    case 'daily' :
      format =  'at ' + startDate.getHours() + ':' + startDate.getMinutes();
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
