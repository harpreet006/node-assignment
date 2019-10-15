var express = require('express');
var app = express();
var http = require('http');
var url = require('url');
var path = require('path');
var mysql = require('mysql');
/* file upload script  start*/
var multer  =   require('multer');
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    callback(null, (file.filename =file.originalname));
  }
});
var upload = multer({ storage : storage});

/* file upload script  start */
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
// app.set('Port',process.env.port||8000)	
app.set('port', process.env.PORT || 8002);
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
console.log(conn,"")
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

app.get('/search',function(req,res){
	console.log("dfsfd");
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
		res.render('editpage',{data:responce})
	})
})

app.post('/update',function(req,res){
	sql="UPDATE users SET name = '"+req.body.name+"', email = '"+req.body.email+"', category='"+req.body.category+"',radio='"+req.body.radio+"',checkbox='"+req.body.checkbox+"', textarea='"+req.body.textarea+"',password='"+req.body.password+"',filename='' WHERE id ='"+req.body.id+"'"
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

app.post('/save', upload.single('file'),function(req,res,next){
	console.log(req.file);
	let name = req.body.name
	let email = req.body.email
	let category = req.body.category
	let radio = req.body.radio
	let checkbox = req.body.checkbox
	let textarea = req.body.textarea
	let password = req.body.password
	var filename= req.file.filename 	
	sql= "insert into users (name,email,category,radio,checkbox,textarea,password,filename)VALUES('"+name+"','"+email+"','"+category+"','"+radio+"','"+checkbox+"','"+textarea+"','"+password+"','"+filename+"')";
	console.log(sql)
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