var express= require('express')
	app=express()
	passport=require('passport')
	session=require('express-session')
	LocalStrategy	= require('passport-local').Strategy

	app.use(session({
    secret: "tHiSiSasEcRetStr",
    resave: true,
    saveUninitialized: true }));

	app.use(passport.initialize());
	app.use(passport.session());

	var flash=require("connect-flash");
	app.use(flash());

	
	passport.serializeUser(function(user, done) {
		sql=`select * from register_user where id=${user}`
		con.query(sql,function(err,responce){
			if(err) throw (err)
				if(responce.length){
					done(null, responce[0]);
				}

		})
	});

	passport.deserializeUser(function(user, done) {
		done(null, user);
	});

	var bodyParser = require('body-parser')
	app.use(bodyParser.urlencoded({ extended: false })) 
	app.use(bodyParser.json())

	let mysql = require('mysql');
	let con = mysql.createConnection({
	    host: 'localhost',
	    user: 'root',
	    password: 'ourdesignz',
	    database: 'selftest'
	});

	con.connect(function(err) {
	if (err) {
		return console.error('error: ' + err.message);
	}
	console.log('Connected to the MySQL server.');
	});

	app.get('/',function(req,res){
		if(!req.user){
			res.send("<form action='/register' method=post namer=register><input type=text name=username placeholder='enter the username'><input type=text name=password placeholder='enter the password'><input type=text name=nikname placeholder='enter the nikname'><input type=submit name=submit values=submit></form>")
		}else{
			res.send(`welcome to ${req.user.nikname}`)
		}
	})
	passport.use('local-signup',new LocalStrategy({
  		passReqToCallback : true
	},function(req,username, password, done) {
			getsql=`select * from register_user where username='${username}'`
			con.query(getsql,function(err,responce){
				if(err){
					done(err)
				}				
				if(responce.length){
					return done(null,false)				 
					//return done(null,false, req.flash('loginMessage', 'No user found.'))
				}else{
					var qry= `insert into register_user (nikname,username,password) VALUES('${req.body.nikname}','${req.body.username}','${req.body.password}')`

					con.query(qry,function(err1,responce1){
						if(err1) throw (err1)
						if(responce1){							
							return done(null,responce1.insertId)
						}else{
							console.log(responce1,"Data not inserted")
							return done(null,false)
						}
					})		 
				}
			})
		}
	));

	app.get('/login',function(req,res){
		if(!req.user){
			res.send('<form action="/login" method=post><input type=text name=username placeholder="Enter username"><input type=text name=password placeholder="Enter password"><input type=submit name=submit value=submit></form>')
		}else{
			res.send(`welcome to ${req.user.nikname}`)
		}
	})

	passport.use('local-login',new LocalStrategy(
		function(username, password, done) {
			console.log('select add')
			sql=`select * from register_user where username='${username}' and password='${password}'`;
			con.query(sql,function(err,responce){
				if(err) throw err
				if(responce.length){
					console.log("good !")
					return done(null,responce[0].id)
				}else{
					console.log("not good !")
					return done(null,false)
				}
			})		
		}
	));


	function checkAuthentication(req,res,next){
			if(req.isAuthenticated()){
			    next();
			} else{
			    res.redirect("/login");
			}
	}

	function isLoggedIn(req, res, next) {
	    console.log(req.body)
	    if (req.isAuthenticated())
	        return next(); 
	    res.redirect("/");
	}



app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});
	
app.post('/login',passport.authenticate('local-login', { failureRedirect: '/login' }),
	function(req, res) {
	res.redirect('/success');
});


app.post('/register', passport.authenticate('local-signup',{ failureRedirect: '/' }),
	function(req, res) {
		res.redirect('/');
	}
);

app.get('/success',checkAuthentication,function(req,res){
	console.log(req.user)
	res.send('welcome to login screen <a href="/logout">Logout</a>')
})
	


app.listen(3030);
console.log("App running at localhost:3030")