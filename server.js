const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(bodyParser.json());

// MySQL connection using environment variables or defaults
const dbConfig = {
  host: process.env.DB_HOST || '156.210.178.163',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'glitchuser',
  password: process.env.DB_PASS || 'yourpassword', // Change this to your MySQL password
  database: process.env.DB_NAME || 'tourism_company'
};

let connection;
mysql.createConnection(dbConfig).then(conn => {
  connection = conn;
  console.log('Connected to MySQL');
}).catch(err => {
  console.error('MySQL connection error:', err);
});

// Register a new customer
app.post('/customers', async (req, res) => {
  const { email, name, password, nationality } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const [result] = await connection.execute(
      'INSERT INTO customers (email, name, password, nationality) VALUES (?, ?, ?, ?)',
      [email, name, hashedPassword, nationality]
    );
    res.status(201).json({ id: result.insertId, email, name, nationality });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all customers
app.get('/customers', async (req, res) => {
  const [rows] = await connection.execute('SELECT * FROM customers');
  res.json(rows);
});

// Add a trip to history
app.post('/customers/:id/trips', async (req, res) => {
  const customerId = req.params.id;
  const { arrival_date, leaving_date } = req.body;
  try {
    const [result] = await connection.execute(
      'INSERT INTO trip_history (customer_id, arrival_date, leaving_date) VALUES (?, ?, ?)',
      [customerId, arrival_date, leaving_date]
    );
    res.status(201).json({ id: result.insertId, customer_id: customerId, arrival_date, leaving_date });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get trip history for a customer
app.get('/customers/:id/trips', async (req, res) => {
  const customerId = req.params.id;
  const [rows] = await connection.execute(
    'SELECT * FROM trip_history WHERE customer_id = ?',
    [customerId]
  );
  res.json(rows);
});

// Update current trip state
app.put('/customers/:id/trip-state', async (req, res) => {
  const customerId = req.params.id;
  const { currently_in_trip, arrival_date, leaving_date, in_risk } = req.body;
  try {
    await connection.execute(
      'UPDATE customers SET currently_in_trip = ?, arrival_date = ?, leaving_date = ?, in_risk = ? WHERE id = ?',
      [currently_in_trip, arrival_date, leaving_date, in_risk, customerId]
    );
    res.json({ message: 'Trip state updated' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 