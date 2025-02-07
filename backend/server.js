// server.js or app.js in your backend folder
const express = require('express');
const cors = require('cors');
const fileRoutes = require('./src/routes/fileRoutes');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Enables CORS for all routes
app.use(express.json()); // Parses JSON request bodies

// Mount routes
app.use('/api', fileRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Optional: Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = app;