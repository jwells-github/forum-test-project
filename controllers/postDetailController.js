const async = require("async");
const { body,validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');
const Post = require("../models/post");
const Comment = require("../models/comment");
const PostUpvote = require("../models/votes/post_upvote");
const PostDownvote = require("../models/votes/post_downvote");
const CommentUpvote = require("../models/votes/comment_upvote");
const CommentDownvote = require("../models/votes/comment_downvote");
const getUserVotes = require('../public/javascripts/getUserVotes.js');

exports.post_get = function(req,res,next){
  Post.findById(req.params.postID)
  .populate({
    path:'subreddit',
    populate: {
      path: 'moderators'
    }
  })
  .exec(function(err,post){
    if(err){return next(err);}
    if(!post){
      var err = new Error('Post not found');
      err.status = 404;
      return next(err);
    }
    async.parallel({
      comments:function(callback){
        Comment.find({post: post._id})
        .populate('sub_comments')
        .populate('submitter')
        .exec(callback);
      },
      post_liked: function(callback){
        if(res.locals.currentUser){
          PostUpvote.find({post: post._id, submitter: res.locals.currentUser._id})
          .exec(callback);
        }
        else{ callback(null,false)}
      },
      post_disliked: function(callback){
        if(res.locals.currentUser){
          PostDownvote.find({post: post._id, submitter: res.locals.currentUser._id})
          .exec(callback);
        }
        else{ callback(null,false)}
      },
      comment_upvotes: function(callback){
        if(res.locals.currentUser){
          CommentUpvote.find({submitter: res.locals.currentUser._id})
          .exec(callback);
        }
        else{ callback(null,[])}
      },
      comment_downvotes: function(callback){
        if(res.locals.currentUser){
          CommentDownvote.find({submitter: res.locals.currentUser._id})
          .exec(callback);
        }
        else{ callback(null,[])}
      }
    }, function(err, results){
      if(err){return next(err);}
      let comments= results.comments;
      if(res.locals.currentUser){
        comments = getUserVotes(results.comments, results.comment_upvotes, results.comment_downvotes);
      }
      res.render('post_detail', {title: post.title, post: post, comments:comments});
    })
  })
}

exports.post_comment_post = [
  sanitizeBody('*').trim(),
  body('text').isLength({max:10000}).isLength({min:1}),
  (req,res,next) =>{
    if(res.locals.currentUser){
      Post.findById(req.params.postID).exec(function(err,post){
        if(err){return next(err);}
        var comment = new Comment({
          post: post._id,
          text:req.body.text,
          submitter:res.locals.currentUser,
        });
        if(req.body.parentCommentID){
          comment.is_sub_comment = true;
          comment.save(function(err){
            if(err){return next(err);}
            Comment.findById(req.body.parentCommentID).exec(function(err,parentComment){
              if(err){return next(err);}
              parentComment.sub_comments.push(comment)
              parentComment.save(function(err){
                if(err){return next(err);}
                  incrementPostComments(post._id)
                  return res.redirect(req.originalUrl);
              })
            })
          })
        }
        else{
          comment.save(function(err){
            if(err){return next(err);}
            incrementPostComments(post._id)
            return res.redirect(req.originalUrl);
          })
        }
      })
    }
  }
]

function incrementPostComments(postID){
  Post.update(
    {_id: postID},
    {$inc: {number_of_comments: 1}}
    ,function(err){
      if(err){return next(err);}
      return;
    })
}