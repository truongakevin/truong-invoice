// src/renderer/Contacts.tsx
import React, { useState, useEffect } from 'react';

const Contacts = () => {
  const [contacts, setContacts] = useState<any[]>([]);
  const [newContact, setNewContact] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });

  useEffect(() => {
    const fetchContacts = async () => {
      const data = await window.electron.ipcRenderer.invoke('get-contacts');
      setContacts(data);
    };
    fetchContacts();
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await window.electron.ipcRenderer.invoke('create-contact', newContact);
    const updatedContacts = await window.electron.ipcRenderer.invoke('get-contacts');
    setContacts(updatedContacts);
    setNewContact({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
    });
  };


  return (
    <div>
      <h2>Contacts</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="First Name"
          value={newContact.firstName}
          onChange={(e) => setNewContact({ ...newContact, firstName: e.target.value })}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={newContact.lastName}
          onChange={(e) => setNewContact({ ...newContact, lastName: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={newContact.email}
          onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
        />
        <input
          type="text"
          placeholder="Phone"
          value={newContact.phone}
          onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
        />
        <input
          type="text"
          placeholder="Address"
          value={newContact.address}
          onChange={(e) => setNewContact({ ...newContact, address: e.target.value })}
        />
        <input
          type="text"
          placeholder="City"
          value={newContact.city}
          onChange={(e) => setNewContact({ ...newContact, city: e.target.value })}
        />
        <input
          type="text"
          placeholder="State"
          value={newContact.state}
          onChange={(e) => setNewContact({ ...newContact, state: e.target.value })}
        />
        <input
          type="text"
          placeholder="Zip Code"
          value={newContact.zipCode}
          onChange={(e) => setNewContact({ ...newContact, zipCode: e.target.value })}
        />
        <button type="submit">Create Contact</button>
      </form>

      <h3>Existing Contacts</h3>
      <ul>
        {contacts.map((contact, index) => (
          <li key={index}>{`${contact.FirstName} ${contact.LastName}`}</li>
        ))}
      </ul>
    </div>
  );
};

export default Contacts;