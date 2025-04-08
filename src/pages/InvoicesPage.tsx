import React from 'react';
import { useAppContext, NewButton, DeleteButton } from '../AppContext';
import InvoiceForm from '../forms/InvoiceForm';
import List from '../components/List';
import SearchBar from '../components/SearchBar';
import ResizablePanel from '../components/ResizablePanel';

const InvoicesPage : React.FC = () => {
  const {
    filteredInvoicesWithContacts,
    services,
    selectedInvoice,
    setSelectedInvoice,
  } = useAppContext();

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