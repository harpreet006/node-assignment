var mysql = require('mysql');
var conn = mysql.createConnection({
	host:"localhost",
	user:"root",
	password:"",
	database:"node_crud_1"
})
exports.setconn=conn