const socket = new WebSocket('wss://zi-node-chat.herokuapp.com');

let chatHistory = [];
let currentUser;

socket.addEventListener('open', function (event) {
    console.log("connection open");
});

socket.addEventListener('message', function (event) {
    parseData(event.data)
});

function parseData(data){
    let parsedData = JSON.parse(data);

    if(parsedData.type === "history"){
        chatHistory = parsedData.data;
    }else if(parsedData.type === "message"){
        chatHistory.push(parsedData);
    }else if(parsedData.type === "color"){
        currentUser = parsedData;
    }
}

function sendData(data) {
    socket.send(data)
}

