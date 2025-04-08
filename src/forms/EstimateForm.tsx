import React, { useEffect } from 'react';
import { useAppContext } from '../AppContext';
import ServicesForm from './ServicesForm';
import ContactForm from './ContactForm';

const EstimateForm : React.FC = () => {
  const {
    contacts,
    fetchEstimates,
    setSelectedContact,
    selectedEstimate,
    setSelectedEstimate,
    handleSave,
  } = useAppContext();

  useEffect(() => {
    if (selectedEstimate?.EstimateID && selectedEstimate?.ContactID) {
      setSelectedContact(contacts.find(contact => contact.ContactID === selectedEstimate?.ContactID));
    }
    if (!selectedEstimate?.EstimateDate) {
      setSelectedEstimate({
        ...selectedEstimate,
        EstimateDate: new Date().toISOString().split('T')[0],
      });
    }
    fetchEstimates();
  }, [selectedEstimate]);

  return (
    <div className="w-full h-full flex flex-col gap-2 overflow-y-auto">
        <ContactForm />

        <div className='flex flex-row justify-between font-bold'>
          <h3 className="">Estimate Date</h3>
          <div className="flex flex-row border-2 border-black items-center">
            <div className="px-1 border-r border-black">EstimateID</div>
            <div className="px-1 border-l border-black">{selectedEstimate?.EstimateID ? selectedEstimate?.EstimateID : 'None'}</div>
          </div>
        </div>
        
        <input
          type="date"
          className="h-min w-fit inputdiv"
          value={selectedEstimate?.EstimateDate || new Date().toISOString().split('T')[0]}
          onChange={(e) => setSelectedEstimate({ ...selectedEstimate, EstimateDate: e.target.value })}
          onBlur={() => handleSave()}
        />

        <ServicesForm />
        <div>
      </div>
    </div>
  );
};

export default EstimateForm;