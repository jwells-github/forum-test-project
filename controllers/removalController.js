const Post = require('../models/post');
const Subreddit = require('../models/subreddit');
const Comment =  require('../models/comment');
const async = require("async");

exports.comment_remove_toggle = (req,res,next) =>{
  if(res.locals.currentUser){
    async.parallel({
      comment: function(callback){
        Comment.findById(req.params.commentID).exec(callback);
      },
      subreddit: function(callback){
        Subreddit.findOne({name: req.params.subreddit})
        .populate('moderators')
        .exec(callback);
      }
    }, function(err,results){
        if(err){return next(err);}
        if(!results.comment || !results.subreddit){
          return res.sendStatus(404);
        }
        let mod = results.subreddit.moderators.find(moderator => String(moderator.user) === String(res.locals.currentUser._id));
        if(mod){
          if(mod.can_remove){
            results.comment.is_removed = !results.comment.is_removed;
            results.comment.save(function(err){
              if(err){return next(err);}
              return res.sendStatus(200);
            })
          }
          else{
            return res.sendStatus(404);
          }
        }
        else{
          return res.sendStatus(404);
        }
    });
  }
}

exports.post_remove_toggle = (req,res,next)=>{
  if(res.locals.currentUser){
    async.parallel({
      post: function(callback){
        Post.findById(req.params.postID).exec(callback);
      },
      subreddit: function(callback){
        Subreddit.findOne({name: req.params.subreddit})
        .populate('moderators')
        .exec(callback);
      }
    }, function(err,results){
        if(err){return next(err);}
        if(!results.post || !results.subreddit){
          return res.sendStatus(404);
        }
        let mod = results.subreddit.moderators.find(moderator => String(moderator.user) === String(res.locals.currentUser._id));
        if(mod){
          if(mod.can_remove){
            results.post.is_removed = !results.post.is_removed;
            results.post.save(function(err){
              if(err){return next(err);}
              return res.sendStatus(200);
            })
          }
          else{
            return res.sendStatus(404);
          }
        }
        else{
          return res.sendStatus(404);
        }
    });
  }
}