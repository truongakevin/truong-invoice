import React, { useState, useEffect } from 'react';
import InvoicesFormContact from './InvoicesFormContact';
import InvoicesFormItems from './InvoicesFormItems';

const InvoicesForm = ({ 
  fetchInvoices,
  fetchInvoicesItems,
  setShowForm 
}: { 
  fetchInvoices: () => void; 
  fetchInvoicesItems: () => void; 
  setShowForm: (state: boolean) => void
}) => {
  const [newInvoice, setNewInvoice] = useState<any>({
    CustomerID: '',
    InvoiceDate: '',
    DueDate: '',
    TotalAmount: '',
    PaidAmount: '',
    DueAmount: '',
    Status: '',
  });

  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    setItems(prevItems => [...prevItems, { ServiceDescription: 'Programming', ServiceDate: 'March 2025', Quantity: 2, Rate: '$20.00' }]);
    setItems(prevItems => [...prevItems, { ServiceDescription: 'Testing overflow in inpnut feilds on items Testing overflow in inpnut feilds on items invoice items table to check overflow limits Testing overflow in inpnut feilds on items invoice items table to check overflow limits Testing overflow in inpnut feilds on items invoice items table to check overflow limits invoice items table to check overflow limits Testing overflow in inpnut feilds on items invoice items table to check overflow limits Testing overflow in inpnut feilds on', ServiceDate: 'Febuary 2025', Quantity: 20, Rate: '$399927.59' }]);
    setItems(prevItems => [...prevItems, { ServiceDescription: 'Skill improvement (leet code)', ServiceDate: 'March 2025', Quantity: 2, Rate: '$45.00' }]);
    setItems(prevItems => [...prevItems, { ServiceDescription: 'Mental and physical health break time', ServiceDate: 'January 2025', Quantity: 14, Rate: '$5.00' }]);
    setItems(prevItems => [...prevItems, { ServiceDescription: '', ServiceDate: '', Quantity: '', Rate: '' }]);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(newInvoice.CustomerID);

    // Calculate totalAmount, ensure the value is a number
    const totalAmount = items.reduce((acc, item) => {
      if (item.Quantity && item.Rate) {
        const quantity = parseFloat(item.Quantity);
        const rate = parseFloat(item.Rate.slice(1)); // Remove dollar sign and parse rate
        return acc + (quantity * rate);
      }
      return acc;
    }, 0);

    // Format the totalAmount to two decimal places
    const formattedTotalAmount = totalAmount.toFixed(2);
    setNewInvoice({ ...newInvoice, TotalAmount: formattedTotalAmount });

    console.log(formattedTotalAmount);

    // Parse the InvoiceDate (assumed to be in YYYY-MM-DD format)
    const invoiceDate = new Date(newInvoice.InvoiceDate);
    if (isNaN(invoiceDate.getTime())) {
      console.error('Invalid Invoice Date');
      return; // Handle invalid date input
    }

    // Add two months to the InvoiceDate
    invoiceDate.setMonth(invoiceDate.getMonth() + 2);

    // Format the new due date into YYYY-MM-DD
    const year = invoiceDate.getFullYear();
    const month = String(invoiceDate.getMonth() + 1).padStart(2, '0');
    const day = String(invoiceDate.getDate()).padStart(2, '0');
    const dueDate = `${year}-${month}-${day}`;

    // Create the invoice
    const invoiceResponse = await window.electron.ipcRenderer.invoke('create-invoice', {
      customerID: newInvoice.CustomerID,
      invoiceDate: newInvoice.InvoiceDate,
      dueDate: dueDate,
      totalAmount: formattedTotalAmount,
      paidAmount: 0,
      dueAmount: formattedTotalAmount,
      status: "Unpaid",
    });

    const invoiceID = invoiceResponse.InvoiceID;

    // Create invoice items
    for (const item of items) {
      if (item.ServiceDescription && item.ServiceDate && item.Quantity && item.Rate) {
        await window.electron.ipcRenderer.invoke('create-invoice-item', {
          invoiceID: invoiceID,
          serviceDate: item.ServiceDate,
          serviceDescription: item.ServiceDescription,
          quantity: item.Quantity,
          rate: item.Rate,
        });
      }
    }

    // Fetch updated invoices and items, then hide the form
    fetchInvoices();
    fetchInvoicesItems();
    setShowForm(false);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between">
        <h2 className="text-3xl font-semibold py-4 pt-2">Add New Invoice</h2>
        <button onClick={() => setShowForm(false)} className="font-bold text-4xl text-black px-2 hover:text-gray-400 transition">
          &times;
        </button>
      </div>
      <form onSubmit={handleSubmit} className='flex flex-col gap-3 text-2xl'>
        {/* Contact Form */}
        <InvoicesFormContact
          setNewInvoice={setNewInvoice}
        />

        <h2 className="text-xl font-semibold pb-2">Bill to</h2>
        <input
          type='date'
          className="textarea bg-yellow-50 focus:bg-yellow-100 cell h-full w-full flex overflow-hidden resize-none focus:outline-none"
          value={newInvoice.InvoiceDate}
          onChange={(e) => setNewInvoice({ ...newInvoice, InvoiceDate: e.target.value })}
          required
        />

        {/* Invoice Details */}
        <InvoicesFormItems
          items={items}
          setItems={setItems}
        />
        <div>
          <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded-md">
            Create Invoice
          </button>
        </div>
      </form>
    </div>
  );
};

export default InvoicesForm;