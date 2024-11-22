// State values
var connection = null;


// Button functions
function connect(){
    // Close old connection before open new one
    if (connection !== null){
        connection.close();
    }

    connection = new WebSocket("ws://localhost:8080");
    console.log("Start listening");
    
    connection.onopen = (event) => {
        console.log("Open connection successful!");
    }

    connection.onmessage = (event)=>{
        console.log(event.data);
        recordResponse(event.data);
        recordState(event.data);
    }
}

function retrieveOrder(){
    const msg = {
        "messageType": "retrieveOrder"
    }

    connection.send(JSON.stringify(msg));
}

function sendOrder(){
    const msg = {
        "messageType": document.getElementById("msgType").value,
        "userId": document.getElementById("userId").value,
        "orderId": document.getElementById("orderId").value,
        "ticker": document.getElementById("ticker").value,
        "price": parseInt(document.getElementById("price").value),
        "amount": parseInt(document.getElementById("amount").value),
        "sell": (document.getElementById("sell").value == "true") ? true:false
    };

    console.log(msg);

    connection.send(JSON.stringify(msg));
}

// Listening events support functions
function recordResponse(data){
    document.getElementById("response").innerHTML = data;
}

function recordState(dataStr){
    let data = JSON.parse(dataStr)
    if (!("messageType" in data)){
        return;
    }

    let type = data["messageType"];
    
    if (type == "getBalance"){
        document.getElementById("myBalance").innerHTML = data["value"];
    }
}

// Interval polling
function getBalance(){
    if (connection == null){
        return;
    }

    let userId = document.getElementById("userId");
    if (userId == null || userId.value == ""){
        return;
    }

    msg = {
        "messageType": "getBalance",
        "userId": userId.value
    }

    // console.log(msg);
    connection.send(JSON.stringify(msg));
}

window.setInterval(() => {
    getBalance();
}, 1000);