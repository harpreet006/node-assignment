var mysql = require('mysql');
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "ourdesignz",
  database:"assignment_1"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
module.exports=con