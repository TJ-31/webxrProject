const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    console.log('Client connected');
    ws.on('message', (message) => {
        console.log('Received:', message);
        // Handle received messages if needed
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

console.log('WebSocket server started on port 8080');
