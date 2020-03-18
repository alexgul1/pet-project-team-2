const socket = new WebSocket('wss://zi-node-chat.herokuapp.com');
let containerChat = document.querySelector('.chat-container');
let sendButton = document.getElementsByClassName('send-message');
let userField = document.getElementsByClassName('user__name');
let messageField = document.getElementsByClassName('user__message');

let chatHistory = null;
let currentUser = null;
let nickname = "";

socket.addEventListener('open', function (event) {
    console.log("connection open");
});

socket.addEventListener('message', function (event) {
    parseData(event.data);
});

function parseData(data){
    let parsedData = JSON.parse(data);

    if(parsedData.type === "history"){
        chatHistory = parsedData.data;
        getChatHistory();
    }else if(parsedData.type === "message"){
        chatHistory.push(parsedData.data);
        addIncomingMessage(parsedData.data)
    }else if(parsedData.type === "color"){
        currentUser = parsedData;
        userField[0].innerHTML = nickname;
        userField[0].style.color = currentUser.data;
    }
}

function sendData(data) {
    socket.send(data)
}


function getChatHistory() {
    //debugger
    for(let i = 0; i < chatHistory.length; i++) {
        let time = new Date(chatHistory[i].time);
        const chatMessage = document.createElement('div')
        const spanAuthor = (`<span style="color: ${chatHistory[i].color}">${chatHistory[i].author}</span>`)
        chatMessage.innerHTML = `${spanAuthor} @ ${time.getHours()}:${time.getMinutes()} : ${chatHistory[i].text}`
        containerChat.prepend(chatMessage);
    }
}


function addIncomingMessage(message) {
    debugger
    let time = new Date(message.time);
    let chatMessage = document.createElement('div')
    let spanAuthor = (`<span style="color: ${message.color}">${message.author}</span>`)
    chatMessage.innerHTML = `${spanAuthor} @ ${time.getHours()}:${time.getMinutes()} : ${message.text}`
    containerChat.prepend(chatMessage);
}

sendButton[0].addEventListener('click', () => {
    if(nickname ===""){
        nickname = messageField[0].value;
    }
    sendData(messageField[0].value);
    messageField[0].value = "";
});

