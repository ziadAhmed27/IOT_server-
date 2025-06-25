CREATE DATABASE IF NOT EXISTS tourism_company;
USE tourism_company;

CREATE TABLE IF NOT EXISTS customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    nationality VARCHAR(100),
    currently_in_trip BOOLEAN DEFAULT FALSE,
    arrival_date DATE,
    leaving_date DATE,
    in_risk BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS trip_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    arrival_date DATE NOT NULL,
    leaving_date DATE NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

CREATE USER 'glitchuser'@'%' IDENTIFIED BY 'yourpassword';
GRANT ALL PRIVILEGES ON tourism_company.* TO 'glitchuser'@'%';
FLUSH PRIVILEGES; 