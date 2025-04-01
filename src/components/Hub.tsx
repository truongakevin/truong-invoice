import React, { useEffect, useState } from 'react';
import InvoicesPage from './invoices/InvoicesPage';
import ContactsPage from './ContactsPage';
// import Estimates from './Estimates';
// import Payments from './Payments';
import { Contact, Invoice, Service } from '../types';

const Hub: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [invoiceServices, setInvoiceServices] = useState<Service[] | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'Home' | 'Invoices' | 'Contacts' | 'Estimates' | 'Payments' | 'Settings'>('Invoices');

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
        Contact?.FirstName?.toLowerCase().startsWith(query) ||
        Contact?.LastName?.toLowerCase().startsWith(query) ||
        Contact?.Phone?.toLowerCase().startsWith(query) ||
        Contact?.Address1?.toLowerCase().startsWith(query)
      );
  });

  // const saveContact = async () => {
  // };
  // const saveInvoice = async () => {
  // };
  // const saveServices = async () => {
  // };

  const handleSave = async () => {
    // saveServices();
    // saveInvoice();
    // saveContact();
    const saveContact = { ...selectedContact };
    const saveInvoice = { ...selectedInvoice };
    const saveServices = [...invoiceServices];
    // const saveServices: Service[] = invoiceServices.map(service => ({ ...service }));
    if (saveContact?.FirstName && saveContact?.LastName && saveContact?.Address1) {
      if (saveContact.ContactID) {
        await window.electron.ipcRenderer.invoke('update-contact', saveContact);
        console.log("updated contact");
      } else {
        const contact = await window.electron.ipcRenderer.invoke('create-contact', saveContact);
        saveContact.ContactID = contact.ContactID
        // setSelectedContact({ ...saveContact, "ContactID": contact.ContactID })
        console.log("created contact");
      }
      fetchContacts();
    }

    if (saveContact?.ContactID && saveInvoice?.InvoiceDate) {
      // Calculate TotalAmount based on Quality * Rate
      const totalAmount = parseFloat(saveServices.reduce((acc, { Quantity, Rate }) => Quantity && Rate ? acc + Quantity * Rate : acc, 0).toFixed(2));
      saveInvoice.TotalAmount = totalAmount;
      // setSelectedInvoice({ ...saveInvoice, TotalAmount: totalAmount });

      // Calculate DueDate (InvoiceDate + 2 months)
      const invoiceDate = new Date(saveInvoice.InvoiceDate);
      if (isNaN(invoiceDate.getTime())) {
        console.error('Invalid Invoice Date');
        return;
      }
      invoiceDate.setMonth(invoiceDate.getMonth() + 2);
      const dueDate = invoiceDate.toISOString().split('T')[0];
      if (saveInvoice.InvoiceID) {
        await window.electron.ipcRenderer.invoke('update-invoice', {
          InvoiceID: saveInvoice.InvoiceID,
          ContactID: saveContact.ContactID,
          InvoiceDate: saveInvoice.InvoiceDate,
          DueDate: dueDate,
          TotalAmount: saveInvoice.TotalAmount,
          PaidAmount: saveInvoice.PaidAmount,
          DueAmount: saveInvoice.DueAmount,
          Status: saveInvoice.Status,
        });
        console.log("updated invoice");
      } else {
        const invoice = await window.electron.ipcRenderer.invoke('create-invoice', {
          ContactID: saveContact.ContactID,
          InvoiceDate: saveInvoice.InvoiceDate,
          DueDate: dueDate,
          TotalAmount: totalAmount,
          PaidAmount: 0,
          DueAmount: totalAmount,
          Status: "Unpaid",
        });
        saveInvoice.InvoiceID = invoice.InvoiceID;
        // setSelectedInvoice({ ...saveInvoice, "InvoiceID": invoice.InvoiceID });
        console.log("created inovice");
      }
      fetchInvoices();
    }
    
    saveServices?.map(async (service, index) => {
      if (service.ServiceDescription && service.ServiceDate && service.Quantity && service.Rate && selectedInvoice?.InvoiceID) {
        if (service.ServiceID) {
          await window.electron.ipcRenderer.invoke('update-service', {
            ServiceID: service.ServiceID,
            InvoiceID: saveInvoice.InvoiceID,
            ServiceDate: service.ServiceDate,
            ServiceDescription: service.ServiceDescription,
            Quantity: service.Quantity,
            Rate: service.Rate,
          });
          console.log("updated service");
        } else {
          const newService = await window.electron.ipcRenderer.invoke('create-service', {
            InvoiceID: saveInvoice.InvoiceID,
            ServiceDate: service.ServiceDate,
            ServiceDescription: service.ServiceDescription,
            Quantity: service.Quantity,
            Rate: service.Rate,
          });
          saveServices[index] = { ...saveServices[index], "ServiceID": newService.ServiceID };
          console.log("created service");
        }
        fetchServices();
      }
    })
    setSelectedContact(saveContact);
    setSelectedInvoice(saveInvoice);
    setInvoiceServices(saveServices);
  };

  useEffect(() => {
    // handleSave();
  }, [selectedContact?.ContactID, selectedInvoice?.InvoiceID]);

  return (
    <div className="flex flex-col h-screen text-sm">
      {/* Header */}
      <div className="flex flex-row p-8 pb-0 shadow-lg justify-between items-end bg-green-800 text-white">
        <div className="flex flex-row gap-8">
          {['Home', 'Invoices', 'Contacts', 'Estimates', 'Payments', 'Settings'].map((tab) => (
            <div
              key={tab}
              onClick={() => setActiveTab(tab as "Home" | "Invoices" | "Contacts" | "Estimates" | "Payments" | "Settings")}
              className={`pb-2 text-xl font-semibold transition ${activeTab === tab ? 'border-b-4 border-white' : 'hover:scale-110'}`}
            >
              {tab}
            </div>
          ))}
        </div>
        <h1 className="pb-3 text-3xl font-bold">TruongInvoice</h1>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="w-full h-full p-4">
          {activeTab === 'Invoices' && 
            <InvoicesPage
              contacts={contacts}
              fetchContacts={fetchContacts}
              invoices={invoices}
              fetchInvoices={fetchInvoices}
              filteredInvoicesWithContacts={filteredInvoicesWithContacts}
              services={services}
              fetchServices={fetchServices}
              selectedContact={selectedContact}
              setSelectedContact={setSelectedContact}
              selectedInvoice={selectedInvoice}
              setSelectedInvoice={setSelectedInvoice}
              invoiceServices={invoiceServices}
              setInvoiceServices={setInvoiceServices}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleSave={handleSave}
            />
          }
          {activeTab === 'Contacts' && 
          <ContactsPage
            contacts={contacts}
            filteredContacts={filteredContacts}
            fetchContacts={fetchContacts}
            selectedContact={selectedContact}
            setSelectedContact={setSelectedContact}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSave={handleSave}
          />}
        </div>
      </div>
    </div>
  );
};
export default Hub;