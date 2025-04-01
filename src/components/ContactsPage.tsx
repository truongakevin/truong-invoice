import List from './List';
import ContactForm from './ContactForm';
import SearchBar from './SearchBar';
import { Contact } from '../types';

interface ContactPageProps {
  contacts: Contact[];
  filteredContacts: Contact[];
  fetchContacts: () => void;
  selectedContact: Contact | null;
  setSelectedContact?: (selectedContact: Contact | null) => void;
  searchQuery: string; 
  setSearchQuery: (searchQuery: string) => void;
  handleSave: () => void;
}

const ContactsPage: React.FC<ContactPageProps> = ({
  contacts,
  fetchContacts,
  filteredContacts,
  selectedContact,
  setSelectedContact,
  searchQuery,
  setSearchQuery,
  handleSave,
}) => {

  const handleNew = async () => {
    setSelectedContact({ContactID: null, FirstName: '', LastName: '', Email: '', Phone: '', Address1: '', Address2: '', City: '', State: '', ZipCode: '',});
  };

  const handleDelete = async () => {
    if (!selectedContact.ContactID) return;
    if (!window.confirm("Are you sure you want to delete this contact?")) return;
    try {
      await window.electron.ipcRenderer.invoke('delete-contact', selectedContact.ContactID);
      fetchContacts();
      setSelectedContact(null);
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };


  return (
    <div className="w-full h-full flex flex-row gap-4">
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
        <ContactForm 
          contacts={contacts}
          selectedContact={selectedContact}
          setSelectedContact={setSelectedContact}
          handleSave={handleSave}
        />
      </div>
    </div>
  );
};

export default ContactsPage;