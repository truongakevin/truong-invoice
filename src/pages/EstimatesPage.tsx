import React, { useEffect } from 'react';
import { useAppContext, NewButton, DeleteButton } from '../AppContext';
import InvoiceForm from '../components/InvoiceForm';
import List from '../components/List';
import SearchBar from '../components/SearchBar';
import ResizablePanel from '../components/ResizablePanel';

const InvoicesPage : React.FC = () => {
  const {
    contacts,
    fetchInvoices,
    filteredInvoicesWithContacts,
    services,
    setSelectedContact,
    selectedInvoice,
    setSelectedInvoice,
  } = useAppContext();
  
  useEffect(() => {
    if (selectedInvoice?.InvoiceID && selectedInvoice?.ContactID) {
      setSelectedContact(contacts.find(contact => contact.ContactID === selectedInvoice?.ContactID))
    }
    fetchInvoices();
  }, [selectedInvoice]);

  return (
    <ResizablePanel>
      <div className="h-full flex flex-col gap-2">
        <div className='flex flex-row gap-2'>
          <NewButton />
          <DeleteButton />
        </div>
        <SearchBar />
        <List
          fieldNames={['ID', 'Date', 'First Name', 'Last Name', 'Total', 'Due', 'Paid', 'Status']}
          fieldValues={['InvoiceID', 'InvoiceDate', 'Contact.FirstName', 'Contact.LastName', 'TotalAmount', 'DueAmount', 'PaidAmount', 'Status']}
          items={filteredInvoicesWithContacts}
          selectedCell={selectedInvoice}
          setSelectedCell={setSelectedInvoice}
        />
        <List
          fieldNames={['Service ID', 'Invoice ID', 'Service Date', 'Service Description', 'Quantity', 'Rate']}
          fieldValues={['ServiceID', 'InvoiceID', 'ServiceDate', 'ServiceDescription', 'Quantity', 'Rate']}
          items={services}
        />
      </div>
      <InvoiceForm />
    </ResizablePanel>
  );
};

export default InvoicesPage;