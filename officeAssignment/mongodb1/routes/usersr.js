var express = require('express')
var router = express.Router()
var users =require('../models/users')

function checkAuthentication(req,res,next){
    if(req.isAuthenticated()){
        next();
    } else{
        res.redirect("/login");
    }
}

module.exports.defaultlink=router.get('/', function (req, res) {
  if(req.user){
	         res.send(`welcome ${req.user[0].name}  you can your these method<br> <a href="users">LIST OF USERS</a><br><a href="users">GET SINGLE USER (PASS ID INTO URL AFTER USERS FOR EXAMPLE:USERS/:ID)</a>`);
	    }else{
	        res.send("welcome to home page <a href='/login'>login</a>");
	}
})

module.exports.login=router.get('/login', function (req, res) { 
	if(req.user){
	    res.redirect('/content')
	}else{
	    res.send("<p>Please login!</p><form method='post' action='/login'><input type='text' name='username'/><input type='password' name='password'/><button type='submit' value='submit'>Submit</buttom></form>");
	} 
})

module.exports.signup=router.get('/signup', function (req, res) { 
	 res.send("<p>Signup login!</p><form method='post' action='/signup'><input type='text' name='fname'/><input type='password' name='password'/><button type='submit' value='submit'>Submit</buttom></form>")
})

module.exports.getusers=router.get('/users',checkAuthentication, function (req, res) { 
	 users.findAllUser(function(err,result){
        if(err) throw(err)
            if(result.length){
               res.send({status:200,result:result})
            }else{
               res.send({status:200,message:"Record Not Found"})
            }
    })
})

module.exports.getsingleUser=router.get('/users/:id',checkAuthentication, function (req, res) { 
	users.findAllUserById(req.params.id,function(err,result){
        if(err) throw(err)
            if(result.length){
               res.send({status:200,result:result})
            }else{
               res.send({status:200,message:"Record Not Found"})
            }
    })
})

module.exports.contentlink=router.get('/content',checkAuthentication,function(req,res){     
    res.send({status:"200",message:`User successfully registered ${req.user[0].name}`})
}) 