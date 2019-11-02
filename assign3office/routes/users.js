var express= require('express')
var router = express.Router()

router.get('/',function(req,res){
	res.render('home');
})
router.get('/register',function(req,res){
	res.send('welcome to  register page')
})

router.get('/login',function(req,res){
	res.send('welcome to login section');
})

module.exports=router
