var passport = require('passport'),
LocalStrategy = require('passport-local').Strategy,
FacebookStrategy = require('passport-facebook').Strategy,
GoogleStrategy = require('passport-google-oauth2').Strategy,
User = require('./model/user');

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
},
  function(username, password, done) {
    User.findOne({ email: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect email.' });
      }
      if (user.password!=password) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

passport.use(new FacebookStrategy({
  clientID: '1736255976684459',
  clientSecret: '2efda7ca1dbd1d823329f5b3bfbd782f',
  callbackURL: "http://localhost:9000/auth/facebook/callback",
  profileFields: ['displayName', 'emails']
},
function(accessToken, refreshToken, profile, done){
    User.findOne({email:profile._json.email},function(err,user){
      if(err) return console.log(err);
      if(!user){
        User.create(new User({name:profile._json.name,email:profile._json.email,password:profile._json.id}), function (err, user) {
          return done(err, user);
        });
      }
      else return done(err,user);
    });
}));

passport.use(new GoogleStrategy({
    clientID: "464347468706-sf95ai3icvurnq9tiigirqtghad9ggdm.apps.googleusercontent.com",
    clientSecret: "i8Ju3E6bMD2bOvRXtUTvM_Zf",
    callbackURL: "http://localhost:9000/auth/google/callback",
    passReqToCallback: true
  },
  function(request, accessToken, refreshToken, profile, done) {
    User.findOne({email:profile.email},function(err,user){
      if(err) return console.log(err);
      if(!user){
        User.create(new User({name:profile.displayName,email:profile.email,password:profile.id}), function (err, user) {
          return done(err, user);
        });
      }
      else return done(err,user);
    });
  }
));

module.exports = passport;
