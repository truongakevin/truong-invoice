// src/renderer/Invoice.tsx
import React, { useState, useEffect } from 'react';

const Invoice = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [newInvoice, setNewInvoice] = useState({
    customerId: '',
    invoiceDate: '',
    dueDate: '',
    totalAmount: '',
    status: '',
  });

  useEffect(() => {
    const fetchInvoices = async () => {
      const data = await window.electron.ipcRenderer.invoke('get-invoices');
      setInvoices(data);
    };

    fetchInvoices();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const invoiceId = await window.electron.ipcRenderer.invoke('create-invoice', newInvoice);
    setNewInvoice({
      customerId: '',
      invoiceDate: '',
      dueDate: '',
      totalAmount: '',
      status: '',
    });
    setInvoices([...invoices, { ...newInvoice, InvoiceID: invoiceId }]);
  };

  return (
    <div>
      <h2>Invoices</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Customer ID"
          value={newInvoice.customerId}
          onChange={(e) => setNewInvoice({ ...newInvoice, customerId: e.target.value })}
        />
        <input
          type="date"
          value={newInvoice.invoiceDate}
          onChange={(e) => setNewInvoice({ ...newInvoice, invoiceDate: e.target.value })}
        />
        <input
          type="date"
          value={newInvoice.dueDate}
          onChange={(e) => setNewInvoice({ ...newInvoice, dueDate: e.target.value })}
        />
        <input
          type="number"
          placeholder="Total Amount"
          value={newInvoice.totalAmount}
          onChange={(e) => setNewInvoice({ ...newInvoice, totalAmount: e.target.value })}
        />
        <select
          value={newInvoice.status}
          onChange={(e) => setNewInvoice({ ...newInvoice, status: e.target.value })}
        >
          <option value="Pending">Pending</option>
          <option value="Paid">Paid</option>
          <option value="Overdue">Overdue</option>
        </select>
        <button type="submit">Create Invoice</button>
      </form>

      <h3>Existing Invoices</h3>
      <ul>
        {invoices.map((invoice) => (
          <li key={invoice.InvoiceID}>
            {invoice.InvoiceID} - {invoice.TotalAmount} - {invoice.Status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Invoice;