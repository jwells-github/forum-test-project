const Post = require('../models/post');
const Comment =  require('../models/comment');

exports.comment_delete = (req,res,next) =>{
  if(res.locals.currentUser){
    Comment.findById(req.params.commentID)
    .exec(function(err,comment){
      if(err){return next(err);}
      if(!comment){
        return res.sendStatus(404);
      }
      if(res.locals.currentUser._id.equals(comment.submitter)){
        comment.is_deleted = true;
        comment.date_last_edited = Date.now();
        comment.save(function(err){
          if(err){return next(err);}
          return res.sendStatus(200);
        })
      }
    })
  }
}

exports.post_delete = (req,res,next) =>{
  if(res.locals.currentUser){ 
    Post.findById(req.params.postID)
    .exec(function(err,post){
      if(err){return next(err);}
      if(!post){
        return res.sendStatus(404);
      }
      if(res.locals.currentUser._id.equals(post.submitter)){
        post.is_deleted =  true;
        post.date_last_edited = Date.now();
        post.save(function(err){
          if(err){return next(err);}
          return res.sendStatus(200);
        });
      }
    })
  }
}