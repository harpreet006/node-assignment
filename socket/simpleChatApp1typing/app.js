const express = require('express')
const app = express()
var allUsers=[]
var storeMessage=[]
var fs = require('fs');
var uniqid = require('uniqid');


//set the template engine ejs
app.set('view engine', 'ejs')

//middlewares
app.use(express.static('public'))


//routes
app.get('/', (req, res) => {

    fs.readFile('saveChat.txt',function(err, data) {
        if (err) throw err;
        if(data){
            let jsonparse=JSON.parse(data)             
            jsonparse.forEach(function(data,key){
                console.log(data.msg,key,"&***********")
            })
            // console.log(jsonparse.id)
        }
    });


    res.render('index',{allUsers:allUsers})
    io.sockets.emit('allUsers', {allUsers});
})

//Listen on port 3000
server = app.listen(3000)



//socket.io instantiation
const io = require("socket.io")(server)


//listen on every connection
io.on('connection', (socket) => {
    console.log('New user connected')

    //default username
    socket.username = "Anonymous"

    //listen on change_username
    socket.on('change_username', (data) => {
        socket.username = data.username
        allUsers.push(socket.username)
        io.sockets.emit('allUsers', {allUsers});
    }) 
    //listen on new_message
    socket.on('new_message', (data) => {
        storeMessage.push({'id':uniqid(),'msg':data.message})
        io.sockets.emit('new_message', {message : data.message, username : socket.username});
        fs.writeFile('saveChat.txt', JSON.stringify(storeMessage), function (err) {
            if (err) throw err;
            console.log('Saved!');
        });        
    })
    // console.log(messagepush,"Arrray puch")

    //listen on typing
    socket.on('typing', (data) => {
        console.log("welcome")
    	socket.broadcast.emit('typing', {username : socket.username})
    })

     //listen on typing
    socket.on('typingout', (data) => {
        console.log("byeeeeeeeeeee")
        socket.broadcast.emit('out')
    })
})
