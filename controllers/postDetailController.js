var async = require("async");
const post = require("../models/post");

exports.post_get = function(req,res,next){
  async.parallel({
    post: function(callback){
      post.findById(req.params.postID)
      .exec(callback);
    }

  }, function(err,results){
    if(err){return next(err);}
    res.render('post_detail', {title: results.post.title, post: results.post});
  })
}