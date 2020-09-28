const async = require("async");

const Post = require('../models/post');
const Comment =  require('../models/comment');
const User = require('../models/user');
const PostUpvote = require("../models/votes/post_upvote");
const PostDownvote = require("../models/votes/post_downvote");
const CommentUpvote = require("../models/votes/comment_upvote");
const CommentDownvote = require("../models/votes/comment_downvote");

const getUserVotes = require('../public/javascripts/getUserVotes.js');

exports.profile_get = (req,res,next) =>{
  User.findOne({username: req.params.username})
  .exec(function(err,user){
    if(err){return next(err);}
    if(!user){
      var err = new Error('User not found');
      err.status = 404;
      return next(err);
    } 
    async.parallel({
      posts: function(callback){
        Post.find({submitter: user._id}).populate('subreddit').exec(callback);
      },
      comments: function(callback){
        Comment.find({submitter: user._id})
          .populate({
            path:'post',
              populate: {
                path:'subreddit'
              }
          })
        .exec(callback);
      },
      comment_upvotes: function(callback){
        if(res.locals.currentUser){
          CommentUpvote.find({submitter: res.locals.currentUser._id})
          .exec(callback);
        }
        else{callback(null,[])}
      },
      comment_downvotes: function(callback){
        if(res.locals.currentUser){
          CommentDownvote.find({submitter: res.locals.currentUser._id})
          .exec(callback);
        }
        else{callback(null,[])}
      },
      post_upvotes: function(callback){
        if(res.locals.currentUser){
          PostUpvote.find({submitter: res.locals.currentUser._id})
          .exec(callback);
        }
        else{callback(null,[])}
      },
      post_downvotes: function(callback){
        if(res.locals.currentUser){
          PostDownvote.find({submitter: res.locals.currentUser._id})
          .exec(callback);
        }
        else{callback(null,[])}
      }
    }, function(err,results){
      if(err){return next(err);}
      let posts = results.posts;
      let comments = results.comments;
      if(res.locals.currentUser){
        posts = getUserVotes(results.posts, results.post_upvotes, results.post_downvotes);
        comments = getUserVotes(results.comments, results.comment_upvotes, results.comment_downvotes);
      }
      let history = posts.concat(comments);
      history.sort(function(a,b){ 
        return b.date_created_at - a.date_created_at;
      });
      res.render('user_profile', {title: user.username,submission_history: history});
    })
  })
}