var router = require('express').Router();
var passport = require('passport');
var User = require('../model/user');

router.get('/',function(req,res,next){
  res.render('index');
});

router.post('/login',passport.authenticate('local'),function(req, res,next) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    req.session.user = req.user;
    res.redirect('/query');
});

router.get('/auth/facebook',passport.authenticate('facebook',{ scope: 'email'}));

router.get('/auth/facebook/callback',passport.authenticate('facebook', { failureRedirect: '/' }),function(req,res,next) {
    // Successful authentication, redirect home.
    req.session.user = req.user;
    res.redirect('/query');
});

router.get('/auth/google',passport.authenticate('google',{ scope: [
    'https://www.googleapis.com/auth/plus.login',
    'https://www.googleapis.com/auth/plus.profile.emails.read'
] }));

router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), function(req, res, next) {
    req.session.user = req.user;
    res.redirect('/query');
});

router.get('/json',function(req,res,next){
  res.json(req.session.user);
});

router.post('/register',function(req,res,next){
  console.log(req.body);
  User.create(req.body,function(err,user){
    if(err) return console.log(err);
    req.session.user = req.user;
    res.redirect('/query');
  });
});

router.get('/logout',function(req,res,next){
  req.session.reset();
  res.redirect('/');
});

module.exports = router;
