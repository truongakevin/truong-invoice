import React, { useEffect } from 'react';
import { useAppContext } from '../AppContext';
import ServicesForm from './ServicesForm';
import ContactForm from './ContactForm';

const InvoiceForm : React.FC = () => {
  const {    
    invoices,
    contacts,
    fetchInvoices,
    setSelectedContact,
    selectedInvoice,
    setSelectedInvoice,
    handleSave,
  } = useAppContext();

  // Load Invoice
  // useEffect(() => {
  //   if(!selectedInvoice?.InvoiceID && invoices){
  //     setSelectedInvoice(invoices.find(invoice => invoice.InvoiceID == 1));
  //     console.log(invoices);
  //     console.log(invoices.find(invoice => invoice.ContactID = 1));
  //   }
  // }, [invoices]);

  useEffect(() => {
    if (selectedInvoice?.InvoiceID && selectedInvoice?.ContactID) {
      setSelectedContact(contacts.find(contact => contact.ContactID === selectedInvoice?.ContactID));
    }
    if (!selectedInvoice?.InvoiceDate) {
      setSelectedInvoice({
        ...selectedInvoice,
        InvoiceDate: new Date().toISOString().split('T')[0],
      });
    }
    fetchInvoices();
  }, [selectedInvoice]);

  return (
    <div className="w-full h-full flex flex-col gap-2 overflow-y-auto">
        <ContactForm />

        <div className='flex flex-row justify-between font-bold'>
          <h3 className="">Invoice Date</h3>
          <div className="flex flex-row border-2 border-black items-center">
            <div className="px-1 border-r border-black">InvoiceID</div>
            <div className="px-1 border-l border-black">{selectedInvoice?.InvoiceID ? selectedInvoice?.InvoiceID : 'None'}</div>
          </div>
        </div>
        
        <input
          type="date"
          className="h-min w-fit inputdiv"
          value={selectedInvoice?.InvoiceDate || new Date().toISOString().split('T')[0]}
          onChange={(e) => setSelectedInvoice({ ...selectedInvoice, InvoiceDate: e.target.value })}
          onBlur={() => handleSave()}
        />

        <ServicesForm />
        <div>
      </div>
    </div>
  );
};

export default InvoiceForm;