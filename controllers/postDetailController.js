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
  body('text').isLength({max:10000}),
  (req,res,next) =>{
    Post.findById(req.params.postID).exec(function(err,post){
      if(err){return next(err);}
      if(req.body.parentCommentID){
        var comment = new Comment({
          post: post._id,
          text:req.body.text,
          submitter:res.locals.currentUser,
          is_sub_comment: true,
        });
        comment.save(function(err){
          if(err){return next(err);}
          Comment.findById(req.body.parentCommentID).exec(function(err,parentComment){
            parentComment.sub_comments.push(comment)
            parentComment.save(function(err){
              if(err){return next(err);}
              return res.redirect(req.originalUrl);
            })

          })
        })
      }
      else{
        var comment = new Comment({
          post: post._id,
          text:req.body.text,
          submitter:res.locals.currentUser,
        });
        comment.save(function(err){
          if(err){return next(err);}
          return res.redirect(req.originalUrl);
        })
      }
    })
  }
  
]