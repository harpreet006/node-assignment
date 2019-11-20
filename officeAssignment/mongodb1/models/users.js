var UserObj =require('../schema/user') 
var user =new UserObj()
users = {
	findAllUser:function(callback){
		//return db.query("select * from users",callback)
	},
	findAllUserById:function(id,callback){
		//return db.query(`select * from users where id=${id}`,callback)
	},
	userLogin:function(username,password,callback){
		// console.log(`select * form users where name='${username}' and password='${password}'`)
		//return db.query(`select * from users where name='${username}' and password='${password}'`,callback)
	},
	saveUser:function(require){

		user.name="dfsdf",
		user.password="password"
		user.save(function(err,responce) {
		if (err){
			console.log("Cause error")
		}  	
		if(responce){
			console.log('User saved successfully!');  	
		}
		});
	},checkUserExist:function(req,callback){
		//return db.query(`select * from users where name='${req.fname}'`,callback)
	}
}
module.exports=users