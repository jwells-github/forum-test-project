const passport = require("passport");


exports.user_login_get = function (req,res,next){
    if(res.locals.currentUser){
        req.flash('info', 'You must log out before attempting to log into another account')
        res.redirect('/')
      }
      else{
        res.render('login_form', {title: 'Login',});
      }  
};

exports.user_login_post =
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
    });
      