const Post = require('../models/post');
const Comment =  require('../models/comment');
const CommentUpvote =  require('../models/votes/comment_upvote');
const CommentDownvote =  require('../models/votes/comment_downvote');
var async = require("async");


exports.comment_vote = (req,res,next) => {
  let vote_direction = parseInt(req.params.direction);
  let vote_change = false; // User is changing their vote to the opposite direcion
  let vote_withdrawal = false; // User is withdrawing their vote, not changing it
  if(res.locals.currentUser){
    // In which 0 is a downvote and 1 is an upvote
    if(vote_direction === 0 || vote_direction === 1 ){
      async.parallel({
        comment: function(callback){
          Comment.findById(req.params.commentID).exec(callback);
        },
        existing_upvote: function(callback){
          CommentUpvote.findOne({comment: req.params.commentID, submitter:res.locals.currentUser._id}).exec(callback);
        },
        existing_downvote: function(callback){
          CommentDownvote.findOne({comment: req.params.commentID, submitter:res.locals.currentUser._id}).exec(callback);
        }
      }, function(err,results){
        if(err){return next(err);}
        
        if(results.existing_upvote){
          (vote_direction === 1 ? vote_withdrawal = true : vote_change = true);
          console.log('withdraw: ' + vote_withdrawal);
          console.log('change: ' + vote_change);
          CommentUpvote.findByIdAndDelete(results.existing_upvote._id).exec(function(err,vote){
            if(err){return next(err);}
          });
        }
        else if(results.existing_downvote){
          console.log('downvote');
          (vote_direction === 0 ? vote_withdrawal = true : vote_change = true);
          console.log('withdraw: ' + vote_withdrawal);
          console.log('change: ' + vote_change);
          CommentDownvote.findByIdAndDelete(results.existing_downvote._id).exec(function(err,vote){
            if(err){return next(err);}
          });
        }

        if(vote_withdrawal){
          changeCommentVoteCount(req.params.commentID, vote_direction, vote_change, vote_withdrawal);
          return res.sendStatus(200);
        }
        else{
          let comment_vote;
          if(vote_direction === 0){
            comment_vote = new CommentDownvote();
          }
          else{
            comment_vote = new CommentUpvote();
          }
          comment_vote.comment = req.params.commentID;
          comment_vote.submitter = res.locals.currentUser._id;
          comment_vote.save(function(err){
            if(err){return next(err);}
            changeCommentVoteCount(req.params.commentID, vote_direction, vote_change, vote_withdrawal);
            return res.sendStatus(200);
          })
        }
      })
    }
    else{
      return res.sendStatus(404);
     }
  }
  else{
   return res.sendStatus(404);
  }
  
}

function changeCommentVoteCount(comment_id, vote_direction, vote_change, vote_withdrawal){
  let downvote_value;
  let upvote_value;

  if(vote_withdrawal){
    downvote_value = (vote_direction === 0 ? -1 : 0);
    upvote_value = (vote_direction === 1 ? -1: 0)
  }
  else if(vote_change){
     downvote_value = (vote_direction === 0 ? 1 : -1);
     upvote_value = (vote_direction === 1 ? 1 : -1);
  }
  else{
    downvote_value = (vote_direction === 0 ? 1 : 0);
    upvote_value = (vote_direction === 1 ? 1 : 0)
  }

  Comment.updateOne(
    {_id: comment_id},
    {$inc: {downvote_count: downvote_value, upvote_count: upvote_value}},
    function(err){
      if(err){return next(err);}
    }
  )
}

exports.post_vote = (req,res,next) =>{

}