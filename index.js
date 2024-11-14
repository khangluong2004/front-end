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
        recordResponse(event.data);
    }
}

function sendEcho(){
    const msg = {
        "messageType": "echo", 
        "ticker": "newOne",
        "price": 11.5
    }

    connection.send(JSON.stringify(msg));
}

// Listening events support functions
function recordResponse(data){
    document.getElementById("response").innerHTML = data;
}
