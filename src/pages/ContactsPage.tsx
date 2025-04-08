import { useAppContext, NewButton, DeleteButton } from '../AppContext';
import List from '../components/List';
import ContactForm from '../components/ContactForm';
import SearchBar from '../components/SearchBar';
import ResizablePanel from '../components/ResizablePanel';

const ContactsPage: React.FC = () => {
  const {
    filteredContacts,
    selectedContact,
    setSelectedContact,
  } = useAppContext();


  return (
    <ResizablePanel>
      <div className="h-full flex flex-col gap-2">
        <div className='flex flex-row gap-2'>
          <NewButton />
          <DeleteButton />
        </div>
        <SearchBar />
        <List
          fieldNames={['ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Address', 'City']} 
          fieldValues={['ContactID', 'FirstName', 'LastName', 'Email', 'Phone', 'Address1', 'City']}
          items={filteredContacts} 
          selectedCell={selectedContact} 
          setSelectedCell={setSelectedContact} 
        />
      </div>
      <ContactForm />
    </ResizablePanel>
  );
};

export default ContactsPage;