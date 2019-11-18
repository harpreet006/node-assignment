var express=require('express')
var mysql= require('mysql')
var bodyParser=require('body-parser')
var path = require('path');
var app= express()

var passport   = require('passport')


app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded(({extended : false})))
app.use(bodyParser.json())
app.set('views', path.join(__dirname, 'views'));
app.set('view engine','ejs');


RoutesUsers=require('./routes/users.js')
ModelLogin=require('./model/user.js')
RoutesStudents=require('./routes/students.js')
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
 
passport.deserializeUser(function(id, done) {
  ModelLogin.findById(id, function (err, user) {
    done(err, user);
  });
});

app.use('/',RoutesUsers)
app.use('/student/dsfsd/',RoutesStudents)
app.listen(8001)