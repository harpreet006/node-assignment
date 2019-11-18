var express=require('express')
var router= express.Router()

router.get('/',function(req,res){
	res.send('welcome to student home page routes')
})

router.get('/details',function(req,res){
	res.send('welcome to student detail page routes')
})
router.get('/hello',function(req,res){
	res.send('welcome to hello detail page routes')
})
router.get('/hello/kl/',function(req,res){
	res.send('welcome sdfsdfsdfsage routes')
})

module.exports=router