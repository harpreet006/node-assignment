var express= require('express')
var router = express.Router()
var Tasks=require('../models/Tasks')
router.get('/register',function(req,res){
	res.render('res',{data:"This is res template"})
})
router.get('/:id?',function(req,res,next){
	if(req.params.id){
		console.log(req.params.id,'*********** if section')
		Tasks.getTaskById(req.params.id,function(err,rows){
			if(err){
				res.json(err)
			}else{
				console.log(rows)
				res.json(rows)
			}
		})
	}else{
		var kk=[]
		Tasks.getAllTasks(function(err,rows){
			if(err){
				res.json(err)
			}else{
				kk=rows
				console.log(kk,'dfds')
				res.render('list',{listing:kk})
			}
		})
	}
})
router.post('/add',function(req,res,next){
	Tasks.addTask(req.body,function(err,rows){
		if(err){
			res.json(err)
		}else{			
			res.redirect('/Task')
		}
	})
})


router.post('/deleteall',function(req,res,next){
	Tasks.deleterecord(req.body.key,function(err,responce){
		if(err){
			console.log('Error Produced');
		}else{
			res.send('ok')
		}
	})
})

router.post('/login',function(req,res,next){
	/*console.log(req.body.fname);
	console.log(req.body.password);*/
	Tasks.userlogin(req.body,function(err,responce){
		if(err){
			console.log('Error Produced');
		}else{
			if(responce.length){
				res.send('user successfullly login')				
			}else{	
				res.send('Login details failed')
			}
		}
	})
})

router.get('/delete/:id',function(req,res,next){
	console.log(req.params,",ulti check box")
	Tasks.deleteTask(req.params.id,function(err,rows){
		if(err){
			res.json(err)
		}else{
			res.redirect('/Task')
		}
	})
})
router.get('/edit/:id',function(req,res,next){
	Tasks.editTask(req.params.id,function(err,rows){
		if(err){
			res.json(err)
		}else{
			res.render('edit',{list:rows})
		}
	})
})

router.post('/edit',function(req,res,next){ 
	Tasks.saveEditTask(req.body,function(err,rows){
		if(err){
			res.json(err)
		}else{
			res.redirect('/Task')
		}
	})
})

module.exports=router