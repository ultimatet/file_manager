const express = require('express');
const cors = require('cors');
const http = require('http');
const { Client } = require('pg');
const fileRoutes = require('./src/routes/fileRoutes');

const app = express();
const PORT = 3001;

// Express Middleware
app.use(cors());
app.use(express.json());

// Add this before app.use('/api', fileRoutes);
app.use((req, res, next) => {
    console.log('Request received:', {
        method: req.method,
        url: req.url,
        path: req.path,
        body: req.body
    });
    next();
});
// Mount routes
app.use('/api', fileRoutes);
console.log('Routes mounted at /api');

// Create HTTP server
const server = http.createServer(app);

// Connect to PostgreSQL
const pgClient = new Client({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'database_development',
    password: 'ultimatetc123',
    port: 5432,
});

pgClient.connect()
    .then(() => console.log("✅ Successfully connected to PostgreSQL"))
    .catch(err => console.error("❌ PostgreSQL connection error:", err));

// Listen for file changes using PostgreSQL NOTIFY
pgClient.query('LISTEN file_updates', (err, res) => {
    if (err) {
        console.error("❌ Error listening to file_updates:", err);
    } else {
        console.log("🔔 Listening for file_updates...");
    }
});

// Event listener for file changes
pgClient.on('notification', async (msg) => {
    console.log('🔄 File table updated:', msg.payload);
});

// API Route for fetching files after insert/update
app.get('/api/file', async (req, res) => {
    try {
        const result = await pgClient.query('SELECT * FROM files ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('❌ Error fetching files:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing server');
    server.close(() => {
        console.log('HTTP server closed');
    });
    pgClient.end(() => {
        console.log('PostgreSQL connection closed');
    });
});

// Add this in server.js after your other routes
app.get('/test', (req, res) => {
    res.json({ message: 'Test route working' });
});

module.exports = app;
