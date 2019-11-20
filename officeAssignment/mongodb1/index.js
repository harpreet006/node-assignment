var express         = require('express'),
app             = express(),
passport        = require('passport'),
LocalStrategy   = require('passport-local').Strategy,
bodyParser      = require('body-parser'),
session         = require('express-session');
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: "tHiSiSasEcRetStr",
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
// var usersRoutes=require('./routes/usersr')
require('./routes/passport')(passport,LocalStrategy,app)//to pass passport localStrategy and app 
app.listen(3031);
console.log("App running at localhost:3031");