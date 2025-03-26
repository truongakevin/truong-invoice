import React, { useEffect, useState } from 'react';
import InvoicesForm from './InvoicesForm';
import InvoicesList from './InvoicesList';
import InvoicesSearchBar from './InvoicesSearchBar';

const InvoicesPage: React.FC = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [invoicesItems, setInvoicesItems] = useState<any[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(true);


  const fetchInvoices = async () => {
    const data = await window.electron.ipcRenderer.invoke('get-invoices');
    setInvoices(data);
  };

  const fetchInvoicesItems = async () => {
    const data = await window.electron.ipcRenderer.invoke('get-invoice-items');
    setInvoicesItems(data);
  };

  useEffect(() => {
    fetchInvoices();
    fetchInvoicesItems();
  }, []);

  return (
    <div className='w-full'>
      <div className='w-full flex flex-row gap-12 items-end pb-4'>
        <div>
          <h1 className="text-4xl font-semibold py-2">Invoices</h1>
          <h2 className="text-gray-500 text-xl font-semibold">Manage and create Invoices for clients</h2>
        </div>
        {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="font-semibold text-lg bg-green-600 text-white rounded-lg shadow-lg px-6 py-2 h-min hover:bg-green-700 transition">New
            </button>
          )}
      </div>
      <div className='text-xl'>
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
        <InvoicesList invoices={invoices} setSelectedInvoice={setSelectedInvoice} searchQuery={searchQuery} />
        <InvoicesForm fetchInvoices={fetchInvoices} fetchInvoicesItems={fetchInvoicesItems} setShowForm={setShowForm} />
      </div>
      <table className="table-auto w-full mt-8">
        <thead>
          <tr>
            <th className="border-2 px-4 py-2">InvoiceItemID</th>
            <th className="border-2 px-4 py-2">InvoiceID</th>
            <th className="border-2 px-4 py-2">ServiceDate</th>
            <th className="border-2 px-4 py-2">ServiceDescription</th>
            <th className="border-2 px-4 py-2">Quantity</th>
            <th className="border-2 px-4 py-2">Rate</th>
          </tr>
        </thead>
        <tbody>
          {invoicesItems.map((invoiceItem) => (
            <tr key={invoiceItem.InvoiceItemID}>
              <td className="border-2 px-4 py-2">{invoiceItem.InvoiceItemID}</td>
              <td className="border-2 px-4 py-2">{invoiceItem.InvoiceID}</td>
              <td className="border-2 px-4 py-2">{invoiceItem.ServiceDate}</td>
              <td className="border-2 px-4 py-2">{invoiceItem.ServiceDescription}</td>
              <td className="border-2 px-4 py-2">{invoiceItem.Quantity}</td>
              <td className="border-2 px-4 py-2">{invoiceItem.Rate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoicesPage;