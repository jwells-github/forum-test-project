const Subreddit = require('../models/subreddit');
const { body,validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');

exports.subreddit_create_get = function(req,res,next){
  if(res.locals.currentUser){
    res.render('subreddit_create_form', {title: 'Create a Subreddit'});
  }
  else{
    res.redirect('/');
  }
}

exports.subreddit_create_post = [
  sanitizeBody('*').trim(),
  body('name', 'Names must be longer than 2 characters and may only contain Numbers and English characters')
    .isLength({min:2})
    .custom(value =>{
      return Subreddit.findOne({'name':value}).then(subreddit =>{
        if(subreddit){
          return Promise.reject('A Subreddit with this name already exists')
        }
      }); 
    })
    .custom(value =>{
      if( ! /^[a-zA-Z0-9]*$/gm.test(value)){
        throw new Error('Names must be longer than 2 characters and may only contain Numbers and English characters')
      }
      return true
    }),
  body('title', 'titles must be less than 50 characters').isLength({max:50}),
  body('description', 'descriptions must be less than 50 characters').isLength({max:500}),
  body('sidebar','sidebar must be less than 10240 characters').isLength({max:10240}),
  body('submission_text', 'submission text must be less than 1024 characters').isLength({max:1024}),
  body('type', 'invalid type option').custom(value =>{
    if(value !== 'public' && value !== 'restricted' && value !== 'private'){
      throw new Error('invalid type');
    }
    return true;
  }),
  body('content_options', 'invalid content option').custom(value =>{
    if(value !== 'any' && value !== 'links-only' && value !== 'textposts-only'){
      throw new Error('invalid content option');
    }
    return true;
  }),
  body('custom_submit_link_button', 'custom submit link button must be less than 25 characters').isLength({max:25}),
  body('custom_submit_text_button', 'custom submit text  button must be less than 25 characters').isLength({max:25}),
  
  (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      console.log(errors);
      res.render('subreddit_create_form', {title: 'Create a Subreddit', errors: errors.array(), subreddit: req.body});
      return;
    }
    else{
      var subreddit = new Subreddit({
        name: req.body.name,
        title: (req.body.title === '' ? req.body.name: req.body.title),
        description: req.body.description,
        sidebar: req.body.sidebar,
        submission_text: req.body.submission_text,
        type: req.body.type, 
        approved_users: [res.locals.currentUser],
        moderators: [res.locals.currentUser],
        content_options: req.body.content_options,
        custom_submit_link_button: req.body.custom_submit_link_button,
        custom_submit_text_button: req.body.custom_submit_text_button
      });
      subreddit.save(function(err){
        if(err){return next(err);}
        return res.redirect('/r/'+subreddit.name);
      })
    }
  }

]
