const express = require('express');
const app = express();
var cartCount=[]
var multer = require('multer');
const storage = multer.diskStorage({
    destination : function(req,file,callback){
        callback(null, './public/uploads/');
    },
    filename: function(req,file,callback){
    	var datetimestamp = Date.now();
        callback(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
    }
});

const upload = multer({ storage : storage}); 
const fs = require("fs"); // Or `import fs from "fs";` with ESM
const url = require('url');
const path = require('path');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.set('port', process.env.PORT || 8001);
app.set('views',path.join(__dirname,'views'))
app.set('view engine', 'ejs');
app.set(express.json())
var passport=require('passport')
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
var flash = require('express-flash-messages')
app.use(flash())
app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname,'public')))
const  connection = require('./model/connection');	
const  country = require('./model/country');
require('./routes/usersroute')(app,passport,LocalStrategy,upload,cartCount,session); // Call Route Action
var conn = connection.setconn
// console.log(conn,"**&&")

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
	conn.query(query,function(err,responce){
		console.log(responce[0].state)
		res.render('edit',{data:responce,religious:religious})
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