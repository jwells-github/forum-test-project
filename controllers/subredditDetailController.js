const Subreddit = require('../models/subreddit');

exports.subreddit_get = function(req,res,next){
  Subreddit.findOne({name: req.params.subredditName})
  .exec(function(err,subreddit){
    if(err){return next(err);}
    if(!subreddit){
      var err = new Error('Subreddit not found');
      err.status = 404;
      return next(err);
    }
    else{
      res.render('subreddit_detail', {title: subreddit.title, subreddit:subreddit})
    }
  });
}