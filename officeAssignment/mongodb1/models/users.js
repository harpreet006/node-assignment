var UserObj =require('../schema/user') 
var user = new UserObj()
users = {
	findAllUser:function(callback){
		return UserObj.find(callback)
	},
	findAllUserById:function(id,callback){
		//return db.query(`select * from users where id=${id}`,callback)
	},
	userLogin:function(username,password,callback){
		UserObj.find({name:username},function(err,responcedata){
			if(err){
				console.log('development userLogin()')
			}
			if(responcedata.length){
				if(responcedata[0].password===password){
					callback(null,{status:true,data:responcedata})
				}else{
					callback(null,{status:false,message:'Password not matched'})					
				}
			}else{ 
				callback(null,{status:false,message:'User and Password Not matched'})
			}
		});
		// console.log(`select * form users where name='${username}' and password='${password}'`)
		//return db.query(`select * from users where name='${username}' and password='${password}'`,callback)
	},
	saveUser:function(req,callback){		
		user.name=req.fname,
		user.password=req.password
		return user.save(callback)
	},checkUserExist:function(req,callback){
		//return db.query(`select * from users where name='${req.fname}'`,callback)
	}
}
module.exports=users