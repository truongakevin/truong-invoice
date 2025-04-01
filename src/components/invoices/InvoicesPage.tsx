import React, { useEffect } from 'react';
import InvoiceForm from './InvoiceForm';
import List from '../List';
import SearchBar from '../SearchBar';
import { Contact, Invoice, Service } from '../../types';

const InvoicesPage = ({
  contacts,
  fetchContacts,
  invoices,
  fetchInvoices,
  filteredInvoicesWithContacts,
  services,
  fetchServices,
  selectedContact,
  setSelectedContact,
  selectedInvoice,
  setSelectedInvoice,
  searchQuery,
  setSearchQuery,
  invoiceServices,
  setInvoiceServices,
  handleSave,
} : {
  contacts: Contact[];
	fetchContacts: () => void;
  invoices: Invoice[];
	fetchInvoices: () => void;
  filteredInvoicesWithContacts: Invoice[];
  services: Service[];
	fetchServices: () => void;
  selectedContact: Contact | null;
  setSelectedContact?: (selectedContact: Contact | null) => void;
  selectedInvoice: Invoice | null; 
  setSelectedInvoice: (selectedInvoice: Invoice | null) => void;
  invoiceServices: Service[] | null;
  setInvoiceServices: (invoiceServices: Service[] | null) => void;
  searchQuery: string; 
  setSearchQuery: (searchQuery: string) => void;
	handleSave: () => void;
}) => {
  
  useEffect(() => {
    if (selectedInvoice?.InvoiceID && selectedInvoice?.ContactID) {
      setSelectedContact(contacts.find(contact => contact.ContactID === selectedInvoice?.ContactID))
    }
    if (!selectedInvoice?.InvoiceDate) {
      setSelectedInvoice({
        ...selectedInvoice,
        InvoiceDate: new Date().toISOString().split('T')[0],
      });
    }
    fetchInvoices();
  }, [selectedInvoice]);


  const handleNew = async () => {
    // const contact = await window.electron.ipcRenderer.invoke('create-contact', {FirstName: '',LastName: '',Email: '',Phone: '',Address1: '',Address2: '',City: '',State: '',ZipCode: '',});
    setSelectedContact({ContactID: null, FirstName: '', LastName: '', Email: '', Phone: '', Address1: '', Address2: '', City: '', State: '', ZipCode: ''});
    fetchContacts();
    
    // const invoice = await window.electron.ipcRenderer.invoke('create-invoice', {ContactID: contact.ContactID, InvoiceDate: '', DueDate: '', TotalAmount: 0, PaidAmount: 0, DueAmount: 0, Status: '',});
    setSelectedInvoice({InvoiceID: null, ContactID: null, InvoiceDate: '', DueDate: '', TotalAmount: 0, PaidAmount: 0, DueAmount: 0, Status: ''});
    fetchInvoices();
  };

  const handleDelete = async () => {
    if (!selectedContact) return;
    if (!window.confirm("Are you sure you want to delete this contact?")) return;
    try {
      await window.electron.ipcRenderer.invoke('delete-invoice', selectedInvoice.InvoiceID);
      fetchInvoices();
      setSelectedInvoice(null);
    } catch (error) {
      console.error('Error deleting invoice:', error);
    }
  };

  return (
    <div className="w-full h-full flex flex-row gap-4">
      <div className="w-full flex flex-col gap-4">
        <SearchBar 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />
        <div className='flex flex-row gap-4'>
          <button 
            onClick={() => handleNew()}
            className='rounded-lg shadow-lg px-6 p-1 font-bold bg-green-600 hover:bg-green-700 text-white'>
              New
          </button>
          <button 
            onClick={() => handleDelete()}
            className='rounded-lg shadow-lg px-6 p-1 font-bold bg-red-600 hover:bg-red-700 text-white'>
              Delete
          </button>
        </div>
        <List
          fieldNames={['InvoiceID', 'Date', 'First Name', 'Last Name', 'Total', 'Due', 'Paid', 'Status']}
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
      <div className="w-full h-full bg-neutral-100 p-4">
        <InvoiceForm 
          contacts={contacts}
          fetchContacts={fetchContacts}
          invoices={invoices}
          fetchInvoices={fetchInvoices}
          services={services}
          fetchServices={fetchServices}
          selectedContact={selectedContact}
          setSelectedContact={setSelectedContact}
          selectedInvoice={selectedInvoice}
          setSelectedInvoice={setSelectedInvoice}
          invoiceServices={invoiceServices}
          setInvoiceServices={setInvoiceServices}
          handleSave={handleSave}
        />
      </div>
    </div>
  );
};

export default InvoicesPage;