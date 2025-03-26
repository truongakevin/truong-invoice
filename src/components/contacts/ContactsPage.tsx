import React, { useState, useEffect } from 'react';
import ContactsList from './ContactsList';
import ContactsForm from './ContactsForm';
import ContactsSearchBar from './ContactsSearchBar';
import ContactsProfile from './ContactsProfile';

const ContactsPage = () => {
  const [contacts, setContacts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [newContact, setNewContact] = useState({
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

  const fetchContacts = async () => {
    const data = await window.electron.ipcRenderer.invoke('get-contacts');
    setContacts(data);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await window.electron.ipcRenderer.invoke('create-contact', newContact);
    fetchContacts();
    setNewContact({ firstName: '', lastName: '', email: '', phone: '', address1: '', address2: '', city: '', state: '', zipCode: '' });
    setShowForm(false);
  };

  const filteredContacts = contacts.filter(contact => {
    return (
      contact.FirstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.LastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.Phone.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="">
      <div className="flex flex-row gap-12 items-end pb-4">
        <div>
          <h1 className="text-4xl font-semibold py-2">Contacts</h1>
          <h2 className="text-gray-500 text-xl font-semibold">Manage and create contacts for clients</h2>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="font-semibold text-lg bg-green-600 text-white rounded-lg shadow-lg px-6 py-2 h-min hover:bg-green-700 transition">New
          </button>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 flex justify-center items-center z-20">
			<div className="absolute inset-0 bg-black opacity-30 z-10"></div>
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mt-10 z-20">
            <ContactsForm handleSubmit={handleSubmit} newContact={newContact} setNewContact={setNewContact} setShowForm={setShowForm} />
          </div>
        </div>
      )}

      <div className="w-full flex flex-col gap-8">
        <div className="w-full flex flex-row gap-4">
			<div className="w-4/12 flex flex-col gap-4">
				<ContactsSearchBar query={searchQuery} setQuery={setSearchQuery} />
				{selectedContact && <ContactsProfile contact={selectedContact} fetchContacts={fetchContacts} setSelectedContact={setSelectedContact} />}
			</div>
			<ContactsList contacts={filteredContacts} setSelectedContact={setSelectedContact} />
        </div>
      </div>
    </div>
  );
};

export default ContactsPage;