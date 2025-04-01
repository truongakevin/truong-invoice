import React, { useEffect, useState } from 'react';
import { Contact } from '../types';

interface ContactFormProps {
  contacts: Contact[];
  selectedContact: Contact | null;
  setSelectedContact?: (selectedContact: Contact | null) => void;
  handleSave: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({
  contacts,
  selectedContact,
  setSelectedContact,
  handleSave,
}) => {
  const [filteredDropdownContacts, setFilteredDropdownContacts] = useState<Contact[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [activeField, setActiveField] = useState<keyof Contact | null>(null);

  const capitalizeFirstLetter = (text: string) => text ? text.charAt(0).toUpperCase() + text.slice(1) : '';

  const fetchFilteredDropdownContacts = async (key: keyof Contact, query: string) => {
    setFilteredDropdownContacts(contacts.filter((contact: Contact) =>
      (contact[key] as string).toLowerCase().startsWith(query.toLowerCase())
    ));
  };

  // useEffect(() => {
  //   console.log((selectedContact?.ContactID == null) , isDropdownVisible , filteredDropdownContacts.length > 0 , activeField )
  // }, [selectedContact]);
  useEffect(() => {
  }, []);

  const handleContactSelect = (contact: Contact) => {
    setSelectedContact({
      ContactID: contact.ContactID,
      FirstName: contact.FirstName,
      LastName: contact.LastName,
      Email: contact.Email,
      Phone: contact.Phone,
      Address1: contact.Address1,
      Address2: contact.Address2,
      City: contact.City,
      State: contact.State,
      ZipCode: contact.ZipCode,
    });
    setIsDropdownVisible(false);
  };

  const handleInputChange = (key: keyof Contact, value: string) => {
    if (value != selectedContact?.[key] && (key === "FirstName" || key === "LastName")) {
      setIsDropdownVisible(true);
      fetchFilteredDropdownContacts(key, value);
      value = capitalizeFirstLetter(value);
    }
    setSelectedContact({...selectedContact, [key]: value});
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <div className='flex flex-rov justify-between'>
        <h2 className="font-bold text-lg">Billing Address</h2>
        <h2 className="font-bold text-lg">{selectedContact?.ContactID}</h2>
      </div>
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
            className={`w-full placeholder-gray-500 border-0 rounded px-2 py-1 focus:outline-none bg-yellow-50 focus:bg-yellow-100`}
            {...props}
            />
            {(selectedContact?.ContactID == null) && isDropdownVisible && filteredDropdownContacts.length > 0 && activeField === key && (
              <div className="absolute bg-white shadow-xl w-full rounded" onMouseDown={(e) => e.preventDefault()}>
                {filteredDropdownContacts.map((contact, idx) => (
                  <div
                    key={idx}
                    className="px-3 py-2 cursor-pointer hover:bg-gray-200"
                    onClick={() => handleContactSelect(contact)}
                  >
                  {contact.FirstName} {contact.LastName}
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
          className={`placeholder-gray-500 border-0 rounded px-2 py-1 focus:outline-none bg-yellow-50 focus:bg-yellow-100`}
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
            className={`${className} placeholder-gray-500 border-0 rounded px-2 py-1 focus:outline-none bg-yellow-50 focus:bg-yellow-100`}
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
          className={`${className} placeholder-gray-500 border-0 rounded px-2 py-1 focus:outline-none bg-yellow-50 focus:bg-yellow-100`}
          {...props}
        />
      ))}
    </div>
  );
};

export default ContactForm;