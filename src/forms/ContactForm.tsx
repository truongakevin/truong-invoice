import React from 'react';
import { Contact } from '../types';
import { useAppContext } from '../AppContext';
import ContactDropdown from '../components/ContactDropdown';


const ContactForm: React.FC = () => {
  const {
    selectedContact,
    setSelectedContact,
    handleSave,
  } = useAppContext();

  return (
    <div className="flex flex-col gap-2">
      <div className='flex flex-row justify-between font-bold'>
        <h3 className="">Billing Address</h3>
        <div className="flex flex-row border-2 border-black items-center">
          <div className="px-1 border-r border-black">ContactID</div>
          <div className="px-1 border-l border-black">{selectedContact?.ContactID ? selectedContact?.ContactID : 'None'}</div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <ContactDropdown />

        {[
          { key: 'Address1', type: 'text', placeholder: 'Address'},
          { key: 'Address2', type: 'text', placeholder: 'Apartment, Suite, Etc' },
        ].map(({ key, ...props }) => (
          <input
            key={key}
            value={selectedContact?.[key as keyof Contact] || ''}
            onBlur={() => handleSave()}
            onChange={(e) => setSelectedContact({ ...selectedContact, [key]: e.target.value })}
            className={`inputdiv`}
            {...props}
          />
        ))}

        <div className="flex flex-row gap-2">
          {[
            { key: 'City', type: 'text', placeholder: 'City', className: 'w-6/12' },
            { key: 'State', type: 'text', placeholder: 'State', className: 'w-2/12' },
            { key: 'ZipCode', type: 'number', placeholder: 'Zip Code', className: 'w-4/12 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none' },
          ].map(({ key, className, ...props }) => (
            <input
              key={key}
              value={selectedContact?.[key as keyof Contact] || ''}
              onBlur={() => handleSave()}
              onChange={(e) => setSelectedContact({ ...selectedContact, [key]: e.target.value })}
              className={`${className} inputdiv`}
              {...props}
            />
          ))}
        </div>

        {[
          { key: 'Email', type: 'Email', placeholder: 'Email' },
          { key: 'Phone', type: 'number', placeholder: 'Phone', className: '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'},
        ].map(({ key, className, ...props }) => (
          <input
            key={key}
            value={selectedContact?.[key as keyof Contact] || ''}
            onBlur={() => handleSave()}
            onChange={(e) => setSelectedContact({ ...selectedContact, [key]: e.target.value })}
            className={`${className} inputdiv`}
            {...props}
          />
        ))}
      </div>
    </div>
  );
};

export default ContactForm;

