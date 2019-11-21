var express         = require('express'),
app             = express(),
passport        = require('passport'),
LocalStrategy   = require('passport-local').Strategy,
bodyParser      = require('body-parser'),
session         = require('express-session');
const flash = require('connect-flash');
var cookieParser = require('cookie-parser')
 
app.use(cookieParser())
app.use(cookieParser())
app.use(cookieParser('secretString'));
app.set('view engine', 'ejs');
const path=require('path');
app.set('views', path.join(__dirname, 'views'))
app.use(flash())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: "tHiSiSasEcRetStr",
    resave: true,
    saveUninitialized: false
}));
require('./connection')
app.use(passport.initialize());
app.use(passport.session());
// var usersRoutes=require('./routes/usersr')
require('./routes/passport')(passport,LocalStrategy,app)//to pass passport localStrategy and app 
app.listen(3030);
console.log("App running at localhost:3031");