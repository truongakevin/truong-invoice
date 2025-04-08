import React from 'react';
import { useAppContext, NewButton, DeleteButton } from '../AppContext';
import EstimateForm from '../forms/EstimateForm';
import List from '../components/List';
import SearchBar from '../components/SearchBar';
import ResizablePanel from '../components/ResizablePanel';

const EstimatesPage : React.FC = () => {
  const {
    services,
    selectedEstimate,
    setSelectedEstimate,
    filteredEstimatesWithContacts,
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
          fieldNames={['ID', 'Date', 'First Name', 'Last Name', 'Total']}
          fieldValues={['EstimateID', 'EstimateDate', 'Contact.FirstName', 'Contact.LastName', 'TotalAmount']}
          items={filteredEstimatesWithContacts}
          selectedCell={selectedEstimate}
          setSelectedCell={setSelectedEstimate}
        />
        <List
          fieldNames={['Service ID', 'Invoice', 'Estimate', 'Service Date', 'Service Description', 'Quantity', 'Rate']}
          fieldValues={['ServiceID', 'InvoiceID', 'EstimateID', 'ServiceDate', 'ServiceDescription', 'Quantity', 'Rate']}
          items={services}
        />
      </div>
      <EstimateForm />
    </ResizablePanel>
  );
};

export default EstimatesPage;