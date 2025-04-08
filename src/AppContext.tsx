import React, { createContext, useContext, useState, useEffect } from 'react';
import { Contact, Invoice, Estimate, Payment, Service } from './types';

interface AppContextType {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  contacts: Contact[];
  invoices: Invoice[];
  estimates: Estimate[];
  services: Service[];
  payments: Payment[];
  selectedContact: Contact | null;
  selectedInvoice: Invoice | null;
  selectedEstimate: Estimate | null;
  formServices: Service[] | null;
  searchQuery: string;
  filteredContacts: Contact[];
  filteredInvoicesWithContacts: Invoice[];
  filteredEstimatesWithContacts: Estimate[];
  fetchContacts: () => void;
  fetchInvoices: () => void;
  fetchEstimates: () => void;
  fetchServices: () => void;
  fetchPayments: () => void;
  setSelectedContact: React.Dispatch<React.SetStateAction<Contact | null>>;
  setSelectedInvoice: React.Dispatch<React.SetStateAction<Invoice | null>>;
  setSelectedEstimate: React.Dispatch<React.SetStateAction<Estimate | null>>;
  setFormServices: React.Dispatch<React.SetStateAction<Service[] | null>>;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  handleSave: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<'Home' | 'Invoices' | 'Contacts' | 'Estimates' | 'Payments' | 'Settings'>('Estimates');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedEstimate, setSelectedEstimate] = useState<Estimate | null>(null);
  const [formServices, setFormServices] = useState<Service[] | null>(null);
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
  
  const fetchEstimates = async (): Promise<void> => {
    const data: Estimate[] = await window.electron.ipcRenderer.invoke('get-estimates');
    setEstimates(data);
  };

  const fetchPayments = async (): Promise<void> => {
    const data: Payment[] = await window.electron.ipcRenderer.invoke('get-payments');
    setPayments(data);
  };

  // Fetch data on initial load
  useEffect(() => {
    fetchContacts();
    fetchInvoices();
    fetchServices();
    fetchEstimates();
    fetchPayments();
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
  
  const filteredEstimatesWithContacts = estimates
    .map(estimate => ({
      ...estimate,
      Contact: contacts.find(contact => contact.ContactID === estimate.ContactID) as Contact || selectedContact
    }))
    .filter(estimate => {
      const { Contact } = estimate;
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
    const saveEstimate = selectedEstimate ? { ...selectedEstimate } : null;
    const saveServices = formServices ? [...formServices] : null;

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

    if (saveContact?.ContactID && saveEstimate?.EstimateDate) {
      const totalAmount = saveServices?.reduce((acc, { Quantity, Rate }) => acc + (Quantity * Rate || 0), 0).toFixed(2);
      saveEstimate.TotalAmount = parseFloat(totalAmount);

      if (saveEstimate.EstimateID) {
        await window.electron.ipcRenderer.invoke('update-estimate', saveEstimate);
        console.log("updated estimate");
      } else {
        saveEstimate.ContactID = saveContact.ContactID

        const estimate = await window.electron.ipcRenderer.invoke('create-estimate', saveEstimate);
        saveEstimate.EstimateID = estimate.EstimateID;
        console.log("created estimate");
      }
      fetchEstimates();
    }
    
    saveServices?.map(async (service, index) => {
      if (service.ServiceDescription && service.ServiceDate && service.Quantity && service.Rate && (
        activeTab == "Invoices" && selectedInvoice?.InvoiceID || 
        activeTab == "Estimates" && selectedEstimate?.EstimateID
        )) {
        const serviceData = {
          ServiceID: service?.ServiceID,
          InvoiceID: activeTab == "Invoices" ? saveInvoice.InvoiceID : null,
          EstimateID: activeTab == "Estimates" ? saveEstimate.EstimateID : null,
          ServiceDate: service.ServiceDate,
          ServiceDescription: service.ServiceDescription,
          Quantity: service.Quantity,
          Rate: service.Rate,
        };
        console.log(serviceData)
        if (service.ServiceID) {
          await window.electron.ipcRenderer.invoke('update-service', {...serviceData});
          console.log("updated service");
        } else {
          const newService = await window.electron.ipcRenderer.invoke('create-service', serviceData);
          saveServices[index] = { ...service, ServiceID: newService.ServiceID };
          console.log("created service");
        }
        await fetchServices();
      }
    })
    setSelectedContact(saveContact);
    setSelectedInvoice(saveInvoice);
    setSelectedEstimate(saveEstimate);
    setFormServices(saveServices);
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        contacts,
        invoices,
        estimates,
        services,
        payments,
        selectedContact,
        selectedInvoice,
        selectedEstimate,
        formServices,
        searchQuery,
        filteredContacts,
        filteredInvoicesWithContacts,
        filteredEstimatesWithContacts,
        fetchContacts,
        fetchInvoices,
        fetchEstimates,
        fetchServices,
        fetchPayments,
        setSelectedContact,
        setSelectedInvoice,
        setSelectedEstimate,
        setFormServices,
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
    setSelectedEstimate,
    fetchContacts,
    fetchInvoices,
    fetchEstimates
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
        fetchContacts();
        fetchInvoices();
        break;
      case 'Estimates':
        setSelectedContact(null);
        setSelectedEstimate(null);
        fetchContacts();
        fetchEstimates();
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
    selectedEstimate,
    fetchContacts,
    fetchInvoices,
    fetchEstimates,
    fetchServices,
    setSelectedContact,
    setSelectedInvoice,
    setSelectedEstimate,
  } = useAppContext();

  const handleDelete = async () => {
    try {
      switch (activeTab) {
        case 'Contacts':
          if (selectedContact?.ContactID) {
            if (!window.confirm("Are you sure you want to delete this contact?")) return;
            await window.electron.ipcRenderer.invoke('delete-contact', selectedContact.ContactID);
            setSelectedContact(null);
            fetchContacts();
            fetchInvoices();
            fetchEstimates();
            fetchServices();
          }
          break;
        case 'Invoices':
          if (selectedInvoice?.InvoiceID) {
            if (!window.confirm("Are you sure you want to delete this invoice?")) return;
            await window.electron.ipcRenderer.invoke('delete-invoice', selectedInvoice.InvoiceID);
            setSelectedContact(null);
            setSelectedInvoice(null);
            fetchContacts();
            fetchInvoices();
            fetchEstimates();
            fetchServices();
          }
          break;
        case 'Estimates':
          if (selectedEstimate?.EstimateID) {
            if (!window.confirm("Are you sure you want to delete this estimate?")) return;
            await window.electron.ipcRenderer.invoke('delete-estimate', selectedEstimate.EstimateID);
            setSelectedContact(null);
            setSelectedEstimate(null);
            fetchContacts();
            fetchInvoices();
            fetchEstimates();
            fetchServices();
          }
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
          (activeTab == "Invoices" && selectedInvoice?.InvoiceID) ||
          (activeTab == "Estimates" && selectedEstimate?.EstimateID)
          ? "bg-red-600 hover:bg-red-700" : "bg-red-900 cursor-not-allowed"
        }`}
    >
      Delete
    </button>
  );
};