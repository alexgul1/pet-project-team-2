let socket = new WebSocket('wss://zi-node-chat.herokuapp.com');
let containerChat = document.querySelector('.chat-container');
let sendButton = document.getElementById('send-message');
let userField = document.getElementById('user__name');
let messageField = document.getElementById('user__message');

let chatHistory = null;
let currentUser = null;
let nickname = "";


socket.addEventListener('open', function (event) {
    console.log("connection open");
    messageField.disabled = false;
    clearInterval()
});

socket.addEventListener('message', function (event) {
    parseData(event.data);
});

socket.addEventListener('error', function (event) {
    console.log(event);
    userField.innerHTML = "Error";
    messageField.disabled = true;
    setInterval(() => { socket = new WebSocket('wss://zi-node-chat.herokuapp.com') }, 500)

});

window.addEventListener('offline', function(e)
    { userField.innerHTML = "Connection error";
        messageField.disabled = true;
        console.log(e)});

window.addEventListener('online', function(e)
    { userField.innerHTML = nickname;
        messageField.disabled = false;
        console.log(e)});

function parseData(data){
    let parsedData = JSON.parse(data);

    if(parsedData.type === "history"){
        chatHistory = parsedData.data;
        getChatHistory();
    }else if(parsedData.type === "message"){
        chatHistory.push(parsedData.data);
        addMessage(parsedData.data)
    }else if(parsedData.type === "color"){
        currentUser = parsedData;
        userField.innerHTML = nickname;
        userField.style.color = currentUser.data;
    }
}

function sendData(data) {
    socket.send(data)
}


function getChatHistory() {
    for(let i = 0; i < chatHistory.length; i++) {
        addMessage(chatHistory[i])
    }
}



function keyDetect(key) {
    if(key.code === "Enter"){
        sendMessage()
    }
}

function addMessage(message) {
    let time = new Date(message.time);
    let chatMessage = document.createElement('div');
    let spanAuthor = (`<span style="color: ${message.color}">${message.author}</span>`);
    chatMessage.innerHTML = `${spanAuthor} @ ${time.getHours()}:${time.getMinutes()} : ${message.text}`;
    containerChat.prepend(chatMessage);
}

function sendMessage(){
    if(messageField.value.trim() !== ""){
        if(nickname.trim() === ""){
            nickname = messageField.value;
        }
        sendData(messageField.value);
        messageField.value = "";
    }
}

sendButton.addEventListener('click', sendMessage);
messageField.addEventListener('keypress', keyDetect);