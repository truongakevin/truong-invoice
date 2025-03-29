import React, { useEffect, useState } from 'react';

import { FaEdit, FaTrash, FaRegWindowClose } from "react-icons/fa";
import { ImExit } from "react-icons/im";


const ContactsProfile = ({ 
  selectedContact, 
  fetchContacts,
  setSelectedContact
}: { 
  selectedContact: any, 
  fetchContacts: () => void,
  setSelectedContact: (selectedContact: any) => void
}) => {
  const [isEditing, setIsEditing] = useState(true);

  const capitalizeFirstLetter = (text: string) => {
		return text.charAt(0).toUpperCase() + text.slice(1);
	};
  
  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    selectedContact[e.target.name] = e.target.name === "FirstName" || e.target.name === "LastName" ? capitalizeFirstLetter(e.target.value) : e.target.value;
    try {
      await window.electron.ipcRenderer.invoke('update-contact', selectedContact);
    } catch (error) {
      console.error('Error saving contact:', error);
    }
  };

  const handleSave = async () => {
    try {
      await window.electron.ipcRenderer.invoke('update-contact', selectedContact);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving contact:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedContact) return;
    const confirmDelete = window.confirm("Are you sure you want to delete this contact?");
    if (!confirmDelete) return;
    try {
      await window.electron.ipcRenderer.invoke('delete-contact', selectedContact.ContactID);
      setSelectedContact(null);
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [selectedContact]);

  return (
    <div className="bg-gray-50 p-4 border-2 rounded-lg shadow-md">
      {!isEditing ? (
        <div className='w-full m-auto flex flex-col gap-4'>
          <div className='flex flex-col'>
            <div className="flex flex-row justify-between">
              <div className='flex flex-row gap-4 items-center font-semibold'>
                <h2 className="text-2xl">{selectedContact.FirstName} {selectedContact.LastName}</h2>
                <button 
                className="h-min text-lg text-neutral-700 hover:text-neutral-500 transition" 
                onClick={() => setIsEditing(true)} > Edit </button>
                <button 
                className="h-min text-lg text-neutral-700 hover:text-neutral-500 transition" 
                onClick={handleDelete} > Delete </button>
              </div>
              <button 
              className="text-xl text-black hover:text-neutral-500 transition"
              onClick={() => setSelectedContact(null)} ><FaRegWindowClose /></button>
                {/* <button 
                className="text-xl text-black hover:text-neutral-500 transition" 
                onClick={() => setIsEditing(true)} ><FaEdit /></button>
                <button 
                className="text-xl text-black hover:text-neutral-500 transition" 
                onClick={handleDelete} ><FaTrash /></button>
              </div>
              <button 
              className="text-xl text-black hover:text-neutral-500 transition"
              onClick={() => setSelectedContact(null)} ><FaRegWindowClose /></button> */}
            </div>
            {selectedContact.Email && <p className="text-xl text-gray-700"><strong>Email:</strong> {selectedContact.Email}</p>}
            {selectedContact.Phone && <p className="text-xl text-gray-700"><strong>Phone:</strong> {selectedContact.Phone}</p>}
            <p className="text-xl text-gray-700"><strong>Address:</strong></p>
            <p className="text-xl text-gray-700">{selectedContact.Address1}</p>
            <p className="text-xl text-gray-700">{selectedContact.Address2}</p>
            <p className="text-xl text-gray-700">{selectedContact.City} {selectedContact.State} {selectedContact.ZipCode}</p>
          </div>
          <div className='flex flex-row gap-2 justify-between'>
            <div className='flex flex-row gap-2'>
              <button className="font-semibold text-lg bg-green-600 text-white rounded-lg shadow-lg px-6 py-2 h-min hover:bg-green-700 transition" onClick={() => setIsEditing(true)} >Edit</button>
              <button className="font-semibold text-lg bg-red-600 text-white rounded-lg shadow-lg px-6 py-2 h-min hover:bg-red-700 transition" onClick={handleDelete}>Delete</button>
            </div>
            <button onClick={() => setSelectedContact(null)} className="font-semibold text-lg bg-gray-600 text-white rounded-lg shadow-lg px-6 py-2 h-min hover:bg-gray-700 transition">Close</button>
          </div>
        </div>
      ) : (
        <div className="w-full m-auto flex flex-col gap-3">
          <div className='flex justify-between gap-3'>
            <input
              type="text"
              placeholder="First Name"
              name="FirstName"
              value={selectedContact.FirstName}
              onChange={handleInputChange}
              className="w-full border-2 shadow-sm rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              name="LastName"
              value={selectedContact.LastName}
              onChange={handleInputChange}
              className="w-full border-2 shadow-sm rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>
          <input
            type="email"
            placeholder="Email"
            name="Email"
            value={selectedContact.Email}
            onChange={handleInputChange}
            className="border-2 shadow-sm rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            type="text"
            placeholder="Phone"
            name="Phone"
            value={selectedContact.Phone}
            onChange={handleInputChange}
            className="border-2 shadow-sm rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            pattern="^\d{10}$"
            inputMode="numeric"
            title="Phone number must be 10 digits."
          />
          <input
            type="text"
            placeholder="Address"
            name="Address1"
            value={selectedContact.Address1}
            onChange={handleInputChange}
            className="border-2 shadow-sm rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
          <input
            type="text"
            placeholder="Apartment, Suite, Etc"
            name="Address2"
            value={selectedContact.Address2}
            onChange={handleInputChange}
            className="border-2 shadow-sm rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <div className='flex w-full gap-3'>
            <input
              type="text"
              placeholder="City"
              name="City"
              value={selectedContact.City}
              onChange={handleInputChange}
              className="w-6/12 border-2 shadow-sm rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <input
              type="text"
              placeholder="State"
              name="State"
              value={selectedContact.State}
              onChange={handleInputChange}
              className="w-3/12 border-2 shadow-sm rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <input
              type="text"
              placeholder="Zip Code"
              name="ZipCode"
              value={selectedContact.ZipCode}
              onChange={handleInputChange}
              className="w-3/12 border-2 shadow-sm rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <div className='flex flex-row gap-2 justify-end'>
            <button onClick={handleSave} className="font-semibold text-lg bg-green-600 text-white rounded-lg shadow-lg px-6 py-2 h-min hover:bg-green-700 transition">Save</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactsProfile;