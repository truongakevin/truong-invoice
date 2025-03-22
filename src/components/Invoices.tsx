import React, { useState, useEffect } from 'react';

const Invoice = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [newInvoice, setNewInvoice] = useState({
    customerId: '',
    invoiceDate: '',
    dueDate: '',
    totalAmount: '',
    status: 'Pending',
  });

  const fetchInvoices = async () => {
    const data = await window.electron.ipcRenderer.invoke('get-invoices');
    setInvoices(data);
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await window.electron.ipcRenderer.invoke('create-invoice', newInvoice);
    fetchInvoices(); // Refresh the invoice list
    setNewInvoice({ customerId: '', invoiceDate: '', dueDate: '', totalAmount: '', status: 'Pending' });
  };

  return (
    <div>
      <h2>Invoices</h2>
      <form onSubmit={handleSubmit} className="invoice-form">
        {['customerId', 'invoiceDate', 'dueDate', 'totalAmount'].map((field) => (
          <input
            key={field}
            type={field === 'totalAmount' ? 'number' : 'text'}
            placeholder={field.replace(/([A-Z])/g, ' $1')}
            value={newInvoice[field as keyof typeof newInvoice]}
            onChange={(e) => setNewInvoice({ ...newInvoice, [field]: e.target.value })}
          />
        ))}
        <select value={newInvoice.status} onChange={(e) => setNewInvoice({ ...newInvoice, status: e.target.value })}>
          {['Pending', 'Paid', 'Overdue'].map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
        <button type="submit">Create Invoice</button>
      </form>

      <h3>Existing Invoices</h3>
      <ul>
        {invoices.map(({ InvoiceID, TotalAmount, Status }) => (
          <li key={InvoiceID}>{`#${InvoiceID} - $${TotalAmount} - ${Status}`}</li>
        ))}
      </ul>
    </div>
  );
};

export default Invoice;