var express = require('express');
var app = express();
var  http= require('http');
var fs = require("fs");
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use( bodyParser.json() );
var formidableMiddleware = require('express-formidable');
app.use(formidableMiddleware());
app.get('/',function(req,res){
 	fs.readFile('file.json', function(err, data) {
 		var user=JSON.parse(data)
 		res.json({status:200,data:user})
    	res.end();
  	});
})
app.post("/",function(req, res, next){
  	if(!req.files.file){
  		res.json({status:200,message:" file is empty"})
  	}
   	let errorMessage=[]
  	Object.keys(req.fields).forEach(function(key,indexd){
  		if(req.fields[key]==""){
  			errorMessage.push(key+" is empty")
  		}
  	})
  	if(errorMessage.length>0){
  		res.json({status:200,message:errorMessage})
  	}
 	fs.readFile('file.json',function(err,data){
 		let user= JSON.parse(data) 
		let  ids= Math.random()
 		user.push({'id':ids,'fname':req.fields.fname,'lname':req.fields.lname,'address':req.fields.address,'imagename':'imageName'})
 		fs.writeFile('file.json', JSON.stringify(user), (err) => {
 			if(err) throw (err)
 			res.json({status:"200",message:"success"})
 		})		
 	})
})

app.get("/:id",function(req,res){
fs.readFile('file.json',function(err,data){
 		let user= JSON.parse(data)
 		var cbresult=0;
 		user.forEach(function(data){
 			if(data.id==req.params.id){
 				console.log(data.id,"Correct Section",req.params.id);
 				cbresult=1
 				return res.json({status:200,message:'success',data:data})
 			}
 		})
 		if(cbresult==0){
 			return res.json({status:200,message:'record not found'})
 		}
 	})
})

app.delete("/:id",function(req,res){
fs.readFile('file.json',function(err,data){
 		let user= JSON.parse(data)
 		var deleteStatus=0
 		user.forEach(function(data,index){
 			if(data.id==req.params.id){
 				deleteStatus=1
 				user.splice(index,1);
 			}
 		})
 		fs.writeFile('file.json', JSON.stringify(user), (err) => {
 			if(err) throw (err)
 			if(deleteStatus==0){
 				return res.json({status:"200",message:"item not found"})
 			}else{
 				return res.json({status:"200",message:"success"}) 				
 			}
 		})
 	})
})

app.put('/:id',function(req,res){
	console.log(req,"*****")
	fs.readFile('file.json',function(err,data){
		var data =JSON.parse(data)		
		data.forEach(function(data){
			if(data.id==req.params.id){
				data.fname=req.body.fname
				data.lname=req.body.lname
				data.addrss=req.body.addrss
			}
		})
		fs.writeFile('file.json',JSON.stringify(data),function(err,data){
			if(err) throw (err)
			res.json({status:200,message:"Successful"})
		})
	})
})

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})