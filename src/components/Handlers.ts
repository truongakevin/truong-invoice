import { ipcMain } from 'electron';
import { Database } from 'sqlite';

let db: Database;

// Function to set the database instance
export const setDatabase = (database: Database) => {
  db = database;
};

// Create a contact
ipcMain.handle('create-contact', async (event, contact: { firstName: string, lastName: string, email: string, phone: string, address1: string, address2: string, city: string, state: string, zipCode: string }) => {
  const { firstName, lastName, email, phone, address1, address2, city, state, zipCode } = contact;
  const result = await db.run(
    "INSERT INTO Contacts (FirstName, LastName, Email, Phone, Address1, Address2, City, State, ZipCode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [firstName, lastName, email, phone, address1, address2, city, state, zipCode]
  );
  return { ContactID: result.lastID };
});

// Get all contacts
ipcMain.handle('get-contacts', async () => {
  return await db.all("SELECT * FROM Contacts");
});

// Get contact details by name
ipcMain.handle('get-contact-details', async (event, { firstName, lastName }) => {
  return await db.get("SELECT * FROM Contacts WHERE FirstName = ? AND LastName = ?", [firstName, lastName]);
});

// Update a contact
ipcMain.handle('update-contact', async (event, contactDetails) => {
  const { ContactID, FirstName, LastName, Email, Phone, Address1, Address2, City, State, ZipCode } = contactDetails;
  await db.run(
    `UPDATE Contacts SET FirstName = ?, LastName = ?, Email = ?, Phone = ?, Address1 = ?, Address2 = ?, City = ?, State = ?, ZipCode = ? WHERE ContactID = ?`,
    [FirstName, LastName, Email, Phone, Address1, Address2, City, State, ZipCode, ContactID]
  );
});

// Delete a contact
ipcMain.handle('delete-contact', async (event, contactID: number) => {
  await db.run("DELETE FROM Contacts WHERE ContactID = ?", [contactID]);
  return { message: "Contact deleted successfully" };
});

// Create an invoice
ipcMain.handle('create-invoice', async (event, invoice: { contactID: number, invoiceDate: string, dueDate: string, totalAmount: number, paidAmount: number, dueAmount: number, status: string }) => {
  const { contactID, invoiceDate, dueDate, totalAmount, paidAmount, dueAmount, status } = invoice;
  const result = await db.run(
    "INSERT INTO Invoices (ContactID, InvoiceDate, DueDate, TotalAmount, PaidAmount, DueAmount, Status) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [contactID, invoiceDate, dueDate, totalAmount, paidAmount, dueAmount, status]
  );
  return { InvoiceID: result.lastID };
});

// Get all invoices
ipcMain.handle('get-invoices', async () => {
  return await db.all("SELECT * FROM Invoices");
});

// Create an invoice
ipcMain.handle('create-service', async (event, service: { invoiceID: number, serviceDescription: string, serviceDate: string, quantity: number, rate: number }) => {
  const { invoiceID, serviceDate, serviceDescription, quantity, rate } = service;
  await db.run(
    "INSERT INTO Services (InvoiceID, ServiceDate, ServiceDescription, Quantity, Rate) VALUES (?, ?, ?, ?, ?)",
    [invoiceID, serviceDate, serviceDescription, quantity, rate]
  );
  return { message: "Service added successfully" };
});


// Get all invoices
ipcMain.handle('get-services', async () => {
  return await db.all("SELECT * FROM Services");
});

