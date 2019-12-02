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
const  country = require('./model/country');
var conn = connection.setconn
app.get('/',function(req,res){
	country.getcountry(function(err,result){
	if(err) reject('Result not found')
	if(result)
		resolve(result)
	else
		reject("Result not found")
})
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
app.get('/edit/:userid',async function(req,res){
	let query='select * from users where id="'+req.params.userid+'"';
	let promisecountry = new Promise(function(resolve,reject){
		country.getcountry(function(err,result){
			if(err){
				console.log("file not found")
				reject('file not found')
			}
			if(result){				 
				resolve(result)
				//console.log(result,"The file is found")
			}
		})
	})
/*	let promisestate = new Promise(function(resolve,reject){
		country.getstates(function(err,responce){
			if(err){
				reject("record not found")
				console.log('Record is not found')
			}
			if(responce){
				resolve(responce)
				console.log("Record Found")
			}
		})
	 })*/
/*	let promisecities=new Promise(function(resolve,reject){
		country.getcitys(function(err,responce){
			if(err){
				reject('Record not found')
				console.log('record not found')
			}
			if(responce){
				resolve(responce)
				console.log('get the responce')
			}else{
				resolve('no record found')
				console.log('record not able to get')
			}
		})
	})*/
	let religious={} // Declear the data base
	religious.country = await promisecountry
	//religious.states = await promisestate
	//religious.cities = await promisecities
	//getpromiss.then(res=>{getuser.users=res,console.log(res)})
	conn.query(query,function(err,responce){
		console.log(responce[0].state)
		res.render('edit',{data:responce,religious:religious})
	})
})
app.post('/update',function(req,res){
	console.log(req.files,"************")
	//file=(req.file)?req.file.filename:req.body.file
	// console.log("hello",req.body.file)
	sql="UPDATE users SET name = '"+req.body.name+"', email = '"+req.body.email+"', category='"+req.body.category+"',radio='"+req.body.radio+"',checkbox='"+req.body.checkbox+"', textarea='"+req.body.textarea+"',password='"+req.body.password+"',file='',state='"+req.body.state+"',city='"+req.body.city+"',country='"+req.body.country+"' WHERE id ='"+req.body.id+"'"
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

var filename="";

console.log(req.files.file);
	if(req.files.file){
		fileupload = req.files.file;
		var filevalue=""
		fileupload.mv('./public/uploads/'+req.files.file, function(err) {
		 	if(err){
		 		var filename = ''
		 	}else{	
		 		var filename = req.files.file.name
		 	}
		 })
	}else{
		var filename = req.files.file.name
	}
	let name = req.body.name
	let email = req.body.email
	let category = req.body.category
	let radio = req.body.radio
	let checkbox = req.body.checkbox
	let textarea = req.body.textarea
	let password = req.body.password
	var file="";
	var state= req.body.state
	var city= req.body.city
	var country= req.body.country
	console.log("ook"+fileupload);
	sql= "insert into users (name,email,category,radio,checkbox,textarea,password,file,state,city,country)VALUES('"+name+"','"+email+"','"+category+"','"+radio+"','"+checkbox+"','"+textarea+"','"+password+"','"+file+"','"+state+"','"+city+"','"+country+"')";
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