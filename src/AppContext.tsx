import React, { createContext, useContext, useState, useEffect } from 'react';
import { Contact, Invoice, Service } from './types';

interface AppContextType {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  contacts: Contact[];
  invoices: Invoice[];
  services: Service[];
  selectedContact: Contact | null;
  selectedInvoice: Invoice | null;
  invoiceServices: Service[] | null;
  searchQuery: string;
  filteredContacts: Contact[];
  filteredInvoicesWithContacts: Invoice[];
  fetchContacts: () => void;
  fetchInvoices: () => void;
  fetchServices: () => void;
  setContacts: React.Dispatch<React.SetStateAction<Contact[]>>;
  setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;
  setServices: React.Dispatch<React.SetStateAction<Service[]>>;
  setSelectedContact: React.Dispatch<React.SetStateAction<Contact | null>>;
  setSelectedInvoice: React.Dispatch<React.SetStateAction<Invoice | null>>;
  setInvoiceServices: React.Dispatch<React.SetStateAction<Service[] | null>>;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  handleSave: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<'Home' | 'Invoices' | 'Contacts' | 'Estimates' | 'Payments' | 'Settings'>('Invoices');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [invoiceServices, setInvoiceServices] = useState<Service[] | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchContacts = async (): Promise<void> => {
    const data: Contact[] = await window.electron.ipcRenderer.invoke('get-contacts');
    setContacts(data);
  };

  const fetchInvoices = async (): Promise<void> => {
    const data: Invoice[] = await window.electron.ipcRenderer.invoke('get-invoices');
    setInvoices(data);
  };

  const fetchServices = async (): Promise<void> => {
    const data: Service[] = await window.electron.ipcRenderer.invoke('get-services');
    setServices(data);
  };

  // Fetch data on initial load
  useEffect(() => {
    fetchContacts();
    fetchInvoices();
    fetchServices();
  }, []);

  const filteredContacts = contacts.filter(contact => {
    return (
      String(contact.FirstName).toLowerCase().startsWith(searchQuery.toLowerCase()) ||
      String(contact.LastName).toLowerCase().startsWith(searchQuery.toLowerCase()) ||
      String(contact.Phone).toLowerCase().startsWith(searchQuery.toLowerCase()) ||
      String(contact.Address1).toLowerCase().startsWith(searchQuery.toLowerCase())
    );
  });

  const filteredInvoicesWithContacts = invoices
    .map(invoice => ({
      ...invoice,
      Contact: contacts.find(contact => contact.ContactID === invoice.ContactID) as Contact || selectedContact
    }))
    .filter(invoice => {
      const { Contact } = invoice;
      const query = searchQuery.toLowerCase();
      return (
        String(Contact?.FirstName)?.toLowerCase().startsWith(query) ||
        String(Contact?.LastName)?.toLowerCase().startsWith(query) ||
        String(Contact?.Phone)?.toLowerCase().startsWith(query) ||
        String(Contact?.Address1)?.toLowerCase().startsWith(query)
      );
  });

