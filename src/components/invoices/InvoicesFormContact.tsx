import React, { useEffect, useState } from 'react';

const InvoicesFormContact = ({ 
  setNewInvoice,
} : { 
  setNewInvoice:  React.Dispatch<React.SetStateAction<any>>;
}) => {
  const [selectedContact, setSelectedContact] = useState<any>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
  });


  const [filteredContacts, setFilteredContacts] = useState<any[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [activeField, setActiveField] = useState<'firstName' | 'lastName' | 'ServiceDescription' | null>(null);  // Include ServiceDescription
  const [isContactSelected, setIsContactSelected] = useState(false);

  const capitalizeFirstLetter = (text: string) => text ? text.charAt(0).toUpperCase() + text.slice(1) : '';

  const fetchContacts = async (query: string, key: 'FirstName' | 'LastName') => {
    const fetchedContacts = await window.electron.ipcRenderer.invoke('get-contacts');
    setFilteredContacts(
      fetchedContacts.filter((contact: any) =>
        contact[key].toLowerCase().startsWith(query.toLowerCase())
      )
    );
  };

  useEffect(() => {
    if (!isContactSelected && selectedContact.firstName && activeField === 'firstName') {
      fetchContacts(selectedContact.firstName, 'FirstName');
      setIsDropdownVisible(true);
    } else if (!isContactSelected && selectedContact.lastName && activeField === 'lastName') {
      fetchContacts(selectedContact.lastName, 'LastName');
      setIsDropdownVisible(true);
    } else {
      setIsDropdownVisible(false);
    }
  }, [selectedContact.firstName, selectedContact.lastName, isContactSelected, activeField]);


  const handleContactSelect = (contact: any) => {
    setIsContactSelected(true);
    setIsDropdownVisible(false);
    setSelectedContact({
      firstName: contact.FirstName,
      lastName: contact.LastName,
      email: contact.Email,
      phone: contact.Phone,
      address1: contact.Address1,
      address2: contact.Address2,
      city: contact.City,
      state: contact.State,
      zipCode: contact.ZipCode,
    });
    setNewInvoice((prev) => ({
      ...prev,
      CustomerID: contact.CustomerID,
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof typeof selectedContact) => {
    setSelectedContact({ ...selectedContact, [field]: capitalizeFirstLetter(e.target.value) });
    setIsContactSelected(false);
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold pb-2">Bill to</h2>
      <div className="flex flex-row gap-3">
        {['firstName', 'lastName'].map((field, index) => (
          <div key={index} className="relative w-full">
            <input
              type="text"
              placeholder={field === 'firstName' ? 'First Name' : 'Last Name'}
              value={selectedContact[field] || ''}
              onFocus={() => setActiveField(field as 'firstName' | 'lastName')}
              onChange={(e) => handleInputChange(e, field as 'firstName' | 'lastName')}
              className="w-full placeholder-gray-700 border-0 rounded px-0 py-0 focus:outline-none bg-yellow-50 focus:bg-yellow-100"
              required
            />
            {isDropdownVisible && filteredContacts.length > 0 && activeField === field && (
              <div className="absolute bg-white shadow-sm w-full border rounded-md mt-1 z-20">
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
          { type: 'email', placeholder: 'Email', key: 'email' },
          { type: 'number', placeholder: 'Phone', key: 'phone', pattern: '^\\d{10}$', title: 'Phone number must be 10 digits.' },
          { type: 'text', placeholder: 'Address', key: 'address1', required: true },
          { type: 'text', placeholder: 'Apartment, Suite, Etc', key: 'address2' },
        ].map(({ key, ...props }) => (
          <input
            key={key}
            value={selectedContact[key] || ''}
            onChange={(e) => setSelectedContact({ ...selectedContact, [key]: e.target.value })}
            className="w-full placeholder-gray-700 border-0 rounded px-0 py-0 focus:outline-none bg-yellow-50 focus:bg-yellow-100"
            {...props}
          />
        ))}

        <div className="flex flex-row gap-3">
          {[
            { type: 'text', placeholder: 'City', key: 'city', className: 'w-6/12' },
            { type: 'text', placeholder: 'State', key: 'state', className: 'w-3/12' },
            { type: 'text', placeholder: 'Zip Code', key: 'zipCode', className: 'w-3/12' },
          ].map(({ key, className, ...props }) => (
            <input
              key={key}
              value={selectedContact[key] || ''}
              onChange={(e) => setSelectedContact({ ...selectedContact, [key]: e.target.value })}
              className={`${className} placeholder-gray-700 border-0 focus:outline-none bg-yellow-50 focus:bg-yellow-100`}
              {...props}
            />
          ))}
        </div>
    </div>
  );
};

export default InvoicesFormContact;