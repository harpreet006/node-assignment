var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
<<<<<<< HEAD
  password: "ourdesignz",
  database:'assign2Routes'
=======
  password: "",
  'database':'assign2Routes'
>>>>>>> 381b1d401286587f75047560e258be15dd2fe27b
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
module.exports=con

