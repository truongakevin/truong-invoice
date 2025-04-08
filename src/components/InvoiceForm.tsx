import React, { useEffect } from 'react';
import { useAppContext } from '../AppContext';
import ServicesForm from './ServicesForm';
import ContactForm from './ContactForm';

const InvoiceForm : React.FC = () => {
  const {
    selectedInvoice,
    setSelectedInvoice,
    handleSave,
  } = useAppContext();

  useEffect(() => {
  }, []);
  return (
    <div className="w-full h-full flex flex-col gap-2 overflow-y-auto">
        <ContactForm />

        <div className='flex flex-row justify-between'>
          <h3 className="font-bold text-lg">Invoice Date</h3>
          <h3 className="font-bold text-lg">{selectedInvoice?.InvoiceID}</h3>
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