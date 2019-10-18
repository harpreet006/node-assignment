const  setconnetion = require('./connection');
var conn=setconnetion.setconn
module.exports = function(req, res){
	var sql = "select * from user";
	conn.query(sql, function(err, responce){
		if(err) throw err;
		return "hiiiiiiii";
	});
}