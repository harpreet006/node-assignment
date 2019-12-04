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
    conn.query("delete from `node_options` where user_id=1")
    let comMon = new Promise((resolve,reject)=>{
      Object.keys(req.files).forEach(function(key1,values){
       conn.query("insert into `node_options` (`user_id`,`key`,`values`) VALUES('1','"+req.files[key1][0].fieldname+"','"+req.files[key1][0].filename+"')")
      })
      Object.keys(req.body).forEach(function(key){
        if(req.body[key] !="" && key !="savesetting"){
          conn.query("insert into `node_options` (`user_id`,`key`,`values`) VALUES('1','"+key+"','"+req.body[key]+"')")
        }
      })
      resolve(true)
    })
    comMon.then(res=>{
      return callback(null,res)
    }).catch(err=>{
      return callback('Not inserted','')
    })
  },
  getsettings:function(userid,callback){
    return conn.query("select * from node_options",callback)
  },
  getNodeValue:function(nodeAry,callback){
    return conn.query("select * from `node_options` where `user_id` = "+nodeAry[0]+"  and `key` = '"+nodeAry[1]+"'",callback)
  }
}