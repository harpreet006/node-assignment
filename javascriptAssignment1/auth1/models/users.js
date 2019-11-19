var allusers = {
	getallUser:function(callback){
		return db.query("select * from users",callback);
	},
	singleUser:function(callback){
		return db.query(`select * from users where id=${user.id}`)
	}
}
module.exports=allusers