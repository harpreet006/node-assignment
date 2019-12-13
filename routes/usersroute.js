const  users = require('../model/users');
const  country = require('../model/country');
module.exports= function(app,passport,LocalStrategy,upload,cartCount,session){
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
	app.post('/cart',function(req,res){
		cartCount.push(req.body.ids)
		req.session.cart=cartCount;
		return res.json({status:200,message:"Item added successfully",cartcount:cartCount.length})
	})

	app.get('/checkout',function(req,res){
		let vartItems=req.session.cart
		var op=''
		users.cartPage(vartItems, function (err, user) {
			if(err){
				console.log('Errror section')
			}
			if(user){
				console.log(user,"******")
			}		 
		});
		res.render('checkout',{productshow:'user'})
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
		let uploadMul= upload.fields([{
	       name: '_first1_sub_header', maxCount: 1
	    },
	    {
	       name: '_first2_sub_header', maxCount: 1
	    },
	    {
	       name: '_first3_sub_header', maxCount: 1
	    },
	    {
	       name: '_first4_sub_header', maxCount: 1
	    },
	    {
	       name: '_first5_sub_header', maxCount: 1
	    },
	    {
	       name: '_first6_sub_header', maxCount: 1
	    }])

	app.post('/settings-save',uploadMul,function(req,res){
	 	users.saveoptions(req,function(err,responce){
	 		if(err){
	 			console.log('Error cause',err)
	 		}
	 		// console.log(responce,"********")
	 		if(responce){
	 			console.log("Data inserted successfully")
	 			res.redirect('/')
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

	app.get('/add_product',function(req,res){
		res.render('add_product')
	})	

	

	app.post('/productadd',upload.single('file'),function(req,res){
		users.saveproduct(req,function(err,responce){
			if(err){
				console.log('Error cause',err)
			}
			if(responce){
				console.log("Data inserted successfully")
				res.redirect('/productlisting')
			}else{
				console.log("responce1 empty")
			}
		})
	})
	app.post('/changestatus',function(req,res){
		users.changestatus(req,function(err,responce){
			if(err){
				console.log('Error cause',err)
			}
			if(responce){
				return res.json({status:1,message:"success"})
			}else{
				console.log("responce1 empty")
			}
		})
	})

	app.get('/shop',isLoggedIn,function(req,res){
			users.getallproducts(req,function(err,responce){
			if(err){
				console.log('Error cause',err)
			}
			if(responce){
				res.render('shop',{products:responce})
			}else{
				console.log("responce1 empty")
			}
		})
	})
	app.get('/shop/:id?',function(req,res){
			users.getsingleproduct(req,function(err,responce){
			if(err){
				console.log('Error cause',err)
			}
			if(responce){
				res.render('single_product',{products:responce})
			}else{
				console.log("responce1 empty")
			}
		})
	})
	
	app.get('/productlisting',function(req,res){
		users.productlisting(function(err,responce){
			if(err){
				console.log('Error cause',err)
			}
			if(responce){
				res.render('productlisting',{products:responce})
			}else{
				console.log("responce1 empty")
			}
		})
	})	


	app.locals.someNode = [];
	app.locals.getNodeName = function(userId,key) {
		proMom = new Promise((resolve,reject)=>{
			let a = users.getNodeValue([userId,key],function(err,responce){
				if(err){					
					return "errpr";
				}
				if(responce){					 				
					resolve(responce[0].values)
				}
			})
		})

		proMom.then((res=>{
			console.log(res,"|****|")
		})).catch((err=>{
			console.log('******')
		}))
		return []
	}
	 
	// console.log("here",app.locals.getNodeName(1,"_generic_page"));

	app.get('/setting',function(req,res){
		users.getsettings(1,function(err,responce){
			if(err){
				console.log("cause error")
			}
			if(responce){
				res.render('setting', {	title: 'Setting Page'});
				// res.render('setting',{data:responce})
			}else{
				res.render('setting')				
			}			
		})
	}) 
	app.get('/logout',function(req,res){
		req.logout();
			res.redirect('/');
	})

	app.get('/generic',function(req,res){
		res.render('generic')
	})

}

