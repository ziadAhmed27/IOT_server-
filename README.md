# Tourism Company Customer Management Server

A Node.js backend server for managing tourism company customers with trip tracking and history.

## Features

- Customer registration and management
- Trip history tracking
- Current trip status monitoring
- Risk assessment tracking
- Secure password hashing

## Setup

### Prerequisites

- Node.js installed
- MySQL server running
- Your MySQL server accessible from the internet (for Glitch deployment)

### Database Setup

1. Run the SQL commands in `schema.sql` to create the database and tables
2. Create a MySQL user for remote connections:
   ```sql
   CREATE USER 'glitchuser'@'%' IDENTIFIED BY 'yourpassword';
   GRANT ALL PRIVILEGES ON tourism_company.* TO 'glitchuser'@'%';
   FLUSH PRIVILEGES;
   ```

### Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with your database credentials:
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=glitchuser
   DB_PASS=yourpassword
   DB_NAME=tourism_company
   ```

3. Start the server:
   ```bash
   npm start
   ```

### Glitch Deployment

1. Upload all files to Glitch
2. Add environment variables in Glitch's `.env` section:
   ```
   DB_HOST=156.210.178.163
   DB_PORT=3306
   DB_USER=glitchuser
   DB_PASS=yourpassword
   DB_NAME=tourism_company
   ```

## API Endpoints

### Customers

- `POST /customers` - Register a new customer
- `GET /customers` - Get all customers
- `PUT /customers/:id/trip-state` - Update customer's current trip state

### Trip History

- `POST /customers/:id/trips` - Add a trip to customer's history
- `GET /customers/:id/trips` - Get customer's trip history

## Example Usage

### Register a Customer
```bash
curl -X POST http://localhost:3000/customers \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "name": "John Doe",
    "password": "securepassword",
    "nationality": "USA"
  }'
```

### Update Trip State
```bash
curl -X PUT http://localhost:3000/customers/1/trip-state \
  -H "Content-Type: application/json" \
  -d '{
    "currently_in_trip": true,
    "arrival_date": "2024-07-01",
    "leaving_date": "2024-07-10",
    "in_risk": false
  }'
``` 