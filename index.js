var express = require('express');
var http = require('http');
var url = require('url');
var path = require('path');
var mysql = require('mysql');
var multer = require('multer');
var fa = require('fs');

var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now());
  }
});
var upload = multer({ storage : storage}).single('fileupload');

var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
// app.set('Port',process.env.port||8000)	
app.set('port', process.env.PORT || 8000);
app.set('views',path.join(__dirname,'views'))
app.set('view engine', 'ejs');
app.set(express.json())
app.use(express.static(path.join(__dirname,'public')))
var conn = mysql.createConnection({
	host:"localhost",
	user:"root",
	password:"",
	database:"node_crud_1"
})
// app.use(express.static(path.join(__dirname,js)))
app.get('/',function(req,res){
	res.render('index')
})
app.get('/elements',function(req,res){
	res.render('elements')
})
app.get('/register',function(req,res){
	res.render('register')
})
app.post('/ulogin',function(req,res){	
	let username=req.body.lname
	let password=req.body.lpassword
	let queryd='select * from users where name="'+username+'" and password="'+password+'"';	
	conn.query(queryd,function(req,res){
		if(res.length){
 			console.log("welcom to login section")
		}else{
			console.log("error")
			//res.redirect('userlogin')
		}
	})
})
app.get('/userlogin',function(req,res){
	res.render('login');
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
		res.redirect('/editpage')
	})
	//console.log("**********");
})

app.get('/delete/:userid',function(req,res){
	let query='delete from users where id="'+req.params.userid+'"';		
	console.log(query)
	conn.query(query,function(err,responce){	
		res.redirect('/list')
	})
})

app.post('/save',function(req,res){
	let name =req.body.name
	let email =req.body.email
	let category =req.body.category
	let radio =req.body.radio
	let checkbox =req.body.checkbox
	let textarea =req.body.textarea
	let password =req.body.password
	upload(req,res,function(err) {
		if(err) {
		    return res.end("Error uploading file.");
		}
		res.end("File is uploaded");
	});


	sql= "insert into users (name,email,category,radio,checkbox,textarea,password)VALUES('"+name+"','"+email+"','"+category+"','"+radio+"','"+checkbox+"','"+textarea+"','"+password+"')";
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