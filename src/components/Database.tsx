// src/database.ts
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const sampleSql = `
-- Insert Sample Contacts
INSERT INTO Contacts (FirstName, LastName, Email, Phone, Address1, City, State, ZipCode) VALUES 
('Kevin', 'Truong', 'thekevoness@gmail.com', '720224618','11708 Montgomery Circle', 'Longmont', 'CO', 80504),
('John', 'Doe', 'john.doe@example.com', 3031234567, '123 Main St', 'Denver', 'CO', 80202),
('Jane', 'Smith', 'jane.smith@example.com', 7202345678, '456 Elm St', 'Boulder', 'CO', 80301),
('Michael', 'Johnson', 'michael.johnson@example.com', 9703456789, '789 Oak St', 'Colorado Springs', 'CO', 80918),
('Emily', 'Brown', 'emily.brown@example.com', 7194567890, '101 Maple St', 'Fort Collins', 'CO', 80521),
('David', 'Williams', 'david.williams@example.com', 3035678901, '202 Pine St', 'Aurora', 'CO', 80014),
('Sarah', 'Miller', 'sarah.miller@example.com', 7206789012, '303 Birch St', 'Lakewood', 'CO', 80228),
('Daniel', 'Wilson', 'daniel.wilson@example.com', 9707890123, '404 Cedar St', 'Thornton', 'CO', 80241),
('Jessica', 'Moore', 'jessica.moore@example.com', 7198901234, '505 Aspen St', 'Arvada', 'CO', 80003),
('Matthew', 'Taylor', 'matthew.taylor@example.com', 3039012345, '606 Spruce St', 'Westminster', 'CO', 80030),
('Ashley', 'Anderson', 'ashley.anderson@example.com', 7200123456, '707 Walnut St', 'Pueblo', 'CO', 81001),
('Ryan', 'Thomas', 'ryan.thomas@example.com', 9701234567, '808 Cherry St', 'Greeley', 'CO', 80634),
('Olivia', 'Harris', 'olivia.harris@example.com', 7192345678, '909 Dogwood St', 'Longmont', 'CO', 80504),
('James', 'Martin', 'james.martin@example.com', 3033456789, '111 Peach St', 'Loveland', 'CO', 80538),
('Sophia', 'Clark', 'sophia.clark@example.com', 7204567890, '222 Plum St', 'Broomfield', 'CO', 80020),
('Ethan', 'Lewis', 'ethan.lewis@example.com', 9705678901, '333 Oakwood St', 'Castle Rock', 'CO', 80104),
('Isabella', 'Walker', 'isabella.walker@example.com', 7196789012, '444 Redwood St', 'Grand Junction', 'CO', 81501),
('Mason', 'Allen', 'mason.allen@example.com', 3037890123, '555 Elmwood St', 'Highlands Ranch', 'CO', 80126),
('Ava', 'Young', 'ava.young@example.com', 7208901234, '666 Fir St', 'Parker', 'CO', 80134),
('Logan', 'King', 'logan.king@example.com', 9709012345, '777 Maplewood St', 'Brighton', 'CO', 80601),
('Mia', 'Wright', 'mia.wright@example.com', 7190123456, '888 Aspenwood St', 'Littleton', 'CO', 80120),
('Alexander', 'Scott', 'alexander.scott@example.com', 3031234567, '999 Birchwood St', 'Northglenn', 'CO', 80233),
('Charlotte', 'Green', 'charlotte.green@example.com', 7202345678, '1010 Dogwood St', 'Commerce City', 'CO', 80022),
('Benjamin', 'Adams', 'benjamin.adams@example.com', 9703456789, '1111 Peachwood St', 'Englewood', 'CO', 80110),
('Ella', 'Baker', 'ella.baker@example.com', 7194567890, '1212 Plumwood St', 'Wheat Ridge', 'CO', 80033),
('Carter', 'Nelson', 'carter.nelson@example.com', 3035678901, '1313 Oakridge St', 'Golden', 'CO', 80401),
('Lily', 'Hall', 'lily.hall@example.com', 7206789012, '1414 Cedarwood St', 'Fountain', 'CO', 80817),
('Samuel', 'Perez', 'samuel.perez@example.com', 9707890123, '1515 Sprucewood St', 'Lafayette', 'CO', 80026),
('Zoe', 'Roberts', 'zoe.roberts@example.com', 7198901234, '1616 Walnutwood St', 'Louisville', 'CO', 80027),
('Henry', 'Gonzalez', 'henry.gonzalez@example.com', 3039012345, '1717 Cherrywood St', 'Erie', 'CO', 80516),
('Harper', 'Mitchell', 'harper.mitchell@example.com', 7200123456, '1818 Redwoodwood St', 'Montrose', 'CO', 81401),
('Daniel', 'Carter', 'daniel.carter@example.com', 9701234567, '1919 Elm St', 'Durango', 'CO', 81301),
('Chloe', 'Phillips', 'chloe.phillips@example.com', 7192345678, '2020 Pine St', 'Steamboat Springs', 'CO', 80487),
('Jack', 'Evans', 'jack.evans@example.com', 3033456789, '2121 Dogwood St', 'Silverthorne', 'CO', 80498),
('Lillian', 'Turner', 'lillian.turner@example.com', 7204567890, '2222 Peach St', 'Breckenridge', 'CO', 80424),
('Grayson', 'Parker', 'grayson.parker@example.com', 9705678901, '2323 Plum St', 'Vail', 'CO', 81657),
('Scarlett', 'Collins', 'scarlett.collins@example.com', 7196789012, '2424 Oakwood St', 'Aspen', 'CO', 81611),
('Hudson', 'Edwards', 'hudson.edwards@example.com', 3037890123, '2525 Cedar St', 'Telluride', 'CO', 81435);

-- Insert sample invoices
INSERT INTO Invoices (ContactID, InvoiceDate, DueDate, TotalAmount, PaidAmount, DueAmount, Status) VALUES
(1, '2025-03-01', '2025-03-15', 500.00, 250.00, 250.00, 'Pending'),
(8, '2025-03-05', '2025-03-20', 350.00, 0.00, 350.00, 'Pending'),
(27, '2025-03-10', '2025-03-25', 1000.00, 500.00, 500.00, 'Paid'),
(4, '2025-03-12', '2025-03-26', 150.00, 150.00, 0.00, 'Paid'),
(20, '2025-03-15', '2025-03-30', 800.00, 0.00, 800.00, 'Pending'),
(17, '2025-03-18', '2025-04-02', 200.00, 0.00, 200.00, 'Pending'),
(16, '2025-03-20', '2025-04-04', 600.00, 300.00, 300.00, 'Pending'),
(9, '2025-03-22', '2025-04-06', 400.00, 0.00, 400.00, 'Pending'),
(14, '2025-03-25', '2025-04-09', 700.00, 700.00, 0.00, 'Paid'),
(21, '2025-03-28', '2025-04-12', 900.00, 0.00, 900.00, 'Pending'),
(32, '2025-03-28', '2025-04-12', 900.00, 0.00, 900.00, 'Pending'),
(29, '2025-03-29', '2025-04-13', 300.00, 150.00, 150.00, 'Pending'),
(12, '2025-03-30', '2025-04-14', 500.00, 200.00, 300.00, 'Pending'),
(25, '2025-04-01', '2025-04-15', 1200.00, 1200.00, 0.00, 'Paid'),
(14, '2025-04-02', '2025-04-16', 750.00, 0.00, 750.00, 'Pending'),
(15, '2025-04-03', '2025-04-17', 450.00, 450.00, 0.00, 'Paid'),
(21, '2025-04-04', '2025-04-18', 1100.00, 600.00, 500.00, 'Pending'),
(17, '2025-04-05', '2025-04-19', 950.00, 950.00, 0.00, 'Paid'),
(2, '2025-04-06', '2025-04-20', 700.00, 300.00, 400.00, 'Pending'),
(4, '2025-04-07', '2025-04-21', 250.00, 250.00, 0.00, 'Paid'),
(20, '2025-04-08', '2025-04-22', 850.00, 400.00, 450.00, 'Pending'),
(21, '2025-03-29', '2025-04-13', 450.00, 0.00, 450.00, 'Pending'),
(21, '2025-03-30', '2025-04-14', 700.00, 350.00, 350.00, 'Pending'),
(4, '2025-03-31', '2025-04-15', 1200.00, 600.00, 600.00, 'Pending'),
(24, '2025-04-01', '2025-04-16', 250.00, 250.00, 0.00, 'Paid'),
(23, '2025-04-02', '2025-04-17', 500.00, 500.00, 0.00, 'Paid'),
(26, '2025-04-03', '2025-04-18', 350.00, 0.00, 350.00, 'Pending'),
(27, '2025-04-04', '2025-04-19', 450.00, 0.00, 450.00, 'Pending'),
(12, '2025-04-05', '2025-04-20', 650.00, 300.00, 350.00, 'Pending'),
(19, '2025-04-06', '2025-04-21', 800.00, 0.00, 800.00, 'Pending'),
(30, '2025-04-07', '2025-04-22', 1000.00, 0.00, 1000.00, 'Pending');

-- Insert sample services
INSERT INTO Services (InvoiceID, ServiceDescription, ServiceDate, Quantity, Rate) VALUES
(1, 'Web Development', '2025-03-01', 10, 50.00),
(1, 'SEO Optimization', '2025-03-02', 5, 30.00),
(1, 'Consulting Services', '2025-03-05', 7, 45.00),
(2, 'Consulting Services', '2025-03-05', 7, 45.00),
(3, 'Graphic Design', '2025-03-10', 15, 60.00),
(3, 'Branding Package', '2025-03-10', 10, 100.00),
(4, 'Product Photography', '2025-03-12', 8, 20.00),
(5, 'Website Hosting', '2025-03-15', 12, 50.00),
(6, 'Email Marketing', '2025-03-18', 4, 50.00),
(7, 'App Development', '2025-03-20', 5, 100.00),
(8, 'Content Creation', '2025-03-22', 3, 60.00),
(9, 'UI/UX Design', '2025-03-25', 6, 80.00),
(10, 'Cloud Hosting', '2025-03-28', 10, 70.00);
`

