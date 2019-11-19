var  express = require('express');
var  router = require('routes');
var  http = require('http');
var  url = require('url');
var  path = require('path');
var  bodyParser = require('body-parser');
var  app = express;
app.use(bodyParser:json());
app.use(bodyParser.urlencodeed({extended:true}))
app.set('port',process.env.PORT||4300)
app.set('views',path.join(__dirname,'view'))
app.set('view engine','ejs')

app.use(express.json())
var mongoose= require('mongoose')
var url= 'mongoodb:localhost:27017/mm'
app.use(express.stattic(path.join(__dirname,'public')))
app.get('/',function(req,res){
	mongoose.connect(url,function(err,db){
		db.collection('books').find({}).toArray(function(err,result)){
			if(err) throw err
				res.render('index',{data:result})
		}
	}
})

app.post('join',function(req,res){	
	mongoose.connect(url,function(err,db){
		db,collection('books').aggregate({})
	})
})
