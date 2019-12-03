const connection = require('../model/connection');
const conn=connection.setconn
console.log(conn)
var func = {
    sayhi: function(id,key) {
    	//return conn.query(`SELECT * FROM node_options WHERE user_id = ${id} && key = '${key}'`)        
    }, 
    foo: function(date) {
        //do somethings
    }    
};
module.exports = func;