// Open the SQLite database (or create it if it doesn't exist)
export const openDb = async () => {
  const db = await open({
    filename: './invoiceApp.db',
    driver: sqlite3.Database,
  });

  console.log('Database opened successfully');
  
  // Drop all entries in the database
  await db.exec(`DROP TABLE IF EXISTS Contacts;`);
  await db.exec(`DROP TABLE IF EXISTS Invoices;`);
  await db.exec(`DROP TABLE IF EXISTS Services;`);
  console.log('All existing data cleared');

  // Create tables if they don't exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS Contacts (
      ContactID INTEGER PRIMARY KEY AUTOINCREMENT,
      FirstName TEXT,
      LastName TEXT,
      Email TEXT,
      Phone INTEGER,
      Address1 TEXT,
      Address2 TEXT,
      City TEXT,
      State TEXT,
      ZipCode INTEGER
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS Invoices (
      InvoiceID INTEGER PRIMARY KEY AUTOINCREMENT,
      ContactID INTEGER,
      InvoiceDate TEXT,
      DueDate TEXT,
      TotalAmount REAL,
      PaidAmount REAL,
      DueAmount REAL,
      Status TEXT,
      FOREIGN KEY(ContactID) REFERENCES Contacts(ContactID)
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS Services (
      ServiceID INTEGER PRIMARY KEY AUTOINCREMENT,
      InvoiceID INTEGER,
      ServiceDescription TEXT,
      ServiceDate TEXT,
      Quantity INTEGER,
      Rate REAL,
      FOREIGN KEY(InvoiceID) REFERENCES Invoices(InvoiceID)
    );
  `);

  console.log('Database tables checked');

  await db.exec(sampleSql);
  console.log('Sample data imported successfully');


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
  // console.log('Database triggers checked/created');
  return db;
};