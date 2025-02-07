const WebSocket = require('ws');
const { Client } = require('pg');

const wss = new WebSocket.Server({ port: 8080 });

// Connect to PostgreSQL
const pgClient = new Client({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'database_development',
    password: 'ultimatetc123',
    port: 5432,
});

pgClient.connect();

// Listen for file changes
pgClient.query('LISTEN file_changes');

pgClient.on('notification', (msg) => {
    const change = JSON.parse(msg.payload);
    console.log('File table changed:', change);

    // Send data to all connected WebSocket clients
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(change));
        }
    });
});

wss.on('connection', (ws) => {
    console.log('Client connected');
    ws.send(JSON.stringify({ message: "Connected to WebSocket server" }));
});

console.log('WebSocket server running on ws://localhost:8080');
