
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
	var allUserId = $("#allusers")
	var delt = $(".delt")

	$(document).on('click','.delt' ,function(event){
		if($(this).parent()[0]){
			$(this).parent()[0].remove()
		}
	})


	//Emit message

	var input = document.getElementById("message"); 
	input.addEventListener("keyup", function(event) {
	if (event.keyCode === 13) {
			messageclick()			 
		}

	});


	send_message.click(function(){
		messageclick()
	})



	function messageclick(){
		if($.trim(username.val())==""){
			username.focus().attr("placeholder","Enter the Username First")
			return false	
		}
		socket.emit('new_message', {message : message.val()})
	}

	//Listen on new_message
	socket.on("new_message", (data) => {
		feedback.html('');
		message.val('');
		console.log('***&*')
		chatroom.append("<p class='message'>" + data.username + ": " + data.message + " <b class='delt'> Delete for me </b></p>")
	}) 

		//Listen on new_message
	socket.on("allUsers", (data) => {
		console.log('*&*& Accepted')
		let userdata=data.allUsers
		let	hj=[]		
		userdata.forEach(function(value){
			hj +='<p>'+value+'</p>'
		})
		console.log("Accepted action")
		allUserId.html(hj)
	})	

	//Emit a username
	send_username.click(function(){
		const usernameGet=username.val()
		if($.trim(usernameGet)==""){
			username.focus().attr("placeholder","Enter the Username First")
			return false
		}
		socket.emit('change_username', {username : username.val()})
	})

	//Emit typing
	message.bind("keypress", () => {
		console.log("welcome")
		socket.emit('typing')
	})



	//Emit typing
	message.bind("focusout", () => {
		socket.emit('typingout')
	})
	

	//Listen on typing
	socket.on('out', (data) => {
		feedback.html('')
	})

	//Listen on typing
	socket.on('typing', (data) => {
		feedback.html("<p><i>" + data.username + " is typing a message..." + "</i></p>")
	})
});


