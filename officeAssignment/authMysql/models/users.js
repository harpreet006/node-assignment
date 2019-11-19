var db =require('../connection')
users = {	
	findAllUser:function(callback){
		return db.query("select * from users",callback)
	},
	findAllUserById:function(id,callback){
		return db.query(`select * from users where id=${id}`,callback)
	},
	userLogin:function(username,password,callback){
		// console.log(`select * form users where name='${username}' and password='${password}'`)
		return db.query(`select * from users where name='${username}' and password='${password}'`,callback)
	},
	saveUser:function(req,callback){		
		return db.query(`insert into users (name,password,status) VALUES('${req.fname}','${req.password}',1)`,callback)
	}
}
module.exports=users