document.getElementById('send-btn').addEventListener('click', function() {
    const inputField = document.getElementById('input-field');
    const messageBox = document.getElementById('message-box');
  
    // Get the message from input field
    const message = inputField.value.trim();
  
    // Check if message is not empty
    if (message) {
      // Display the message in the message box
      const messageElement = document.createElement('div');
      messageElement.textContent = `You: ${message}`;
      messageBox.appendChild(messageElement);
  
      // Optionally, you can send the message to others (through WebSocket or a server)
      // If using WebSocket, you can send the message to the server here.
      // socket.emit('chatMessage', message);
  
      // Clear the input field after sending the message
      inputField.value = '';
    } else {
      alert('Please type a message before sending.');
    }
  });
  
  // If you are using WebSocket, you can listen for incoming messages and display them like this:
  const socket = io(); // Assuming you're using socket.io for chat functionality
  
  socket.on('chatMessage', (message) => {
    const messageBox = document.getElementById('message-box');
    const messageElement = document.createElement('div');
    messageElement.textContent = `Friend: ${message}`;
    messageBox.appendChild(messageElement);
  });
  