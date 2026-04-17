const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables (.env file should be created in the server directory)
dotenv.config();

// Initialize the Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware setup
app.use(cors()); // Allow Cross-Origin requests
app.use(express.json()); // Parse incoming JSON requests

// Basic health check route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Scribbles & Slates API is running...' });
});

// Mount Routes
app.use('/api/auth', require('./routes/auth'));

// Connect to MongoDB (ensure you add MONGO_URI in your .env later)

mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('MongoDB connection successful');
}).catch((err) => {
    console.error('MongoDB connection error:', err.message);
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
