import React, { useState, useEffect } from 'react';
import List from '../List';
import Contact from '../Contact';
import SearchBar from '../SearchBar';

const ContactsPage = () => {
  const [contacts, setContacts] = useState<any[]>([]);
  const [selectedContact, setSelectedContact] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState('');

  const fetchContacts = async () => {
    const data = await window.electron.ipcRenderer.invoke('get-contacts');
    setContacts(data);
  };

  useEffect(() => {
    fetchContacts();
    console.log(selectedContact)
  }, []);

  const filteredContacts = contacts.filter(contact => {
    return (contact.FirstName == null ? console.log(contact) :
      contact.FirstName.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
      contact.LastName.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
      contact.Phone.toLowerCase().startsWith(searchQuery.toLowerCase())
    );
  });

  const handleNew = async () => {
    const result = await window.electron.ipcRenderer.invoke('create-contact', {firstName: '',lastName: '',email: '',phone: '',address1: '',address2: '',city: '',state: '',zipCode: '',
    });
    setSelectedContact({
      ContactID: result.ContactID,
      FirstName: '',
      LastName: '',
      Email: '',
      Phone: '',
      Address1: '',
      Address2: '',
      City: '',
      State: '',
      ZipCode: '',
    });
    fetchContacts();
  };

  const handleDelete = async () => {
    if (!selectedContact) return;
    // const confirmDelete = window.confirm("Are you sure you want to delete this contact?");
    if (!window.confirm("Are you sure you want to delete this contact?")) return;
    try {
      await window.electron.ipcRenderer.invoke('delete-contact', selectedContact.ContactID);
      fetchContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };


  return (
    <div className="h-full w-full flex flex-row gap-4">
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
          fieldNames={['ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Address', 'City']} 
          fieldValues={['ContactID', 'FirstName', 'LastName', 'Email', 'Phone', 'Address1', 'City']} 
          items={filteredContacts} 
          selectedCell={selectedContact} 
          setSelectedCell={setSelectedContact} 
        />
      </div>
      <div className="w-full bg-neutral-100 p-4">
        <Contact 
          fetchContacts={fetchContacts}
          contacts={contacts}
          selectedContact={selectedContact}
          setSelectedContact={setSelectedContact}
        />
      </div>
    </div>
  );
};

export default ContactsPage;