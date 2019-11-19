var express= require('express');
var app = express();
const mongoose=require('mongoose')

var app = express();
app.use(require('serve-static')(__dirname + '/../../public'));
// app.use(require('cookie-parser')());

app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
const flash = require('connect-flash');

app.use(flash());

app.use(require('serve-static')(__dirname + 'public'));
// app.use(require('cookie-parser')());

app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

var passport = require('passport'),
LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
   done(null, user.id);
});

passport.deserializeUser(function(id, done) {   
      done(err, user);
});

app.use(passport.initialize());
app.use(passport.session());

const url="mongodb://localhost:27017/mongoassign1"

var passport = require('passport'),
LocalStrategy = require('passport-local').Strategy;

var signupvalidation = function (req, res, next){
  let loginvalid=Object.keys(req.body)
  let errorMessage=[]
  loginvalid.forEach(function(index){
  	if(req.body[index]==""){
  		errorMessage.push(index," Is empty")
  	}
  })
  if(errorMessage.length>0){
  	return res.send({status:200,message:errorMessage})
  }else{
  		next()
	}
}

app.use(signupvalidation)  //use for every form in

passport.use('login',new LocalStrategy(
 function(username, password, done) {
 		console.log(username,password,"&***")
		mongoose.connect(url,function(err,responce){
			if(err) throw(err)
			if(responce){				 
				console.log("UserName:",username,"Password:",password)				
			}else{
				console.log("Data not able t get")
			}
		})
    }
));

passport.use('signup', new LocalStrategy({
    passReqToCallback : true
  },
  function(req, done) {
  		console.log("********")
  		console.log(req.body.username,req.body.lname,req.body.address,req.body.password)
  })
);

  /* Handle Registration POST */
app.post('/signup', passport.authenticate('signup', {
    successRedirect: '/home',
    failureRedirect: '/signup',
    failureFlash : true 
}));

app.post('/login', passport.authenticate('login', { successRedirect: '/success', failureRedirect: '/', failureFlash: true })
);
//signup
app.get('/signup',function(req,res){
	return res.send('Signup Form<form action="/signup" method="post"><div><label>Username:</label><input type="text" name="username"/></div><div><label>Lname:</label><input type="text" name="lname"/></div><div><div><label>Address:</label><input type="text" name="address"/></div><div><div><label>Password:</label><input type="password" name="password"/></div><div><input type="submit" value="Log In"/></div></form>')
})
//login
app.get('/',function(req,res){
	return res.send('<form action="/login" method="post"><div><label>Username:</label><input type="text" name="username"/></div><div><label>Password:</label><input type="password" name="password"/></div><div><input type="submit" value="Log In"/></div></form>')
})
app.listen('3031')