  const handleSave = async () => {
    const saveContact = selectedContact ? { ...selectedContact } : null;
    const saveInvoice = selectedInvoice ? { ...selectedInvoice } : null;
    const saveServices = invoiceServices ? [...invoiceServices] : null;

    if (saveContact?.FirstName && saveContact?.LastName && saveContact?.Address1) {
      if (saveContact.ContactID) {
        await window.electron.ipcRenderer.invoke('update-contact', saveContact);
        console.log("updated contact");
      } else {
        const contact = await window.electron.ipcRenderer.invoke('create-contact', saveContact);
        saveContact.ContactID = contact.ContactID
        console.log("created contact");
      }
      fetchContacts();
    }

    if (saveContact?.ContactID && saveInvoice?.InvoiceDate) {
      const totalAmount = saveServices?.reduce((acc, { Quantity, Rate }) => acc + (Quantity * Rate || 0), 0).toFixed(2);
      saveInvoice.TotalAmount = parseFloat(totalAmount);

      const dueDate = new Date(saveInvoice.InvoiceDate);
      dueDate.setMonth(dueDate.getMonth() + 2);
      saveInvoice.DueDate = dueDate.toISOString().split('T')[0];

      if (saveInvoice.InvoiceID) {
        await window.electron.ipcRenderer.invoke('update-invoice', saveInvoice);
        console.log("updated invoice");
      } else {
        saveInvoice.ContactID = saveContact.ContactID

        saveInvoice.Status = "Unpaid";

        const invoice = await window.electron.ipcRenderer.invoke('create-invoice', saveInvoice);
        saveInvoice.InvoiceID = invoice.InvoiceID;
        console.log("created inovice");
      }
      fetchInvoices();
    }
    
    saveServices?.map(async (service, index) => {
      if (service.ServiceDescription && service.ServiceDate && service.Quantity && service.Rate && selectedInvoice?.InvoiceID) {
        const serviceData = {
          ServiceID: service?.ServiceID,
          InvoiceID: saveInvoice.InvoiceID,
          ServiceDate: service.ServiceDate,
          ServiceDescription: service.ServiceDescription,
          Quantity: service.Quantity,
          Rate: service.Rate,
        };

        if (service.ServiceID) {
          await window.electron.ipcRenderer.invoke('update-service', {...serviceData});
          console.log("updated service",serviceData);
        } else {
          const newService = await window.electron.ipcRenderer.invoke('create-service', serviceData);
          saveServices[index] = { ...service, ServiceID: newService.ServiceID };
          console.log("created service",serviceData);
        }
        await fetchServices();
      }
    })
    setSelectedContact(saveContact);
    setSelectedInvoice(saveInvoice);
    setInvoiceServices(saveServices);
  };

  return (
    <AppContext.Provider
      value={{
        activeTab, 
        setActiveTab,
        contacts,
        invoices,
        services,
        selectedContact,
        selectedInvoice,
        invoiceServices,
        searchQuery,
        filteredContacts,
        filteredInvoicesWithContacts,
        fetchContacts,
        fetchInvoices,
        fetchServices,
        setContacts,
        setInvoices,
        setServices,
        setSelectedContact,
        setSelectedInvoice,
        setInvoiceServices,
        setSearchQuery,
        handleSave,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const NewButton: React.FC = () => {
  const {
    activeTab,
    setSelectedContact,
    setSelectedInvoice,
    setInvoiceServices,
    fetchContacts,
    fetchInvoices,
    fetchServices
  } = useAppContext();

  const handleNew = () => {
    switch (activeTab) {
      case 'Contacts':
        setSelectedContact(null);
        fetchContacts();
        break;
      case 'Invoices':
        setSelectedContact(null);
        setSelectedInvoice(null);   
        setInvoiceServices(null);
        fetchContacts();
        fetchInvoices();
        fetchServices();
        break;
      case 'Payments':
        // Add logic for new payment if needed
        break;
      case 'Estimates':
        // Add logic for new estimate if needed
        break;
      default:
        break;
    }
  };

  return (
    <button
      onClick={handleNew}
      className="px-6 p-2 font-bold text-white bg-green-600 hover:bg-green-700"
    >
      New
    </button>
  );
};

export const DeleteButton: React.FC = () => {
  const {
    activeTab,
    selectedContact,
    selectedInvoice,
    fetchContacts,
    fetchInvoices,
    setSelectedContact,
    setSelectedInvoice,
  } = useAppContext();

  const handleDelete = async () => {
    try {
      switch (activeTab) {
        case 'Contacts':
          if (selectedContact?.ContactID) {
            if (!window.confirm("Are you sure you want to delete this item?")) return;
            await window.electron.ipcRenderer.invoke('delete-contact', selectedContact.ContactID);
            setSelectedContact(null);
            fetchContacts();
          }
          break;
        case 'Invoices':
          if (selectedInvoice?.InvoiceID) {
            if (!window.confirm("Are you sure you want to delete this item?")) return;
            await window.electron.ipcRenderer.invoke('delete-invoice', selectedInvoice.InvoiceID);
            setSelectedInvoice(null);
            fetchInvoices();
          }
          break;
        case 'Payments':
          // Add logic to delete payment if needed
          break;
        case 'Estimates':
          // Add logic to delete estimate if needed
          break;
        default:
          break;
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className={`px-6 p-2 font-bold text-white
        ${(activeTab == "Contacts" && selectedContact?.ContactID) ||
          (activeTab == "Invoices" && selectedInvoice?.InvoiceID)
          ? "bg-red-600 hover:bg-red-700" : "bg-red-900 cursor-not-allowed"
        }`}
    >
      Delete
    </button>
  );
};