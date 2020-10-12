const Post = require('../models/post');
const SubForum = require('../models/subForum');
const Comment =  require('../models/comment');
const async = require("async");

// Remove a comment or reinstate a removed comment
exports.comment_remove_toggle = (req,res,next) =>{
  if(res.locals.currentUser){
    async.parallel({
      comment: function(callback){
        Comment.findById(req.params.commentID).exec(callback);
      },
      subForum: function(callback){
        let matchRegex = new RegExp("("+req.params.subForumName+")\\b","i")
        SubForum.findOne({name: {$regex: matchRegex}})
        .populate('moderators')
        .exec(callback);
      }
    }, function(err,results){
        if(err){return next(err);}
        if(!results.comment || !results.subForum){
          return res.sendStatus(404);
        }
        // Check if the user is a moderator
        let mod = results.subForum.moderators.find(moderator => String(moderator.user) === String(res.locals.currentUser._id));
        if(mod){
          if(mod.can_remove){
            results.comment.is_removed = !results.comment.is_removed;
            results.comment.save(function(err){
              if(err){return next(err);}
              return res.sendStatus(200);
            })
          }
          else{
            return res.sendStatus(403);
          }
        }
        else{
          return res.sendStatus(403);
        }
    });
  }
}

// Remove a post or reinstate a removed post
exports.post_remove_toggle = (req,res,next)=>{
  if(res.locals.currentUser){
    async.parallel({
      post: function(callback){
        Post.findById(req.params.postID).exec(callback);
      },
      subForum: function(callback){
        let matchRegex = new RegExp("("+req.params.subForumName+")\\b","i")
        SubForum.findOne({name: {$regex: matchRegex}})
        .populate('moderators')
        .exec(callback);
      }
    }, function(err,results){
        if(err){return next(err);}
        if(!results.post || !results.subForum){
          return res.sendStatus(404);
        }
        // Check if the user is a moderator
        let mod = results.subForum.moderators.find(moderator => String(moderator.user) === String(res.locals.currentUser._id));
        if(mod){
          if(mod.can_remove){
            results.post.is_removed = !results.post.is_removed;
            results.post.save(function(err){
              if(err){return next(err);}
              return res.sendStatus(200);
            })
          }
          else{
            return res.sendStatus(403);
          }
        }
        else{
          return res.sendStatus(403);
        }
    });
  }
}