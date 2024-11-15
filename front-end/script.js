const socket = new WebSocket(`ws://${location.host}`);
let clientId;

// Store the client’s unique ID
socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'id') {
        clientId = data.id;
        document.getElementById('client-id').textContent = `Your ID: ${clientId}`;
    } else if (data.type === 'message') {
        displayMessage(`Message from ${data.from}: ${data.message}`);
    }
};

const displayMessage = (message) => {
    const li = document.createElement('li');
    li.textContent = message;
    document.getElementById('messages').appendChild(li);
};

document.getElementById('sendButton').addEventListener('click', () => {
    const targetId = document.getElementById('targetId').value;
    const message = document.getElementById('messageInput').value.trim();

    if (targetId && message) {
        // Send a direct message to the target client
        socket.send(JSON.stringify({
            type: 'direct_message',
            targetId,
            message
        }));
    }
});
