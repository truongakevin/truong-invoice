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
      PaidAmount REAL,
      DueAmount REAL,
      Status TEXT,
      FOREIGN KEY(CustomerID) REFERENCES Customers(CustomerID)
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS InvoiceItems (
      InvoiceItemID INTEGER PRIMARY KEY AUTOINCREMENT,
      InvoiceID INTEGER,
      ServiceDescription TEXT,
      ServiceDate TEXT,
      Quantity INTEGER,
      Rate REAL,
      FOREIGN KEY(InvoiceID) REFERENCES Invoices(InvoiceID)
    );
  `);

  console.log('Database tables checked/created');

  // await db.exec(`
  //   CREATE TRIGGER IF NOT EXISTS calculate_due_amount_after_insert
  //   AFTER INSERT ON Invoices
  //   FOR EACH ROW
  //   BEGIN
  //     UPDATE Invoices
  //     SET DueAmount = NEW.TotalAmount - NEW.PaidAmount
  //     WHERE InvoiceID = NEW.InvoiceID;
  //   END;
  // `);
  
  // await db.exec(`
  //   CREATE TRIGGER IF NOT EXISTS calculate_due_amount_after_update
  //   AFTER UPDATE ON Invoices
  //   FOR EACH ROW
  //   BEGIN
  //     UPDATE Invoices
  //     SET DueAmount = NEW.TotalAmount - NEW.PaidAmount
  //     WHERE InvoiceID = NEW.InvoiceID;
  //   END;
  // `);
  
  console.log('Database triggers checked/created');
  return db;
};