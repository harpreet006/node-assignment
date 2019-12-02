var users = require('../models/users')
var UserObj = require('../schema/user')

function checkAuthentication(req,res,next){
    if(req.isAuthenticated()){
        next();
    } else{
        res.redirect("/login");
    }
}
module.exports= function (passport,LocalStrategy,app) {	
	passport.serializeUser(function (user, done) {
    	done(null, user);
	});
	passport.deserializeUser(function (id, done) {
	    done(null, id);
	});
	passport.use('local-login',  new LocalStrategy({
  		passReqToCallback : true
	},function (req,username, password, done) {
	        users.userLogin(username,password,function(err,responce){
	            if(err){
	            	console.log('rejected')
	            }
                if(responce.status){
                    done(null,responce.data[0])
                }else{
                	req.flash('loginMessage',responce.message)
                    done(null,false)
                }
	        })
	    })
	);
	app.post('/signup', function(req, res) {
		mainRequest=Object.keys(req.body);
		let errorMessage=[]
		mainRequest.forEach(function(data){
		    if(req.body[data]==""){
		        errorMessage.push(data," Is empty")
		    }
		})
		if(errorMessage.length){
		    return res.send({status:'200',message:errorMessage})
		}else{
			users.saveUser(req.body,function(err,responce){
	            if(err){
	             console.log(err)
	            }
	            if(responce){
	                res.send({status:200,message:"User successfully saved"})
	            }else{
	                res.send({status:200,message:err})
	            }
		    })	     
		}
	});

	app.post("/login",passport.authenticate("local-login", { failureRedirect: "/login"}),
	function (req, res) {
	    res.redirect("/content");
	});

	app.post("/signup",passport.authenticate("local-signup", { failureRedirect: "/signup"}),
	function (req, res) {
	    res.redirect("/content");
	});

	app.get('/', function (req, res) {		
		if(req.user){
		         res.send(`T-welcome ${req.user.name}  you can your these method<br> <a href="users">LIST OF USERS</a><br><a href="users">GET SINGLE USER (PASS ID INTO URL AFTER USERS FOR EXAMPLE:USERS/:ID)</a>`);
		    }else{
		        res.send("T-f welcome to home page <a href='/login'>login</a>");
		}
	})

	app.get('/login', function (req, res) {
		if(req.user){
		    res.redirect('/content')
		}else{
			res.render('login',{message:req.flash('loginMessage')})
		}
	})
	app.get('/signup', function (req, res) { 
	 res.send("<p>Signup login!</p><form method='post' action='/signup'><input type='text' name='fname'/><input type='password' name='password'/><button type='submit' value='submit'>Submit</buttom></form>")
	});

	app.get('/users',checkAuthentication, function (req, res) {
		users.findAllUser(function(err,result){
	        if(err) throw(err)
            if(result.length){
               res.send({status:200,result:result})
            }else{
               res.send({status:200,message:"Record Not Found"})
            }
	    })
	})

	app.get('/content',checkAuthentication,function(req,res){
    	res.send({status:"200",message:`User successfully registered`})
	})
	app.get('/test',checkAuthentication,function(req,res){
 		console.log(req.user,"This is test route")
    	res.send({status:"200",message:`User successfully auth test ${req.user.name}}`})
	}) 
	app.get('/users/:id',checkAuthentication, function (req, res) {
		users.findAllUserById(req.params.id,function(err,result){
	        if(err) throw(err)
            if(result.length){
               res.send({status:200,result:result})
            }else{
               res.send({status:200,message:"Record Not Found"})
            }
	    })
	})
 }