const  setconnetion = require('./connection');
var conn=setconnetion.setconn 
module.exports = { 
  getLogin:function(req,callback){
    return conn.query(`select * from users where email='${req.username}'`,callback)
  },
  checkUserExist:function(req,callback){
    return conn.query(`select * from users where email='${req.body.email}'`,callback)
  },
  savedata:function(req,callback){
    return conn.query(`insert into users(name,email,category,radio,checkbox,textarea,password,file,state,city,country)VALUES('${req.body.name}','${req.body.email}','${req.body.category}','${req.body.radio}','${req.body.checkbox}','${req.body.textarea}','${req.body.password}','${req.files.file.name}','${req.body.state}','${req.body.city}','${req.body.country}')`,callback)
  } 
   
}