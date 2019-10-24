var db=require('../dbconnection')

var Tasks={
	getAllTasks:function(callback){
		return db.query('select * from user_details',callback)
	},
	getTaskById:function(id,callback){
		return db.query('select * from user_details where user_id=?',[id],callback)
	},
	addTask:function(Task, callback){
		return db.query("insert into user_details (username, first_name, last_name,gender,password,status) values(?,?,?,?,?,?)",[Task.username,Task.f_name,Task.l_name,Task.gender,Task.password,1],callback)
	},
	deleteTask:function(id,callback){
		return db.query('delete from user_details where user_id=?',[id],callback)
	},
	editTask:function(id,callback){
		return db.query('select * from user_details where user_id=?',[id],callback)
	},
	saveEditTask:function(Editsave,callback){
		console.log("update user_details set username='"+Editsave.username+"',first_name='"+Editsave.f_name+"',last_name='"+Editsave.l_name+"',gender='"+Editsave.gender+"',password='"+Editsave.password+"' where user_id='"+Editsave.user_id+"'")

		return db.query("update user_details set username='"+Editsave.username+"',first_name='"+Editsave.f_name+"',last_name='"+Editsave.l_name+"',gender='"+Editsave.gender+"',password='"+Editsave.password+"' where user_id='"+Editsave.user_id+"'",callback)
	}
}
module.exports=Tasks;