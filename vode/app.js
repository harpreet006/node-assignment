var express = require("express");
var app = new express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var fs=require('fs')
var uniqid = require('uniqid');
const path = 'sample.mp4'
var port = process.env.port || 3000;

app.use(express.static(__dirname + "/public" ));

app.get('/',function(req,res){
res.redirect('index.html');
});


io.on('connection',function(socket){

    socket.on('stream',function(image){
        socket.broadcast.emit('stream',image);
        var res = image.split(","); 
        var vcodefile=res[1]
        console.log(res[1],"***********<br />")
        vcodefile = vcodefile.replace(/^data:(.*?);base64,/, ""); // <--- make it any type
		vcodefile = vcodefile.replace(/ /g, '+'); // <--- this is important
		fs.writeFile('test.mp4', vcodefile, 'base64', function (err) {
		if(err){
			console.log('error log gernated',err)
		}
			console.log('Saved!');
		
		});

	 

    });

});

http.listen(port,function(){
console.log("Server running at port "+ port);
});