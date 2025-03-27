import React, { useState, useEffect } from 'react';
import ContactsForm from './ContactsForm';
import ContactsProfile from './ContactsProfile';
import List from '../List';
import SearchBar from '../SearchBar';

const ContactsPage = () => {
  const [contacts, setContacts] = useState<any[]>([]);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchContacts = async () => {
    const data = await window.electron.ipcRenderer.invoke('get-contacts');
    setContacts(data);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const filteredContacts = contacts.filter(contact => {
    return (
      contact.FirstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.LastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.Phone.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className='flex flex-col'>
      <div className='flex flex-row gap-4 items-end font-semibold'>
          <h2 className="text-4xl">Manage and create contacts for clients</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="font-semibold text-lg bg-green-600 text-white rounded-lg shadow-lg px-6 py-2 h-min hover:bg-green-700 transition">New
          </button>
        )}
      </div>

      <div className="w-full flex flex-row gap-4">
        <div className="w-full flex flex-col gap-4">
          <SearchBar query={searchQuery} setQuery={setSearchQuery} />
          <div className="w-full flex flex-row gap-4">
              <List fieldNames={['ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Address', 'City']} fieldValues={['CustomerID', 'FirstName', 'LastName', 'Email', 'Phone', 'Address1', 'City']} items={filteredContacts.map((contact) => ({CustomerID: contact.CustomerID, FirstName: contact.FirstName, LastName: contact.LastName, Email: contact.Email, Phone: contact.Phone, Address1: contact.Address1, City: contact.City}))} setSelectedCell={setSelectedContact} />
            {selectedContact && (
              <div className="w-5/12 flex flex-col gap-8">
                <ContactsProfile
                  selectedContact={selectedContact}
                  fetchContacts={fetchContacts}
                  setSelectedContact={setSelectedContact}
                />
              </div>
            )}
          </div>
        </div>
        {showForm && (
          <div className="fixed inset-0 flex justify-center items-center z-20">
            <div className="absolute inset-0 bg-black opacity-10 z-10"></div>
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mt-10 z-20">
              <ContactsForm 
                fetchContacts={fetchContacts}
                setShowForm={setShowForm}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactsPage;