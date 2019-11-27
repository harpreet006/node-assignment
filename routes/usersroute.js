const  users = require('../model/users');
const  country = require('../model/country');
module.exports= function(app,passport,LocalStrategy,upload){
	passport.serializeUser(function(user, done) {		 
		done(null, user);
	});

	passport.deserializeUser(function(id, done) {		
			done(null, id);
	});

	app.post('/login',passport.authenticate('local', { failureRedirect: '/userlogin' }),
	function(req, res) {
		res.redirect('/');
	});

	passport.use(new LocalStrategy(
		function(username, password, done) {
			users.getLogin({ username: username }, function (err, user) {
				if(user.length){
					if(user[0].password===password){
						// console.log(user[0])
						done(null,{user_id:user[0].id,username:user[0].email,file:user[0].file})
					}else{
						console.log('password not matched')
						done(null,false)
					}
				}else{
					console.log('Username and password not matched')
					done(null,false)
				}
			});
		}
	));
	
	app.get('/',function(req,res){
		var name = req.user
		console.log(req.user,"**&&&**")
    	res.locals.user_name = req.user;
		res.render('index')
	})

	app.get('/userlogin',function(req,res){
		if(req.user !="" &&  req.user !=undefined){			
			res.redirect('/')
		}else{
			res.render('login');		
		}
	})

	app.get('/register',async function(req,res){
		var newdata = new Promise((resolve, reject) => {
			country.getcountry(function(err,responce){
				if(err){
					reject(err)
				}
				if(responce){
					resolve(responce)
				}
			})
		})
		var countryaction = await newdata
		if(req.user !="" &&  req.user !=undefined){	
			res.redirect('/')
		}else{
			res.render('register',{country:countryaction})
		}
	})

	app.post('/save', upload.single('file'), passport.authenticate('local-signup', { failureRedirect: '/register' }),
	function(req, res) {
		res.redirect('/');
	});

	passport.use('local-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
    	users.checkUserExist(req,function(err,responce){
    		if(err){
				console.log("signup cause error")
			}
			if(responce.length){
				console.log("this user is already checkUserExist")
				done(null,false)
			}else{
				users.savedata(req,function(err,responce1){
					if(err){
						console.log("*********")
					}
					if(responce1){
						console.log("User registered successfully ")
						done(null,responce1)
					}else{
						console.log('User not able to register')
					}
				})
			}
    	})
    }));

	app.post('/update',upload.single('file'),function(req,res){
		users.updateUser(req,function(err,responce){
			if(err){
				console.log("Update cause error")
			}
			if(responce){
				res.redirect('/')
				console.log("User Update successfully")
			}
		})		
	})

	app.post('/settings-save',function(req,res){
	 	users.saveoptions(req,function(err,responce){
	 		if(err){
	 			console.log('Error cause')
	 		}
	 		if(responce){
	 			console.log("Data inserted successfully")
	 			res.redirect('/setting')
	 		}else{
	 			console.log("responce1 empty")
	 		}
	 	})
	})

	app.get('/list/:id?',function(req,res){
		users.getalluser(req,function(err,responce){
			if(err){
				console.log("get list error")
			}
			if(responce){
				let parmId=0
				if(req.params.id !=undefined){
					parmId= req.params.id*10
				}
				users.getuserLimit(req, parmId,function(err,responce1){
					console.log(req.params.id,"*&&&*")
					if(err){
						console.log("get list error with limit")
					}
					getParms=0
					if(req.params.id !=undefined){
						getParms=req.params.id
					}
					res.render('list',{data:responce1,totalcount:Math.ceil(responce.length/10-1),currentPage:getParms})
				})
			}
		})
	})


	function isLoggedIn(req, res, next) {
	 if (req.isAuthenticated()) {
	    req.isLogged = true
	    return next();
	 }
	 res.redirect('/');
	}

	app.get('/elements',function(req,res){
		res.render('elements')
	})

	app.get('/setting',function(req,res){
		res.render('setting')
	})


	app.get('/logout',function(req,res){
		req.logout();
  		res.redirect('/');
	})

	app.get('/generic',function(req,res){
		res.render('generic')
	})

}

