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
    }
}

function sendEcho(){
    const msg = {
        "messageType": document.getElementById("msgType").value, 
        "ticker": document.getElementById("ticker").value,
        "price": document.getElementById("price").value
    }

    connection.send(JSON.stringify(msg));
    console.log("Finish sending echo");
}

function retrieveOrder(){
    const msg = {
        "messageType": "retrieveOrder"
    }

    connection.send(JSON.stringify(msg));
}

// Listening events support functions
function recordResponse(data){
    document.getElementById("response").innerHTML = data;
}
