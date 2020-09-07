var async = require("async");
const { body,validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');
const Post = require("../models/post");
const Comment = require("../models/comment");


exports.post_get = function(req,res,next){
  async.waterfall([
    function getPost (callback){
      Post.findById(req.params.postID).exec(function(err,post){
        if(err){return next(err);}
        if(!post){
          var err = new Error('Post not found');
          err.status = 404;
          return next(err);
        }
        callback(null,post);
      });
    },
    function getComments(post, callback){
      Comment.find({post: post._id})
      .populate('sub_comments')
      .populate('submitter')
      .exec(function(err,comments){
        if(err){return next(err);}
        callback(null, post, comments);
      });
    }
  ], function(err, post, comments){
    if(err){return next(err);}
  
    res.render('post_detail', {title: post.title, post: post, comments:comments});
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