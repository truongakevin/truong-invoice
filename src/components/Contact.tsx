import React, { useEffect, useState } from 'react';


const Contact = ({
  fetchContacts,
  contacts,
  selectedContact,
  setSelectedContact,
  // setNewInvoice,
} : { 
	fetchContacts: () => void;
  contacts: any;
  selectedContact: any,
  setSelectedContact?: (selectedContact: any) => void
  // setNewInvoice?:  React.Dispatch<React.SetStateAction<any>>;
}) => {
  const [filteredContacts, setFilteredContacts] = useState<any[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [activeField, setActiveField] = useState<any>(null);

  const capitalizeFirstLetter = (text: string) => text ? text.charAt(0).toUpperCase() + text.slice(1) : '';

  const fetchFilteredContacts = async (key: string, query: string) => {
    setFilteredContacts(contacts.filter((contact: any) =>
      contact[key].toLowerCase().startsWith(query.toLowerCase())
    ));
  };

  useEffect(() => {
  }, [selectedContact]);

  const handleContactSelect = (contact: any) => {
    setIsDropdownVisible(false);
    // setNewInvoice && setNewInvoice((prev) => ({
    //   ...prev,
    //   contactID: contact.ContactID,
    // }));
    setSelectedContact((prev) => ({
      ...prev,
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
    }));
    setIsDropdownVisible(false);
  };

  const handleInputChange = (key: keyof typeof selectedContact, value: string) => {
    if (value != selectedContact[key] && (key === "FirstName" || key === "LastName")) {
      setIsDropdownVisible(true);
      fetchFilteredContacts(key, value);
      value = capitalizeFirstLetter(value);
    }
    setSelectedContact({...selectedContact, [key]: value});
  };

  const handleSave = async () => {
    await window.electron.ipcRenderer.invoke('update-contact', selectedContact);
    fetchContacts();
  }

  return (
    <div className="w-full h-full flex flex-col gap-2">
      <div className='flex flex-rov justify-between'>
        <h2 className="font-bold text-lg">Billing Address</h2>
        <h2 className="font-bold text-lg">{selectedContact.ContactID}</h2>
      </div>
      <div className="flex flex-row gap-2">
        {[
          { key: 'FirstName', type: 'text', placeholder: 'First Name', required: true },
          { key: 'LastName', type: 'text', placeholder: 'Last Name', required: true },
        ].map(({ key, ...props }) => (
          <div key={key} className="relative w-full">
            <input
            key={key}
            value={selectedContact[key] || ''}
            onFocus={() => setActiveField(key)}
            onBlur={() => handleSave()}
            onChange={(e) => handleInputChange(key, e.target.value)}
            className="w-full placeholder-gray-500 border-0 rounded px-2 py-1 focus:outline-none bg-yellow-50 focus:bg-yellow-100"
            {...props}
            />
            {isDropdownVisible && filteredContacts.length > 0 && activeField === key && (
              <div className="absolute bg-white shadow-xl w-full rounded">
                {filteredContacts.map((contact, idx) => (
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
        { key: 'Address1', type: 'text', placeholder: 'Address', required: true },
        { key: 'Address2', type: 'text', placeholder: 'Apartment, Suite, Etc' },
      ].map(({ key, ...props }) => (
        <input
          key={key}
          value={selectedContact[key] || ''}
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
            value={selectedContact[key] || ''}
            onBlur={() => handleSave()}
            onChange={(e) => setSelectedContact({ ...selectedContact, [key]: e.target.value })}
            className={`${className} placeholder-gray-500 border-0 rounded px-2 py-1 focus:outline-none bg-yellow-50 focus:bg-yellow-100`}
            {...props}
          />
        ))}
      </div>

      {[
        { key: 'Email', type: 'email', placeholder: 'Email' },
        { key: 'Phone', type: 'number', placeholder: 'Phone', pattern: '^\\d{10}$', title: 'Phone number must be 10 digits.' , className: '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'},
      ].map(({ key, className, ...props }) => (
        <input
          key={key}
          value={selectedContact[key] || ''}
          onBlur={() => handleSave()}
          onChange={(e) => setSelectedContact({ ...selectedContact, [key]: e.target.value })}
          className={`${className} placeholder-gray-500 border-0 rounded px-2 py-1 focus:outline-none bg-yellow-50 focus:bg-yellow-100`}
          {...props}
        />
      ))}
    </div>
  );
};

export default Contact;