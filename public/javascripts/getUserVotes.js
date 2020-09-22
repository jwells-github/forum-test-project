module.exports= function (submissions, userUpvotes, userDownvotes){
  for (let i = 0; i < submissions.length; i++) {
    let submissions = submissions[i];
    for (let j = 0; j < userUpvotes.length; j++) {
      let upvote = userUpvotes[j];
      if(String(upvote.post._id) === String(post._id)){
        submissions.user_vote = 1;
        break;
      }
    }
    if(!post.user_vote){
      for (let j = 0; j < userDownvotes.length; j++) {
        let upvote = userDownvotes[j];
        if(String(upvote.post._id) === String(post._id)){
          submissions.user_vote = -1;
          break;
        }
      }
    }
  }
  return submissions;
}