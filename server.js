var express=require('express'),
app = express(),
server = require('http').createServer(app),
router = require('./routes/index'),
mongoose = require('mongoose'),
bodyParser = require('body-parser'),
passport=require('./passport'),
session = require('client-sessions');

mongoose.connect("mongodb://localhost:27017/pandu",function(err){
  if(err) return console.log('mongo db not running');
  server.listen(9000,function(){
    console.log("running @localhost:9000");
  });
});

app.set('view engine','ejs');
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(passport.initialize());
app.use(passport.session());
app.use(session({
    cookieName:'session',
    secret:'random_string',
    duration:30*60*1000,
    activeDuration:5*60*1000
}));
app.use('/',router);
