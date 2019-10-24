var express =require("express")
var path =require("path")
// var favicon =require("serve-favicon")
var logger =require("morgan")
// var cookieParser =require("cookie-parser")
// var cors =require("cors")
var routers= require('./routes/index')
var Tasks= require('./routes/Tasks')
app=express();
app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')
// app.use(cors())
app.use(logger('dev'))
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : false}));

// var bodyParser =require('body-parser')
app.use(bodyParser.json());
// app.use(bodyparser.urlencoded({ extended: false }))
// app.use(cookieParser())
app.use(express.static(path.join(__dirname ,'public')))
app.use('/',routers)
app.use('/Task',Tasks)
/*app.use(function(req,res,next){
	var err= new error('not found data')
	err.status=404
	next(err)
})*/
app.listen(8000);

module.exports=app