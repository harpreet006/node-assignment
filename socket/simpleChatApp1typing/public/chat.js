
$(function(){
   	//make connection
	var socket = io.connect('http://localhost:3000')

	//buttons and inputs
	var message = $("#message")
	var username = $("#username")
	var send_message = $("#send_message")
	var send_username = $("#send_username")
	var chatroom = $("#chatroom")
	var feedback = $("#feedback")
	var allUser = $("#allUser")

	//Emit message
	send_message.click(function(){
		socket.emit('new_message', {message : message.val()})
	})

	//Listen on new_message
	socket.on("new_message", (data) => {
		feedback.html('');
		message.val('');
		console.log('***&*')
		chatroom.append("<p class='message'>" + data.username + ": " + data.message + "</p>")
	})

		//Listen on new_message
	socket.on("allUsers", (data) => {		
		let userdata=data.allUsers
		let	hj=[]		
		userdata.forEach(function(value){
			hj +='<p>'+value+'</p>'
		})
		console.log(hj)
	})

	

	//Emit a username
	send_username.click(function(){
		socket.emit('change_username', {username : username.val()})
	})

	//Emit typing
	message.bind("keypress", () => {
		console.log("welcome")
		socket.emit('typing')
	})



	//Emit typing
	message.bind("focusout", () => {
		console.log("byeeeeeeeee1111111111")
		socket.emit('typingout')
	})
	

	//Listen on typing
	socket.on('out', (data) => {
		console.log("211321323e")
		feedback.html('')
	})

	//Listen on typing
	socket.on('typing', (data) => {
		feedback.html("<p><i>" + data.username + " is typing a message..." + "</i></p>")
	})
});


