import React, { useEffect, useState } from 'react';

const InvoicesList = ({
  invoices,
  setSelectedInvoice,
  searchQuery
}: {
  invoices: any[];
  setSelectedInvoice: (invoice: any) => void;
  searchQuery: any;
}) => {
  const [sortKey, setSortKey] = useState<string>('InvoiceID');
  const [sortOrder, setSortOrder] = useState<string>('asc');
  const [customers, setCustomers] = useState<any[]>([]);

  const fetchCustomers = async () => {
    const data = await window.electron.ipcRenderer.invoke('get-contacts');
    setCustomers(data);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);
  
  // Sort function that handles nested keys
  const sortData = (data: any[], sortKey: string, order: string) => {
    const getValue = (obj: any, key: string) => {
      const keys = key.split('.');
      return keys.reduce((acc, part) => acc && acc[part], obj);
    };
  
    return data.sort((a, b) => {
      const aValue = getValue(a, sortKey);
      const bValue = getValue(b, sortKey);
  
      if (aValue < bValue) return order === 'asc' ? -1 : 1;
      if (aValue > bValue) return order === 'asc' ? 1 : -1;
      return 0;
    });
  };

  // Handle sorting when a header is clicked
  const handleSort = (key: string) => {
    const newOrder = sortKey === key && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortKey(key);
    setSortOrder(newOrder);
  };

  // Combine invoices with customer data based on CustomerID
  const invoicesWithCustomers = invoices.map(invoice => {
    const customer = customers.find(c => c.CustomerID === invoice.CustomerID);
    return {
      ...invoice,
      Customer: customer || {}
    };
  });
  
  // Sort invoices based on selected sort key and order
  const sortedInvoices = sortData(invoicesWithCustomers, sortKey, sortOrder);


  const filteredContacts = sortedInvoices.filter((invoice) => {
    return (
      (invoice.Customer.FirstName && invoice.Customer.FirstName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (invoice.Customer.LastName && invoice.Customer.LastName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (invoice.Customer.Phone && invoice.Customer.Phone.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <div className="w-full shadow-lg sm:rounded-lg h-min max-h-[50rem] overflow-y-auto">
      <table className="w-full text-md text-left text-black rounded-lg">
        <thead className="bg-gray-200 sticky top-0 z-10">
          <tr>        
            {['InvoiceID', 'InvoiceDate', 'First Name', 'Last Name', 'TotalAmount', 'DueAmount', 'PaidAmount', 'Status'].map((header) => (
              <th
                key={header}
                className="px-2 py-2.5 cursor-pointer"
                onClick={() => handleSort(header === 'Amount' ? 'TotalAmount' : header === 'First Name' ? 'Customer.FirstName' : header === 'Last Name' ? 'Customer.LastName' : header.replace(' ', ''))}
              >
                {header}
                {sortKey === (header === 'Amount' ? 'TotalAmount' : header === 'First Name' ? 'Customer.FirstName' : header === 'Last Name' ? 'Customer.LastName' : header.replace(' ', '')) && (
                  <span>{sortOrder === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredContacts.map((invoice, index) => (
            <tr
              key={index}
              className="hover:bg-green-50 even:bg-gray-100 odd:bg-gray-50 transition"
              onClick={() => {
                setSelectedInvoice(invoice);
              }}
            >
              <td className="border px-2 py-1.5">{invoice.InvoiceID}</td>
              <td className="border px-2 py-1.5">{invoice.InvoiceDate}</td>
              <td className="border px-2 py-1.5">{invoice.Customer.FirstName}</td>
              <td className="border px-2 py-1.5">{invoice.Customer.LastName}</td>
              <td className="border px-2 py-1.5">{invoice.TotalAmount}</td>
              <td className="border px-2 py-1.5">{invoice.DueAmount}</td>
              <td className="border px-2 py-1.5">{invoice.PaidAmount}</td>
              <td className="border px-2 py-1.5">{invoice.Status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoicesList;