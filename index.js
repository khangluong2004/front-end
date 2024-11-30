// State values
var connection = null;


// Button functions
function connect(){
    // Close old connection before open new one
    if (connection !== null){
        connection.close();
    }

    let url = document.getElementById("serverUrl").value;
    connection = new WebSocket(url);
    console.log(connection)
    console.log("Start listening");
    
    connection.onopen = (event) => {
        console.log("Open connection successful!");
    }

    connection.onmessage = (event)=>{
        recordResponse(event.data);
        recordState(event.data);
    }
}

function sendRequest(){
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
    } else if (type == "retrieveSummary"){
        createOrderTable(data["value"]);
    }
}

// Interval polling
function getBalance(){
    if (connection == null){
        return;
    }

    if (connection.readyState != WebSocket.OPEN){
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

// Create order table
function getOrderSummary(){
    if (connection == null){
        return;
    }

    if (connection.readyState != WebSocket.OPEN){
        return;
    }

    msg = {
        "messageType": "retrieveSummary",
    }

    // console.log(msg);
    connection.send(JSON.stringify(msg));
}

function createOrderTable(summaryObj){
    let table = document.getElementById("orderBook");
    table.innerHTML = "";

    let headerRow = table.insertRow(0);
    headerRow.insertCell(0).outerHTML = "<th>Buy Volume</th>";
    headerRow.insertCell(1).outerHTML = "<th>Price</th>";
    headerRow.insertCell(2).outerHTML = "<th>Sell Volume</th>";

    let buySide = summaryObj["buySide"];
    let sellSide = summaryObj["sellSide"];

    let combined = [];
    for (let i=0; i < buySide.length; i+=2){
        combined.push([buySide[i], buySide[i+1], 1]);
    }

    for (let i=0; i < sellSide.length; i+=2){
        combined.push([sellSide[i], sellSide[i+1], -1]);
    }

    combined.sort((a, b) => (b[0] - a[0]));

    for (let i=0; i < combined.length; i++){
        let row = table.insertRow(i + 1);
        let buy = row.insertCell(0);
        row.insertCell(1).innerHTML = combined[i][0];
        let sell = row.insertCell(2);
        if (combined[i][2] == 1){
            buy.innerHTML = combined[i][1];
        } else {
            sell.innerHTML = combined[i][1];
        }
        
    }

}

window.setInterval(() => {
    getBalance();
    getOrderSummary();
}, 1000);

