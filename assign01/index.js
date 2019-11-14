var express=require('express')
var mysql= require('mysql')
var bodyParser=require('body-parser')
var path = require('path');
var app= express()

var passport   = require('passport')
var dbconnection   = require('./dbconnection')
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded(({extended : false})))
app.use(bodyParser.json())
var LocalStrategy   = require('passport-local').Strategy;
app.set('views', path.join(__dirname, 'views'));
app.set('view engine','ejs');

app.get('/login',function(req,res){
	res.render('login')
})

/*app.post('/userlogin',function(req,res){
	//console.log(req.body.fname,req.body.password);
	var hj=dbconnection.query("SELECT * FROM `register` WHERE `name` = '"+req.body.password+"' AND `password` = '"+req.body.password+"'")
	console.log(hj,"**");
})
*/

app.post('/login', passport.authenticate('local-login'));
passport.use('local-login', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField : 'name',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
},
function(req, email, password, done) { // callback with email and password from our form
	console.log('**')
	/*connection.query("SELECT * FROM `register` WHERE `email` = '" + email + "'",function(err,rows){
		if (err)
		    return done(err);
		 if (!rows.length) {
		    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
		} 

		// if the user is found but the password is wrong
		if (!( rows[0].password == password))
		    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

		// all is well, return successful user
		return done(null, rows[0]);			

		});*/
}));


passport.serializeUser(function(user, done) {
	done(null, user.id);
});
passport.deserializeUser(function(id, done) {
	connection.query("select * from register where id = "+id,function(err,rows){	
		done(err, rows[0]);
	});
});

app.listen(8002)