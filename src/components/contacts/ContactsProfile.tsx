import React, { useEffect, useState } from 'react';

const ContactsProfile = ({ 
  contact, 
  fetchContacts,
  setSelectedContact
}: { 
  contact: any, 
  fetchContacts: () => void,
  setSelectedContact: (contact: any) => void
}) => {
	const [contactDetails, setContactDetails] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const capitalizeFirstLetter = (text: string) => {
		return text.charAt(0).toUpperCase() + text.slice(1);
	};
  
  const fetchContactDetails = async () => {
    try {
      const response = await window.electron.ipcRenderer.invoke('get-contact-details', { firstName: contact.FirstName, lastName: contact.LastName });
      setContactDetails(response);
    } catch (error) {
      console.error('Error fetching contact details:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactDetails((prevDetails: any) => ({
      ...prevDetails,
      [name]: name === "FirstName" || name === "LastName" ? capitalizeFirstLetter(value) : value,
    }));
  };

  const handleSave = async () => {
    try {
      await window.electron.ipcRenderer.invoke('update-contact', contactDetails);
      setIsEditing(false);
      fetchContacts();
    } catch (error) {
      console.error('Error saving contact:', error);
    }
  };

  const handleDelete = async () => {
    if (!contactDetails) return;
    const confirmDelete = window.confirm("Are you sure you want to delete this contact?");
    if (!confirmDelete) return;

    try {
      await window.electron.ipcRenderer.invoke('delete-contact', contactDetails.CustomerID);
      setSelectedContact(null); // Clear the selected contact
      fetchContacts(); // Refresh the contact list
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  useEffect(() => {
    if (contact) {
      fetchContactDetails();
    }
  }, [contact]);

  if (!contactDetails) return <div>Loading...</div>;

  return (
    <div className="w-5/12 h-full bg-gray-50 p-4 border-2 rounded-lg shadow-md">
      {!isEditing ? (
        <div className='w-full m-auto flex flex-col gap-3'>
          <div className='flex flex-col gap-0'>
            <h2 className="text-3xl font-semibold mb-4">{contactDetails.FirstName} {contactDetails.LastName}</h2>
            {contactDetails.Email && <p className="text-xl text-gray-700"><strong>Email:</strong> {contactDetails.Email}</p>}
            {contactDetails.Phone && <p className="text-xl text-gray-700"><strong>Phone:</strong> {contactDetails.Phone}</p>}
            <p className="text-xl text-gray-700"><strong>Address:</strong></p>
            <p className="text-xl text-gray-700">{contactDetails.Address1}</p>
            <p className="text-xl text-gray-700">{contactDetails.Address2}</p>
            <p className="text-xl text-gray-700">{contactDetails.City} {contactDetails.State} {contactDetails.ZipCode}</p>
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
              value={contactDetails.FirstName}
              onChange={handleInputChange}
              className="w-full border-2 shadow-sm rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              name="LastName"
              value={contactDetails.LastName}
              onChange={handleInputChange}
              className="w-full border-2 shadow-sm rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>
          <input
            type="email"
            placeholder="Email"
            name="Email"
            value={contactDetails.Email}
            onChange={handleInputChange}
            className="border-2 shadow-sm rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            type="text"
            placeholder="Phone"
            name="Phone"
            value={contactDetails.Phone}
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
            value={contactDetails.Address1}
            onChange={handleInputChange}
            className="border-2 shadow-sm rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
          <input
            type="text"
            placeholder="Apartment, Suite, Etc"
            name="Address2"
            value={contactDetails.Address2}
            onChange={handleInputChange}
            className="border-2 shadow-sm rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <div className='flex w-full gap-3'>
            <input
              type="text"
              placeholder="City"
              name="City"
              value={contactDetails.City}
              onChange={handleInputChange}
              className="w-6/12 border-2 shadow-sm rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <input
              type="text"
              placeholder="State"
              name="State"
              value={contactDetails.State}
              onChange={handleInputChange}
              className="w-3/12 border-2 shadow-sm rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <input
              type="text"
              placeholder="Zip Code"
              name="ZipCode"
              value={contactDetails.ZipCode}
              onChange={handleInputChange}
              className="w-3/12 border-2 shadow-sm rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <div className='flex flex-row gap-2'>
            <button onClick={handleSave} className="font-semibold text-lg bg-green-600 text-white rounded-lg shadow-lg px-6 py-2 h-min hover:bg-green-700 transition">Save</button>
            <button onClick={() => setIsEditing(false)} className="font-semibold text-lg bg-gray-600 text-white rounded-lg shadow-lg px-6 py-2 h-min hover:bg-gray-700 transition">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactsProfile;