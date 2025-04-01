import React, { useEffect } from 'react';
import ServicesForm from './ServicesForm';
import ContactForm from '../ContactForm';
import { Contact, Invoice, Service } from '../../types';

const InvoiceForm = ({
  contacts,
  fetchContacts,
  invoices,
  fetchInvoices,
  services,
  fetchServices,
  selectedContact,
  setSelectedContact,
  selectedInvoice,
  setSelectedInvoice,
  invoiceServices,
  setInvoiceServices,
  handleSave,
} : { 
  contacts: Contact[];
  fetchContacts: () => void;
  invoices: Invoice[];
  fetchInvoices: () => void;
  services: Service[];
  fetchServices: () => void;
  selectedContact: Contact | null;
  setSelectedContact?: (selectedContact: Contact | null) => void;
  selectedInvoice: Invoice | null; 
  setSelectedInvoice: (selectedInvoice: Invoice | null) => void;
  invoiceServices: Service[] | null;
  setInvoiceServices: (invoiceServices: Service[] | null) => void;
  handleSave: () => void;
}) => {
  useEffect(() => {
  }, []);
  return (
    <div className="w-full h-full flex flex-col gap-2 overflow-y-auto">
        <ContactForm
          contacts={contacts}
          selectedContact={selectedContact}
          setSelectedContact={setSelectedContact}
          handleSave={handleSave}
        />

        <div className='flex flex-row justify-between'>
          <h2 className="font-bold text-lg">Invoice Date</h2>
          <h2 className="font-bold text-lg">{selectedInvoice?.InvoiceID}</h2>
        </div>
        
        <input
          type="date"
          className="h-fit placeholder-gray-500 border-0 rounded px-2 py-1 focus:outline-none bg-yellow-50 focus:bg-yellow-100"
          value={selectedInvoice?.InvoiceDate || new Date().toISOString().split('T')[0]}
          onChange={(e) => setSelectedInvoice({ ...selectedInvoice, InvoiceDate: e.target.value })}
          onBlur={() => handleSave()}
        />

        <ServicesForm
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
        <div>
      </div>
    </div>
  );
};

export default InvoiceForm;