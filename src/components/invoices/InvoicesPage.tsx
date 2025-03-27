import React, { useEffect, useState } from 'react';
import InvoicesForm from './InvoicesForm';
import InvoicesSearchBar from './InvoicesSearchBar';
import List from '../List';

const InvoicesPage: React.FC = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [invoicesItems, setInvoicesItems] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCustomers = async () => {
    const data = await window.electron.ipcRenderer.invoke('get-contacts');
    setCustomers(data);
  };

  const fetchInvoices = async () => {
    const data = await window.electron.ipcRenderer.invoke('get-invoices');
    setInvoices(data);
  };

  const fetchInvoicesItems = async () => {
    const data = await window.electron.ipcRenderer.invoke('get-invoice-items');
    setInvoicesItems(data);
  };

  useEffect(() => {
    fetchCustomers();
    fetchInvoices();
    fetchInvoicesItems();
  }, []);

  // Combine invoices with customer data based on CustomerID
  const invoicesWithCustomers = invoices.map(invoice => {
    const customer = customers.find(c => c.CustomerID === invoice.CustomerID);
    return {
      ...invoice,
      Customer: customer || {}
    };
  });

  const filteredInvoicesWithCustomers = invoicesWithCustomers.filter((invoice) => {
    return (
      (invoice.Customer.FirstName && invoice.Customer.FirstName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (invoice.Customer.LastName && invoice.Customer.LastName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (invoice.Customer.Phone && invoice.Customer.Phone.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <div className='flex flex-col text-xl'>
      <div className='flex flex-row justify-between items-end font-semibold'>
        <div className='flex flex-col gap-2'>
          <h1 className="text-4xl">Invoices</h1>
          <h2 className="text-gray-500">Manage and create Invoices for clients</h2>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="h-min px-6 py-2 rounded-lg shadow-lg bg-green-600 hover:bg-green-700 transition text-white">New</button>
        )}
      </div>
      <div className=''>
        {selectedInvoice && <p>InvoiceID: {selectedInvoice.InvoiceID}</p>}
        {selectedInvoice && <p>CustomerID: {selectedInvoice.CustomerID}</p>}
        {selectedInvoice && <p>InvoiceDate: {selectedInvoice.InvoiceDate}</p>}
        {selectedInvoice && <p>DueDate: {selectedInvoice.DueDate}</p>}
        {selectedInvoice && <p>TotalAmount: {selectedInvoice.TotalAmount}</p>}
        {selectedInvoice && <p>PaidAmount: {selectedInvoice.PaidAmount}</p>}
        {selectedInvoice && <p>DueAmount: {selectedInvoice.DueAmount}</p>}
        {selectedInvoice && <p>Status: {selectedInvoice.Status}</p>}
      </div>
        
      <div className='flex flex-col gap-4'>
        {/* {showForm && <InvoicesForm fetchInvoices={fetchInvoices} setShowForm={setShowForm} />} */}
        <InvoicesSearchBar query={searchQuery} setQuery={setSearchQuery}/>
        <List
          fieldNames={['InvoiceID', 'Date', 'First Name', 'Last Name', 'Total', 'Due', 'Paid', 'Status']}
          fieldValues={['InvoiceID', 'InvoiceDate', 'FirstName', 'LastName', 'TotalAmount', 'DueAmount', 'PaidAmount', 'Status']}
          items={filteredInvoicesWithCustomers.map((invoice) => ({
            InvoiceID: invoice.InvoiceID,
            InvoiceDate: invoice.InvoiceDate,
            FirstName: invoice.Customer.FirstName,
            LastName: invoice.Customer.LastName,
            TotalAmount: invoice.TotalAmount,
            DueAmount: invoice.DueAmount,
            PaidAmount: invoice.PaidAmount,
            Status: invoice.Status,
          }))}
          setSelectedCell={setSelectedInvoice}
        />
        <List
          fieldNames={['Invoice Item ID', 'Invoice ID', 'Service Date', 'Service Description', 'Quantity', 'Rate']}
          fieldValues={['InvoiceItemID', 'InvoiceID', 'ServiceDate', 'ServiceDescription', 'Quantity', 'Rate']}
          items={invoicesItems.map((invoiceItem) => ({
            InvoiceItemID: invoiceItem.InvoiceItemID,
            InvoiceID: invoiceItem.InvoiceID,
            ServiceDate: invoiceItem.ServiceDate,
            ServiceDescription: invoiceItem.ServiceDescription,
            Quantity: invoiceItem.Quantity,
            Rate: invoiceItem.Rate,
          }))}
        />
        <InvoicesForm fetchInvoices={fetchInvoices} fetchInvoicesItems={fetchInvoicesItems} setShowForm={setShowForm} />
      </div>
    </div>
  );
};

export default InvoicesPage;