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
    return conn.query(`insert into users(name,email,category,radio,checkbox,textarea,password,file,state,city,country)VALUES('${req.body.name}','${req.body.email}','${req.body.category}','${req.body.radio}','${req.body.checkbox}','${req.body.textarea}','${req.body.password}','${req.file.filename}','${req.body.state}','${req.body.city}','${req.body.country}')`,callback)
  },
  updateUser:function(req,callback){
  	return conn.query(`UPDATE users SET name = '${req.body.name}', email = '${req.body.email}', category='${req.body.email}',radio='${req.body.radio}',checkbox='${req.body.checkbox}', textarea='${req.body.textarea}',password='${req.body.password}',file='${req.file.filename}',state='${req.body.state}',city='${req.body.city}',country='${req.body.country}' WHERE id ='${req.body.id}'`,callback)
  },
  getalluser:function(req,callback){
  	return conn.query(`select * from users`,callback)
  },
  getuserLimit:function(req,parmId,callback){
  	return conn.query(`select * from users LIMIT ${parmId}, 10`,callback)
  },
  saveoptions:function(req,callback){
    Object.keys(req.body).forEach(function(key){
      if(req.body[key] !=""){
        return conn.query("insert into `node_options` (`user_id`,`key`,`values`) VALUES('"+req.user.user_id+"','"+key+"','"+req.body[key]+"')")
      }
    })
  }  
   
}