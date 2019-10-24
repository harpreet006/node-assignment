var express =require("express")
var path =require("path")
var favicon =require("serve-favicon")
var logger =require("morgan")
var cookieParser =require("cookie-parser")
var bodyParser =require("body-parser")
var cors =require("cors")
route= require('./route/index')
Tasks= require('./route/Tasks')
app=express();
app.set('view',path.join(__dirname,'views'))
app.set('view engine','ejs')
app.use(cors())
app.use(logger('dev'))
app.use(bodyparser.json( limit '50mb' ))
app.use(bodyparser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname 'public')))
app.use('/',routers)
app.use('/Task',Tasks)
app.use(function(req,res,next){
	var err=new error('not found data')
	err.status=404
	next(err)
})

module.exports=app