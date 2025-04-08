import React, { useState } from 'react';
import { Contact } from '../types';
import { useAppContext } from '../AppContext';


const ContactForm: React.FC = () => {
  const {
    contacts,
    selectedContact,
    setSelectedContact,
    handleSave,
  } = useAppContext();
  
  const [filteredDropdownContacts, setFilteredDropdownContacts] = useState<Contact[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [activeField, setActiveField] = useState<keyof Contact | null>(null);

  const capitalizeFirstLetter = (text: string) => text ? text.charAt(0).toUpperCase() + text.slice(1) : '';

  const fetchFilteredDropdownContacts = (key: keyof Contact, query: string) => {
    setFilteredDropdownContacts(contacts.filter((contact: Contact) =>
      (contact[key] as string).toLowerCase().startsWith(query.toLowerCase())
    ));
  };

  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact);
    setIsDropdownVisible(false);
  };

  const handleInputChange = (key: keyof Contact, value: string) => {
    if (value != selectedContact?.[key] && (key === "FirstName" || key === "LastName")) {
      setIsDropdownVisible(true);
      fetchFilteredDropdownContacts(key, value);
      value = capitalizeFirstLetter(value);
    }
    setSelectedContact({ ...selectedContact, [key]: value });
  };

  return (
    <div className="flex flex-col w-full gap-2">
      <div className='flex flex-row justify-between font-bold'>
        <h3 className="">Billing Address</h3>
        <div className="flex flex-row border-2 border-black items-center">
          <div className="px-1 border-r border-black">ContactID</div>
          <div className="px-1 border-l border-black">{selectedContact?.ContactID ? selectedContact?.ContactID : 'None'}</div>
        </div>
      </div>
      <div className="w-full flex flex-col gap-2">
        <div className="flex flex-row gap-2">
          {[
            { key: 'FirstName', type: 'text', placeholder: 'First Name' },
            { key: 'LastName', type: 'text', placeholder: 'Last Name' },
          ].map(({ key, ...props }) => (
            <div key={key} className="relative w-full">
              <input
              key={key}
              value={selectedContact?.[key as keyof Contact] || ''}
              onFocus={() => setActiveField(key as keyof Contact)}
              onBlur={() => {setIsDropdownVisible(false); handleSave()}}
              onChange={(e) => handleInputChange(key as keyof Contact, e.target.value)}
              className={`w-full inputdiv`}
              {...props}
              />
              {(selectedContact?.ContactID == null) && isDropdownVisible && filteredDropdownContacts.length > 0 && activeField === key && (
                <div className="absolute bg-white w-full" onMouseDown={(e) => e.preventDefault()}>
                  {filteredDropdownContacts.map((contact, idx) => (
                    <div
                      key={idx}
                      className="px-2 py-1 cursor-pointer hover:bg-neutral-100"
                      onClick={() => handleContactSelect(contact)}
                    >
                    <div>{contact.FirstName} {contact.LastName}</div>
                    <div>
                      {contact.Address1} 
                      {contact.Address2} 
                      {contact.City && `, ${contact.City}`}
                      {contact.State && `, ${contact.State}`}
                    </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

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

