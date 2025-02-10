const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const { Client } = require('pg');
const fileRoutes = require('./src/routes/fileRoutes');

const app = express();
const PORT = 3000;

// Express Middleware
app.use(cors());
app.use(express.json());

// Mount routes
app.use('/api', fileRoutes);

// Create HTTP server
const server = http.createServer(app);

// Create WebSocket server attached to HTTP server
const wss = new WebSocket.Server({ server });

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
pgClient.query('LISTEN file_updates');

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

    ws.on('close', () => console.log('Client disconnected'));
    ws.on('error', (err) => console.error('WebSocket Error:', err));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`WebSocket server running on ws://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing server');
    server.close(() => {
        console.log('HTTP/WebSocket server closed');
    });
    pgClient.end(() => {
        console.log('PostgreSQL connection closed');
    });
});

module.exports = app;