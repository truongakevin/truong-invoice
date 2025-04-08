import { ipcMain } from 'electron';
import { Database } from 'sqlite';

let db: Database;

// Function to set the database instance
export const setDatabase = (database: Database) => {
  db = database;
};

// Get all contacts
ipcMain.handle('get-contacts', async () => {
  return await db.all("SELECT * FROM Contacts");
});

// Create a contact
ipcMain.handle('create-contact', async (event, contact: { FirstName: string, LastName: string, Email: string, Phone: string, Address1: string, Address2: string, City: string, State: string, ZipCode: string }) => {
  const { FirstName, LastName, Email, Phone, Address1, Address2, City, State, ZipCode } = contact;
  const result = await db.run(
    "INSERT INTO Contacts (FirstName, LastName, Email, Phone, Address1, Address2, City, State, ZipCode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [FirstName, LastName, Email, Phone, Address1, Address2, City, State, ZipCode]
  );
  return { ContactID: result.lastID };
});

// Update a contact
ipcMain.handle('update-contact', async (event, contact: { ContactID: number, FirstName: string, LastName: string, Email: string, Phone: string, Address1: string, Address2: string, City: string, State: string, ZipCode: string }) => {
  const { ContactID, FirstName, LastName, Email, Phone, Address1, Address2, City, State, ZipCode } = contact;
  await db.run(
    `UPDATE Contacts SET FirstName = ?, LastName = ?, Email = ?, Phone = ?, Address1 = ?, Address2 = ?, City = ?, State = ?, ZipCode = ? WHERE ContactID = ?`,
    [FirstName, LastName, Email, Phone, Address1, Address2, City, State, ZipCode, ContactID]
  );
  return { message: "Contact updated successfully" };
});

// Delete a contact
ipcMain.handle('delete-contact', async (event, ContactID: number) => {
  await db.run("DELETE FROM Contacts WHERE ContactID = ?", [ContactID]);
  return { message: "Contact deleted successfully" };
});

// Get all invoices
ipcMain.handle('get-invoices', async () => {
  return await db.all("SELECT * FROM Invoices");
});

// Create an invoice
ipcMain.handle('create-invoice', async (event, invoice: { ContactID: number, InvoiceDate: string, DueDate: string, TotalAmount: number, PaidAmount: number, Status: string }) => {
  const { ContactID, InvoiceDate, DueDate, TotalAmount, PaidAmount, Status } = invoice;
  const result = await db.run(
    "INSERT INTO Invoices (ContactID, InvoiceDate, DueDate, TotalAmount, PaidAmount, Status) VALUES (?, ?, ?, ?, ?, ?)",
    [ContactID, InvoiceDate, DueDate, TotalAmount, PaidAmount, Status]
  );
  return { InvoiceID: result.lastID };
});

// Update a invoice
ipcMain.handle('update-invoice', async (event, invoice: { InvoiceID: number, ContactID: number, InvoiceDate: string, DueDate: string, TotalAmount: number, PaidAmount: number, Status: string }) => {
  const { InvoiceID, ContactID, InvoiceDate, DueDate, TotalAmount, PaidAmount, Status } = invoice;
  await db.run(
    `UPDATE Invoices SET ContactID = ?, InvoiceDate = ?, DueDate = ?, TotalAmount = ?, PaidAmount = ?, Status = ? WHERE InvoiceID = ?`,
    [ContactID, InvoiceDate, DueDate, TotalAmount, PaidAmount, Status, InvoiceID]
  );
  return { message: "Invoice updated successfully" };
});

// Delete a invoice
ipcMain.handle('delete-invoice', async (event, InvoiceID: number) => {
  await db.run("DELETE FROM Invoices WHERE InvoiceID = ?", [InvoiceID]);
  return { message: "Invoice deleted successfully" };
});

// Get all invoices
ipcMain.handle('get-services', async () => {
  return await db.all("SELECT * FROM Services");
});

