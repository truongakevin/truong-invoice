import React, { useState, useEffect } from 'react';
import ContactsList from './ContactsList';
import ContactsForm from './ContactsForm';
import ContactsSearchBar from './ContactsSearchBar';
import ContactsProfile from './ContactsProfile';

const Contacts = () => {
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

	// Filter contacts based on the search query
	const filteredContacts = contacts.filter(contact => {
		return (
			contact.FirstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
			contact.LastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
			contact.Email.toLowerCase().includes(searchQuery.toLowerCase()) ||
			contact.Phone.toLowerCase().includes(searchQuery.toLowerCase())
		);
	});

	return (
		<div className="mx-5 p-4">
			<div className="flex flex-row gap-12 items-end pb-4">
				<div>
					<h1 className="text-4xl font-semibold py-2">Contacts</h1>
					<h2 className="text-gray-500 text-xl font-semibold">Manage and create contacts for clients</h2>
				</div>
				{!showForm && <button
					onClick={() => setShowForm(!showForm)}
					className="font-semibold text-lg bg-green-600 text-white rounded-lg shadow-lg px-6 py-2 h-min hover:bg-green-700 transition"
				>
					{showForm ? 'Cancel' : 'New'}
				</button>
				}
			</div>
				
			<div className="w-full flex flex-col gap-8">
				<div className='flex flex-row gap-4'>
					{showForm && <ContactsForm handleSubmit={handleSubmit} newContact={newContact} setNewContact={setNewContact} setShowForm={setShowForm} />}
				</div>
				<ContactsSearchBar query={searchQuery} setQuery={setSearchQuery} />
				<div className="w-full flex flex-row gap-4">
					<ContactsList contacts={filteredContacts} setSelectedContact={setSelectedContact} />
					{selectedContact &&<ContactsProfile contact={selectedContact} fetchContacts={fetchContacts} setSelectedContact={setSelectedContact} />}
				</div>
			</div>
		</div>
	);
};

export default Contacts;