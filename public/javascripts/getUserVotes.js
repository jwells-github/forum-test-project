module.exports= function (submissions, userUpvotes, userDownvotes){
  for (let i = 0; i < submissions.length; i++) {
    let submission = submissions[i];
    for (let j = 0; j < userUpvotes.length; j++) {
      let upvote = userUpvotes[j];
      if(String(upvote.content._id) === String(submission._id)){
        submission.user_vote = 1;
        break;
      }
    }
    if(!submission.user_vote){
      for (let j = 0; j < userDownvotes.length; j++) {
        let upvote = userDownvotes[j];
        if(String(upvote.content._id) === String(submission._id)){
          submission.user_vote = -1;
          break;
        }
      }
    }
  }
  return submissions;
}