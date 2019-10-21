const express = require('express');
const app = express();
const http = require('http');
const url = require('url');
const path = require('path');
/* file upload script  start*/
const fileUpload = require('express-fileupload');
app.use(fileUpload());
/* file upload script  start */
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.set('port', process.env.PORT || 8002);
app.set('views',path.join(__dirname,'views'))
app.set('view engine', 'ejs');
app.set(express.json())
app.use(express.static(path.join(__dirname,'public')))
const  connection = require('./model/connection');
var conn = connection.setconn
app.get('/',function(req,res){
	res.render('index')
})
app.get('/elements',function(req,res){
	res.render('elements')
})
app.post("/getstate",function(req,res){
	sql="select * from states where country_id="+req.body.datakey+""	
	conn.query(sql,function(req,responce){
		if(responce.length){
			res.send({status:true,result:responce})
		}else{
			res.send({status:false,result:''})
		}
	})
})

app.post("/getcity",function(req,res){
	sql="select * from cities where state_id="+req.body.datakey+""
	conn.query(sql,function(req,responce){
		if(responce.length){
			res.send({status:true,result:responce})
		}else{
			res.send({status:false,result:''})
		}
	})
})
app.get('/register',function(req,res){
	let sql ="select * from countries"
	let responce=""
	conn.query(sql,function(req,responce){
		try{
			if(res){
				responcedata= responce
			}else{
				responcedata= ""
			}
		}catch(err){
			console.log("error")
		}
	res.render('register',{country:responcedata})
	})
})
app.post('/ulogin',function(req,res){
	let username=req.body.lname
	let password=req.body.lpassword
	let queryd='select * from users where name="'+username+'" and password="'+password+'"';	
	conn.query(queryd,function(err,responce){
		try{
			if(responce.length){
			res.redirect('/list');
			}else{
				console.log("value not insterted")
			}
		}catch(err){
			console.log(err,"Cause connection!")
		}
	})
})
app.get('/userlogin',function(req,res){
	res.render('login');
})
app.post('/search',function(req,res){
	let name = req.body.keyword
	sql="SELECT * FROM users WHERE name LIKE '"+name+"%' ";
	conn.query(sql,function(err,responce){
		try{
			if(responce.length>0){
				res.send({status:true,result:responce})
			}else{
				res.send({status:false,result:"No record found"})
			}
		}catch(err){
			console.log(err);
		}
	})
})
app.get('/list',function(req,res){
	let query='select * from users';
	conn.query(query,function(err,responce){
		res.render('list',{data:responce})
	})
})
app.get('/edit/:userid',function(req,res){
	let query='select * from users where id="'+req.params.userid+'"';
	conn.query(query,function(err,responce){
		res.render('edit',{data:responce})
	})
})
app.post('/update',function(req,res){
	console.log(req.files,"************")
	//file=(req.file)?req.file.filename:req.body.file
	// console.log("hello",req.body.file)
	sql="UPDATE users SET name = '"+req.body.name+"', email = '"+req.body.email+"', category='"+req.body.category+"',radio='"+req.body.radio+"',checkbox='"+req.body.checkbox+"', textarea='"+req.body.textarea+"',password='"+req.body.password+"',file='' WHERE id ='"+req.body.id+"'"
	conn.query(sql,function(err,responce){
		res.redirect('list')
	})
})

app.get('/delete/:userid',function(req,res){
	let query='delete from users where id="'+req.params.userid+'"';
	console.log(query)
	conn.query(query,function(err,responce){
		res.redirect('/list')
	})
})
app.post('/save',function(req,res,next){
	if(req.files.file){
		var  fileupload = req.files.file;
		var filevalue=""
		var mvresponce=fileupload.mv('./public/uploads/'+req.files.file, function(err) {
		 	if(err){
		 		console.log("error")
		 	}else{	
		 		console.log("file upload")
		 	}
		 })
		console.log(mvresponce,'File upload action')
	}else{
		console.log('File not upload');
	}
	let name = req.body.name
	let email = req.body.email
	let category = req.body.category
	let radio = req.body.radio
	let checkbox = req.body.checkbox
	let textarea = req.body.textarea
	let password = req.body.password
	// var file= req.file.filename
	var state= req.body.state
	var city= req.body.city
	var country= req.body.country
	sql= "insert into users (name,email,category,radio,checkbox,textarea,password,file,state,city,country)VALUES('"+name+"','"+email+"','"+category+"','"+radio+"','"+checkbox+"','"+textarea+"','"+password+"','','"+state+"','"+city+"','"+country+"')";
	conn.query(sql,function(req,res){
		try{
			if(res){
				console.log('data successfully inserted');
			}else{
				console.log("data not inserted")
			}
		}catch(err){
			console.log(err,"this is try catch statement")
		}
	})
	res.redirect("/register")
})
app.get('/generic',function(req,res){
	res.render('generic')
})
http.createServer(app).listen(app.get('port'),function(){
	console.log('express.server'+app.get('port'))
})