// Create a service
ipcMain.handle('create-service', async (event, service: { InvoiceID: number, EstimateID: number, ServiceDescription: string, ServiceDate: string, Quantity: number, Rate: number }) => {
  const { InvoiceID, EstimateID, ServiceDate, ServiceDescription, Quantity, Rate } = service;
  const result = await db.run(
    "INSERT INTO Services (InvoiceID, EstimateID, ServiceDate, ServiceDescription, Quantity, Rate) VALUES (?, ?, ?, ?, ?, ?)",
    [InvoiceID, EstimateID, ServiceDate, ServiceDescription, Quantity, Rate]
  );
  return { ServiceID: result.lastID };
});

// Update a service
ipcMain.handle('update-service', async (event, service: { ServiceID: number, InvoiceID: number, EstimateID: number, ServiceDescription: string, ServiceDate: string, Quantity: number, Rate: number }) => {
  const { ServiceID, InvoiceID, EstimateID, ServiceDescription, ServiceDate, Quantity, Rate } = service;
  await db.run(
    `UPDATE Services SET InvoiceID = ?, EstimateID = ?, ServiceDescription = ?, ServiceDate = ?, Quantity = ?, Rate = ? WHERE ServiceID = ?`,
    [InvoiceID, EstimateID, ServiceDescription, ServiceDate, Quantity, Rate, ServiceID]
  );
  return { message: "Service updated successfully" };
});

// Delete a service
ipcMain.handle('delete-service', async (event, ServiceID : number) => {
  await db.run("DELETE FROM Services WHERE ServiceID = ?", [ServiceID]);
  return { message: "Service deleted successfully" };
});

// Get all estimates
ipcMain.handle('get-estimates', async () => {
  return await db.all("SELECT * FROM Estimates");
});

// Create an estimate
ipcMain.handle('create-estimate', async (event, estimate: { ContactID: number, EstimateDate: string, TotalAmount: number }) => {
  const { ContactID, EstimateDate, TotalAmount } = estimate;
  const result = await db.run(
    "INSERT INTO Estimates (ContactID, EstimateDate, TotalAmount) VALUES (?, ?, ?)",
    [ContactID, EstimateDate, TotalAmount]
  );
  return { EstimateID: result.lastID };
});

// Update an estimate
ipcMain.handle('update-estimate', async (event, estimate: { EstimateID: number, ContactID: number, EstimateDate: string, TotalAmount: number }) => {
  const { EstimateID, ContactID, EstimateDate, TotalAmount } = estimate;
  await db.run(
    `UPDATE Estimates SET ContactID = ?, EstimateDate = ?, TotalAmount = ? WHERE EstimateID = ?`,
    [ContactID, EstimateDate, TotalAmount, EstimateID]
  );
  return { message: "Estimate updated successfully" };
});

// Delete an estimate
ipcMain.handle('delete-estimate', async (event, EstimateID: number) => {
  await db.run("DELETE FROM Estimates WHERE EstimateID = ?", [EstimateID]);
  return { message: "Estimate deleted successfully" };
});

// Get all payments
ipcMain.handle('get-payments', async () => {
  return await db.all("SELECT * FROM Payments");
});

// Create a payment
ipcMain.handle('create-payment', async (event, payment: { InvoiceID: number, PaymentDate: string, Amount: number, Method: string }) => {
  const { InvoiceID, PaymentDate, Amount, Method } = payment;
  const result = await db.run(
    "INSERT INTO Payments (InvoiceID, PaymentDate, Amount, Method) VALUES (?, ?, ?, ?)",
    [InvoiceID, PaymentDate, Amount, Method]
  );
  return { PaymentID: result.lastID };
});

// Update a payment
ipcMain.handle('update-payment', async (event, payment: { PaymentID: number, InvoiceID: number, PaymentDate: string, Amount: number, Method: string }) => {
  const { PaymentID, InvoiceID, PaymentDate, Amount, Method } = payment;
  await db.run(
    `UPDATE Payments SET InvoiceID = ?, PaymentDate = ?, Amount = ?, Method = ? WHERE PaymentID = ?`,
    [InvoiceID, PaymentDate, Amount, Method, PaymentID]
  );
  return { message: "Payment updated successfully" };
});

// Delete a payment
ipcMain.handle('delete-payment', async (event, PaymentID: number) => {
  await db.run("DELETE FROM Payments WHERE PaymentID = ?", [PaymentID]);
  return { message: "Payment deleted successfully" };
});
