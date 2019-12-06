const express = require('express')
const app = express()
var allUsers=[]


//set the template engine ejs
app.set('view engine', 'ejs')

//middlewares
app.use(express.static('public'))


//routes
app.get('/', (req, res) => {
    res.render('index')
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
    })

    //listen on new_message
    socket.on('new_message', (data) => {
        allUsers.push(socket.username)
        console.log(allUsers,"Push Arrray")
        io.sockets.emit('allUsers', {allUsers});
        io.sockets.emit('new_message', {message : data.message, username : socket.username});
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
