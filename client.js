//Remember to add your site address
var socket = io.connect("YOURSITE:8000/");

//sending messages
function sendMessage(){ 
	var data = document.getElementById("chatmessage").value;
	document.getElementById("chatmessage").value = '';
    socket.emit('chat', data);
};

//changing name
function changeName(){ 
	var data = document.getElementById("chatname").value;
	document.getElementById("chatname").value = '';
    socket.emit('changename', data);
};

//getting name from server
socket.on('name', function(msg){
document.getElementById("name").innerHTML = ("Your chat name is: " + msg);	
});

//getting the number of online players
socket.on('online', function(msg){
document.getElementById("onlinechatters").innerHTML = ("People online: " + msg);	
});

//getting message from server
socket.on('chat', function(msg){
var time = new Date();
document.getElementById("chat").innerHTML = ("<br><p>" + addZero(time.getHours()) + ":" + addZero(time.getMinutes()) + " " + msg + "</p" + document.getElementById("chat").innerHTML);	
});

//function to show timestamps correctly
function addZero(i) {
	if (i < 10) {
		i = "0" + i;
	}
	return i;
}