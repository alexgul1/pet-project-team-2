const socket = new WebSocket('wss://zi-node-chat.herokuapp.com');
let containerChat = document.querySelector('.chat-container');
let sendButton = document.getElementsByClassName('send-message');
let userField = document.getElementsByClassName('user-field');
let messageField = document.getElementsByClassName('message-field');

let chatHistory = [];
let currentUser;

socket.addEventListener('open', function (event) {
    console.log("connection open");
});

socket.addEventListener('message', function (event) {
    parseData(event.data)
    getChatHistory()
});

function parseData(data){
    let parsedData = JSON.parse(data);

    if(parsedData.type === "history"){
        chatHistory = parsedData.data;
    }else if(parsedData.type === "message"){
        chatHistory.push(parsedData);
        addIncomingMessage(parsedData)
    }else if(parsedData.type === "color"){
        currentUser = parsedData;
    }
}

function sendData(data) {
    socket.send(data)
}


function getChatHistory() {
    debugger
    for(let i = 0; i < chatHistory.length; i++) {
        const chatMessage = document.createElement('div')
        const spanAuthor = (`<span style="color: ${chatHistory[i].color}">${chatHistory[i].author}</span>`)
        chatMessage.innerHTML = `${spanAuthor} @ ${chatHistory[i].time} : ${chatHistory[i].text}`
        containerChat.append(chatMessage);
    }
}


function addIncomingMessage(message) {
    debugger
    const chatMessage = document.createElement('div')
    const spanAuthor = (`<span style="color: ${message.color}">${message.author}</span>`)
    chatMessage.innerHTML = `${spanAuthor} @ ${message.time} : ${message.text}`
    containerChat.append(chatMessage);
}

sendButton.addEventListener('click', () => {
    if(userField.value) {

    }
    if(messageField.value) {

    }
})

