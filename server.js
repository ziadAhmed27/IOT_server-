const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(bodyParser.json());

// Health check endpoint for Railway
app.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'Tourism Company Server is running' });
});

// MySQL connection using environment variables or defaults
const dbConfig = {
  host: process.env.DB_HOST || '197.54.175.1',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'glitchuser',
  password: process.env.DB_PASS || 'glitchpassword',
  database: process.env.DB_NAME || 'tourism_company'
};

let connection;

// Initialize database connection
async function initializeDB() {
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to MySQL');
  } catch (err) {
    console.error('MySQL connection error:', err);
  }
}

initializeDB();

// Register a new customer
app.post('/customers', async (req, res) => {
  try {
    if (!connection) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    
    const { email, name, password, nationality } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await connection.execute(
      'INSERT INTO customers (email, name, password, nationality) VALUES (?, ?, ?, ?)',
      [email, name, hashedPassword, nationality]
    );
    res.status(201).json({ id: result.insertId, email, name, nationality });
  } catch (err) {
    console.error('Error creating customer:', err);
    res.status(400).json({ error: err.message });
  }
});

// Get all customers
app.get('/customers', async (req, res) => {
  try {
    if (!connection) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    
    const [rows] = await connection.execute('SELECT * FROM customers');
    res.json(rows);
  } catch (err) {
    console.error('Error getting customers:', err);
    res.status(500).json({ error: err.message });
  }
});

// Add a trip to history
app.post('/customers/:id/trips', async (req, res) => {
  try {
    if (!connection) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    
    const customerId = req.params.id;
    const { arrival_date, leaving_date } = req.body;
    
    const [result] = await connection.execute(
      'INSERT INTO trip_history (customer_id, arrival_date, leaving_date) VALUES (?, ?, ?)',
      [customerId, arrival_date, leaving_date]
    );
    res.status(201).json({ id: result.insertId, customer_id: customerId, arrival_date, leaving_date });
  } catch (err) {
    console.error('Error adding trip:', err);
    res.status(400).json({ error: err.message });
  }
});

// Get trip history for a customer
app.get('/customers/:id/trips', async (req, res) => {
  try {
    if (!connection) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    
    const customerId = req.params.id;
    const [rows] = await connection.execute(
      'SELECT * FROM trip_history WHERE customer_id = ?',
      [customerId]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error getting trip history:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update current trip state
app.put('/customers/:id/trip-state', async (req, res) => {
  try {
    if (!connection) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    
    const customerId = req.params.id;
    const { currently_in_trip, arrival_date, leaving_date, in_risk } = req.body;
    
    await connection.execute(
      'UPDATE customers SET currently_in_trip = ?, arrival_date = ?, leaving_date = ?, in_risk = ? WHERE id = ?',
      [currently_in_trip, arrival_date, leaving_date, in_risk, customerId]
    );
    res.json({ message: 'Trip state updated' });
  } catch (err) {
    console.error('Error updating trip state:', err);
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 