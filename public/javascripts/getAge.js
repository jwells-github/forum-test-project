var moment = require('moment'); 

module.exports= function (submissionDate){
  var submissionDate = moment(submissionDate);
  let dateDifference = moment().diff(moment(submissionDate), 'minutes');
  let dateString = ' minutes';
  if(dateDifference > 60){
    dateDifference = moment().diff(moment(submissionDate), 'hours');
    dateString = ' hours';
    if(dateDifference > 24){
      dateDifference = moment().diff(moment(submissionDate), 'days');
      dateString = ' days';
      if(dateDifference > 30){
        dateDifference = moment().diff(moment(submissionDate), 'months');
        dateString = ' months';
        if(dateDifference > 12){
          dateDifference = moment().diff(moment(submissionDate), 'years');
          dateString = ' years';
        }
      }
    }
  }
  dateString +=  ' ago'
  return String(dateDifference) + dateString
}