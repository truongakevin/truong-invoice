// src/database.ts
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Open the SQLite database (or create it if it doesn't exist)
export const openDb = async () => {
  const db = await open({
    filename: './invoiceApp.db',
    driver: sqlite3.Database,
  });

  console.log('Database opened successfully');

  // Create tables if they don't exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS Customers (
      CustomerID INTEGER PRIMARY KEY AUTOINCREMENT,
      FirstName TEXT,
      LastName TEXT,
      Email TEXT,
      Phone TEXT,
      Address1 TEXT,
      Address2 TEXT,
      City TEXT,
      State TEXT,
      ZipCode TEXT
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS Invoices (
      InvoiceID INTEGER PRIMARY KEY AUTOINCREMENT,
      CustomerID INTEGER,
      InvoiceDate TEXT,
      DueDate TEXT,
      TotalAmount REAL,
      Status TEXT,
      FOREIGN KEY(CustomerID) REFERENCES Customers(CustomerID)
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS InvoiceItems (
      InvoiceItemID INTEGER PRIMARY KEY AUTOINCREMENT,
      InvoiceID INTEGER,
      ServiceDescription TEXT,
      Quantity INTEGER,
      Rate REAL,
      LineTotal REAL,
      FOREIGN KEY(InvoiceID) REFERENCES Invoices(InvoiceID)
    );
  `);

  console.log('Database tables checked/created');
  return db;
};