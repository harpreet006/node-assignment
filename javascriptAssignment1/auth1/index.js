var express= require('express')
var app=express()
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var passport = require('passport');
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
var LocalStrategy = require('passport-local').Strategy;
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user) {
	// console.log("************")
  cb(null, 1);
});
passport.deserializeUser(function(id, cb) {
    cb(null, 1);
});
passport.use(new LocalStrategy(
  function(username, password, done) {
  	console.log(username,password)
  }
));

app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/error' }),
  function(req, res) {
    res.redirect('/');
  });
app.get('/login',function(req,res){
	res.send('<form method="post" action="/login"><input type=text name=username><input type=text name=password><input type=submit name=submit></form>')
})

app.get("/error",()=>{
	console.log(22225555522222)
})
app.get("/",()=>{
	console.log(222222)
})
app.listen('3000')