const  setconnetion = require('./connection');
var conn=setconnetion.setconn 
module.exports = {
  getcountry: function (callback) {
    var sql = "select * from countries";
    conn.query(sql, function(err, responce){
      if(err) callback(null,false);
      return callback(null,responce);
    });
  },
/*  getstates:function(callback){
    sql='select * from states'
    conn.query(sql,function(err,responce){
      if(err){
        callback(null,false)
        console.log('This is error callback function')
      }
      if(responce){
        callback(null,responce)
        console.log("This is responce callback function")
      }else{
        callback(null,false)
        console.log('record not found')
      }
    })
  },
  getcitys:function(callback){
    sql="select * from cities"
    conn.query(sql,function(err,responce){
      if(err){
        callback(null,false)
      }
      if(responce){
        callback(null,responce)
        console.log('get the record')
      }else{
        callback(null,false)
        console.log('record not found')
      }
    })
  },*/
  farewell: function(callback) {
  	var sql = "select * from states";
  	conn.query(sql,function(err,responce){
  		if(err) callback(null,false)
  		if(responce)
  			callback(null,responce)
  		else
  			callback(null,false)
  	})
  }
}