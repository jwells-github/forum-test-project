const SubForum = require('../models/subForum');
const SubForumModerator = require('../models/subForum_moderator');
const { body,validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');


exports.subForums_get = function(req,res,next){
  SubForum.find().exec(function(err,subForums){
    if(err){return next(err);}
    res.render('subForum_list', {title: 'SubForums', subForums:subForums});
  })
}

exports.subForum_create_get = function(req,res,next){
  if(res.locals.currentUser){
    res.render('subForum_create_form', {title: 'Create a SubForum'});
  }
  else{
    res.redirect('/');
  }
}

exports.subForum_create_post = [
  sanitizeBody('*').trim(),
  body('name', 'Names must be longer than 2 characters and may only contain Numbers and English characters')
    .isLength({min:2})
    .custom(value =>{
      return SubForum.findOne({'name':value}).then(subForum =>{
        if(subForum){
          return Promise.reject('A SubForum with this name already exists')
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
  body('custom_submit_link_button', 'custom submit link button must be less than 25 characters').isLength({max:25}),
  body('custom_submit_text_button', 'custom submit text  button must be less than 25 characters').isLength({max:25}),
  
  (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      console.log(errors);
      res.render('subForum_create_form', {title: 'Create a SubForum', errors: errors.array(), subForum: req.body});
      return;
    }
    else{
      var subForum_moderator = new SubForumModerator({
        user: res.locals.currentUser._id,
        head_mod: true,
        can_appoint: true,
        can_ban: true,
        can_edit_sub_details: true,
        can_remove: true
      })
      subForum_moderator.save(function(err, moderator){
        if(err){return next(err);}
        var subForum = new SubForum({
          name: req.body.name,
          title: (req.body.title === '' ? req.body.name: req.body.title),
          description: req.body.description,
          sidebar: req.body.sidebar,
          submission_text: req.body.submission_text,
          moderators: [moderator._id],
          custom_submit_link_button: req.body.custom_submit_link_button,
          custom_submit_text_button: req.body.custom_submit_text_button
        });
        subForum.save(function(err){
          if(err){return next(err);}
          subForum_moderator.subForum = subForum._id;
          subForum_moderator.save(function(err,){
            if(err){return next(err);}
            return res.redirect('/r/'+subForum.name);
          })
        })
      })

    }
  }

]
