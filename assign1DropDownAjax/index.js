var mysql = require('mysql');
var path = require('path');
const express = require('express')
const app = express()
var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "ourdesignz",
  database: "assign1",
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

app.get('/',function(req,res){
	sql="select * from country"
	con.query(sql,function(err,selresponce){
		if(err)	res.send({status:false,result:'check your connection'})
		var ary=''
		if(selresponce){			
			ary=selresponce
		}
		res.render('option',{options:ary})
	})
})
app.post('/save',function(req,res){
	let sql="insert into country (name)VALUES('"+req.body.datakey+"')"
	con.query(sql,function(err,responce){
		if(err){
			res.send({status:true,result:'please check you connectio'})
		}
		if(responce){
			sql="select * from country"
			con.query(sql,function(err,selresponce){
				if(err){
					res.send({status:false,result:'check your connection'})
				}
				if(selresponce){
					var ary='' 
					for(let l=0;l<selresponce.length;l++){
						ary +='<option value="'+selresponce[l].name+'">'+selresponce[l].name+'</option>'
					}
					res.send({status:true,result:ary})
				}else{
					res.send({status:false,result:'result not found'})
				}
			})
		}else{
			res.send({status:false,result:'data not inserted'})			
		}
	})	
})
app.post('/delete',function(req,res){
	sql="delete from country where name='"+req.body.datakey+"'"
	//console.log(sql)
	con.query(sql,function(err,responce){
		if(err){
			res.send({status:false,result:"check your connection"})
		}
		if(responce){
			sql="select * from country"
			con.query(sql,function(err,selresponce){
				if(err){
					res.send({status:false,result:'check your connection'})
				}
				if(selresponce){
					var ary='' 
					for(let l=0;l<selresponce.length;l++){
						ary +='<option value="'+selresponce[l].name+'">'+selresponce[l].name+'</option>'
					}
					res.send({status:true,result:ary})
				}else{
					res.send({status:false,result:'data not found'})
				}
			})			
		}else{
			res.send({status:false,result:'no record cound'})
		}
	})
})
app.listen(3000);