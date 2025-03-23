import { ipcMain } from 'electron';
import { Database } from 'sqlite';

let db: Database;

// Function to set the database instance
export const setDatabase = (database: Database) => {
  db = database;
};

// Create an invoice
ipcMain.handle('create-invoice', async (event, invoice: { customerID: number, invoiceDate: string, dueDate: string, totalAmount: number, status: string }) => {
  const { customerID, invoiceDate, dueDate, totalAmount, status } = invoice;
  const result = await db.run(
    "INSERT INTO Invoices (CustomerID, InvoiceDate, DueDate, TotalAmount, Status) VALUES (?, ?, ?, ?, ?)",
    [customerID, invoiceDate, dueDate, totalAmount, status]
  );
  return { InvoiceID: result.lastID };
});

// Get all invoices
ipcMain.handle('get-invoices', async () => {
  return await db.all("SELECT * FROM Invoices");
});

// Create a contact
ipcMain.handle('create-contact', async (event, contact: { firstName: string, lastName: string, email: string, phone: string, address1: string, address2: string, city: string, state: string, zipCode: string }) => {
  const { firstName, lastName, email, phone, address1, address2, city, state, zipCode } = contact;
  const result = await db.run(
    "INSERT INTO Customers (FirstName, LastName, Email, Phone, Address1, Address2, City, State, ZipCode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [firstName, lastName, email, phone, address1, address2, city, state, zipCode]
  );
  return { CustomerID: result.lastID };
});

// Get all contacts
ipcMain.handle('get-contacts', async () => {
  return await db.all("SELECT * FROM Customers");
});

// Get contact details by name
ipcMain.handle('get-contact-details', async (event, { firstName, lastName }) => {
  return await db.get("SELECT * FROM Customers WHERE FirstName = ? AND LastName = ?", [firstName, lastName]);
});

// Update a contact
ipcMain.handle('update-contact', async (event, contactDetails) => {
  const { CustomerID, FirstName, LastName, Email, Phone, Address1, Address2, City, State, ZipCode } = contactDetails;
  await db.run(
    `UPDATE Customers SET FirstName = ?, LastName = ?, Email = ?, Phone = ?, Address1 = ?, Address2 = ?, City = ?, State = ?, ZipCode = ? WHERE CustomerID = ?`,
    [FirstName, LastName, Email, Phone, Address1, Address2, City, State, ZipCode, CustomerID]
  );
});

// Delete a contact
ipcMain.handle('delete-contact', async (event, customerID: number) => {
  await db.run("DELETE FROM Customers WHERE CustomerID = ?", [customerID]);
  return { message: "Contact deleted successfully" };
});