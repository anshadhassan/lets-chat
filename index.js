import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Store clients with unique IDs
const clients = new Map();

wss.on('connection', (ws) => {
    // Generate a unique client ID
    const clientId = uuidv4();
    clients.set(clientId, ws);

    // Send the client their unique ID
    ws.send(JSON.stringify({ type: 'id', id: clientId }));

    // Handle messages from clients
    ws.on('message', (message) => {
        const data = JSON.parse(message);

        // Check for a direct message request
        if (data.type === 'direct_message') {
            const targetClient = clients.get(data.targetId);
            if (targetClient) {
                targetClient.send(JSON.stringify({
                    type: 'message',
                    from: clientId,
                    message: data.message,
                }));
            } else {
                ws.send(JSON.stringify({ error: 'User not found.' }));
            }
        }
    });

    ws.on('close', () => {
        clients.delete(clientId);
    });
});

app.use(express.static('front-end'));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
