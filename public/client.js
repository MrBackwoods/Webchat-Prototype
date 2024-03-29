// Remember to add your socket address
const socket = io.connect("localhost:8080/");

// Function to send messages
function sendMessage() {
    const data = document.getElementById("chatmessage").value;
    if (data.trim() !== '') {
        document.getElementById("chatmessage").value = '';
        socket.emit('chat', data);
    }
}

// Function to change name
function changeName() {
    const data = document.getElementById("chatname").value;
    if (data.trim() !== '') {
        document.getElementById("chatname").value = '';
        socket.emit('changeName', data);
    }
}

// Update chat name when received from the server
socket.on('name', (msg) => {
    document.getElementById("name").innerHTML = "Your chat name is: " + msg;
});

// Update online users count when received from the server
socket.on('online', (msg) => {
    document.getElementById("onlinechatters").innerHTML = "People online: " + msg;
});

// Append chat messages with timestamps
socket.on('chat', (msg) => {
    const time = new Date();
    const chatDiv = document.getElementById("chat");
    chatDiv.innerHTML = `<br><p>${addZero(time.getHours())}:${addZero(time.getMinutes())} ${msg}</p>` + chatDiv.innerHTML;
});

// Function to format time with leading zeros
function addZero(i) {
    return i < 10 ? "0" + i : i;
}

// Add your event listeners 
document.addEventListener("DOMContentLoaded", function () {

    document.getElementById("chatmessage").addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });

    document.getElementById("chatname").addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            changeName();
        }
    });

    document.getElementById("sendMessageButton").addEventListener("click", sendMessage);
    document.getElementById("nameButton").addEventListener("click", changeName);
});





