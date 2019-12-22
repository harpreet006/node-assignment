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
		if(req.session.passport!=undefined){
			console.log(req.session.passport,"***** Count Act *******")
			// console.log(req.session.passport,"*****I am not Undefind")
			// console.log(req.session.passport.cartCount=null,"Get the cart count act program FINAL")
			// req.session.passport.cart.distroy()
		}else{
			console.log('Get undefind')
		}
		console.log(req.session.passport,"***** Count Act *******")
		// var name = req.user
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
		console.log(cartCount.length,"get length section")
		// if(cartCount.length>0){
			let callbackFun=cartCount.filter(function (person) { return person.id == req.body.ids.id });
			if(callbackFun.length>0){
				return res.json({status:200,message:"Item already exist"})
			}else{
				users.addsession(req.body.ids,req.session.passport.user.user_id,function(err,responce){
					if(err){
						console.log('Error section')
					}
					if(responce){
						console.log('successfully added')
					}
				})
				cartCount.push(req.body.ids)
				req.session.passport.cartCount=cartCount
			}		
		// console.log(req.session.passport.cart,"Get session")
		return res.json({status:200,message:"Item added successfully",cartcount:'cartCount'})
	})

	app.get('/checkout',function(req,res){
		console.log('************',req.session.passport,"********")
		if(cartCount.length > 0){
			let cartIds= cartCount.map((res,index)=>{
				return res.id
			})
			// console.log(cartIds,"*********")
			users.cartPage(cartIds, function (err, user){
				if(err){
					console.log('Errror section')
				}
				if(user){
					res.locals.user_name = req.user;
					res.render('checkout',{productshow:user})
				}
			});
		}
	})

	app.post('/changeqty',function(req,res){
		console.log("*********",req.body.datakey.id,"*******")
		users.increateQyt(req.body.datakey, function (err, user){
			if(err){
				console.log('Errror section')
			}
			if(user){
				res.render('checkout',{productshow:'user'})
			}
		});
	})

	app.get('/orderplace',function(req,res){
		let cartIds= cartCount.map((res,index)=>{
			return res.id
		})
		console.log(cartIds,"*********")
		users.cartPage(cartIds,function(err,responce){
			if(err){
				console.log("Error secion")
			}
			if(responce){
				res.locals.user_name = req.user;
				res.render('orderplace',{productshow:responce})
			}
		})
	})
	app.post('/orderplaced',function(req,res){
		users.placedorder(req,function(err,responce){
			if(err){
				console.log("Error secion")
			}

			if(responce){
				users.deletesession(req,function(err,responce){
					if(err){
						console.log("error section")
					}
					if(responce){
						res.locals.user_name = req.user;
						// delete req.session.passport.cartCount
						console.log("delete session with corsponding id",req.session.passport)
					}
				})
				res.render('thankupage',{orderResult:responce.insertId})
			}
		})
	})


	/*(async () => {
	  const charge = await stripe.charges.create({
	    amount: 999,
	    currency: 'usd',
	    source: 'tok_visa',
	    receipt_email: 'jenny.rosen@example.com',
	  });
	})();*/

	app.post("/pay", function(req, res) {
	    let amount = 10*100;
	    // create a customer 
	    stripe.customers.create({
	        email: req.body.stripeEmail, // customer email
	        source: req.body.stripeToken // token for the card 
	    })
	    .then(customer =>
	        stripe.charges.create({ // charge the customer
	        amount,
	        description: "Sample Charge",
	            currency: "usd",
	            customer: customer.id
	        }))
	    .then(charge => res.render("pay")); // render the payment successful alter page after payment
	});	

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
		console.log("&&&&&&&&&&&&&&&",req.session.passport,"&&&&&&&&&&&&&&&")
			users.getallproducts(req,function(err,responce){
			if(err){
				console.log('Error cause',err)
			}
			if(responce){
				res.locals.user_name = req.user;
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

