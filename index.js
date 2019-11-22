const express = require('express');
const app = express();
// const http = require('http');
const url = require('url');
const path = require('path');
/* file upload script  start*/
const fileUpload = require('express-fileupload');
app.use(fileUpload());
/* file upload script  start */
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.set('port', process.env.PORT || 8002);
app.set('views',path.join(__dirname,'views'))
app.set('view engine', 'ejs');
app.set(express.json())
var passport=require('passport')
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
var multer = require('multer');
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/images/')
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now())
    }
});
var upload = multer({storage: storage});

app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname,'public')))
const  connection = require('./model/connection');	
const  country = require('./model/country');
require('./routes/usersroute')(app,passport,LocalStrategy,); // Call Route Action
var conn = connection.setconn

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



app.listen(app.get('port'),function(){
	console.log('express.server'+app.get('port'))
})