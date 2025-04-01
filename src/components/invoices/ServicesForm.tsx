import React, { useState, useEffect } from 'react';
import { Contact, Invoice, Service } from '../../types';

const InvoiceServicesForm = ({
  contacts,
  fetchContacts,
  invoices,
  fetchInvoices,
  services,
  fetchServices,
  selectedContact,
  setSelectedContact,
  selectedInvoice,
  setSelectedInvoice,
  invoiceServices,
  setInvoiceServices,
  handleSave,
} : { 
  contacts: Contact[];
  fetchContacts: () => void;
  invoices: Invoice[];
  fetchInvoices: () => void;
  services: Service[];
  fetchServices: () => void;
  selectedContact: Contact | null;
  setSelectedContact?: (selectedContact: Contact | null) => void;
  selectedInvoice: Invoice | null; 
  setSelectedInvoice: (selectedInvoice: Invoice | null) => void;
  invoiceServices: Service[] | null;
  setInvoiceServices: (invoiceServices: Service[] | null) => void;
  handleSave: () => void;
}) => {

  const [filteredDropdownInvoiceServices, setFilteredDropdownInvoiceServices] = useState<any[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {    
    setInvoiceServices([
      ...services.filter(service => service.InvoiceID === selectedInvoice?.InvoiceID),
      ...(selectedInvoice?.InvoiceID 
        ? [{ ServiceID: null, InvoiceID: selectedInvoice?.InvoiceID ?? null,ServiceDescription: '', ServiceDate: '', Quantity: 0, Rate: 0 }] 
        : []),
    ]);
  }, [selectedInvoice?.InvoiceID]);
  
  const fetchFilteredDropdownInvoiceServices = async (query: string) => {
    const uniqueInvoiceServices = services.filter((service: any, index: number, self: any[]) =>
      index === self.findIndex((t: any) => t.ServiceDescription === service.ServiceDescription)
    );
    setFilteredDropdownInvoiceServices(
      uniqueInvoiceServices.filter((service: any) =>
        service['ServiceDescription'].toLowerCase().startsWith(query.toLowerCase())
      )
    );
  };

  const handleMoneyInput = (value: string): string => {
    const match = value.match(/\d+/g);
    if (!match) return '';
    const formatted = parseFloat(match.join('')).toString().padStart(3, '0');
    return `${formatted.slice(0, -2)}.${formatted.slice(-2)}`;
  };

  const handleInputChange = async (index: number, field: keyof Service, e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (field === 'ServiceDescription') {
      setActiveIndex(index);
      setIsDropdownVisible(true);
      fetchFilteredDropdownInvoiceServices(e.target.value);
    }
    if (field === 'Quantity' || field === 'Rate') {
      const digits = e.target.value.match(/\d+/g);
      e.target.value = digits ? String(parseInt(digits.join(''))) : '0';
    }

    const updatedServices = [...invoiceServices];
    updatedServices[index] = { ...updatedServices[index], [field]: e.target.value };
    setInvoiceServices(updatedServices);

    // Remove empty rows if not last
    if (!updatedServices[index].ServiceDescription && !updatedServices[index].ServiceDate && updatedServices[index]?.Quantity == 0 && updatedServices[index]?.Rate == 0) {
      setInvoiceServices(updatedServices.filter((_, idx) => idx !== index));
      if (updatedServices[index].ServiceID){
        await window.electron.ipcRenderer.invoke('delete-service', updatedServices[index].ServiceID);
        fetchServices();
      }
    }

    // If last row not empty create new row
    if (index === updatedServices.length - 1 || updatedServices[updatedServices.length - 1].ServiceDescription || updatedServices[updatedServices.length - 1].ServiceDate || updatedServices[updatedServices.length - 1].Quantity != 0 || updatedServices[updatedServices.length - 1].Rate != 0) {
      setInvoiceServices([...(updatedServices),{ ServiceID: null, InvoiceID: selectedInvoice.InvoiceID, ServiceDescription: '', ServiceDate: '', Quantity: 0, Rate: 0 }]);
    }
  };
  
  const handleSelectServiceDescription = (index: number, serviceDescription: string) => {
    const updatedServices = [...invoiceServices];
    updatedServices[index] = { ...updatedServices[index], ServiceDescription: serviceDescription };
    setInvoiceServices(updatedServices);
    setIsDropdownVisible(false);
  };

  const handleResizeInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    target.style.height = 'auto';
    target.style.height = `${target.scrollHeight}px`;
  };

  return (
    <div className="w-full overflow-y-auto">
      <div className='flex flex-row'>
        <h2 className="font-bold text-lg">Services</h2>
      </div>

      <div className="w-full flex flex-row">
        <div className="w-full bg-purple-200">Service Date</div>
        <div className="w-full bg-red-200">Service Description</div>
        <div className="w-full bg-yellow-200">Quantity</div>
        <div className="w-full bg-blue-200">Rate</div>
        <div className="w-full bg-green-200">Total</div>
      </div>

      <div className="flex flex-col gap-2">
        {invoiceServices?.map((service, index) => (
          <div key={index} className="flex flex-row border-2 border-black">
            <div className="celldiv w-full flex flex-row">
              <textarea
                className="textarea bg-yellow-50 focus:bg-yellow-100 cell h-full w-full flex overflow-hidden resize-none focus:outline-none"
                value={service?.ServiceDate}
                onChange={(e) => handleInputChange(index, 'ServiceDate', e)}
                onBlur={() => handleSave()}
                rows={1}
                onInput={handleResizeInput}
              />
            </div>
            <div className="celldiv w-full flex flex-row">
              <textarea
                className="textarea bg-yellow-50 focus:bg-yellow-100 cell h-full w-full flex overflow-hidden resize-none focus:outline-none"
                value={service?.ServiceDescription}
                onChange={(e) => handleInputChange(index, 'ServiceDescription', e)}
                rows={1}
                onBlur={() => {handleSave(); setIsDropdownVisible(false)}}
                onInput={handleResizeInput}
              />
              {isDropdownVisible && activeIndex === index-1 && filteredDropdownInvoiceServices.length > 0 && (
                <div className="absolute bg-white shadow-sm w-fit border rounded-md mt-1 z-20"
                  onMouseDown={(e) => e.preventDefault()}>
                  {filteredDropdownInvoiceServices.map((service, idx) => (
                    <div key={idx} className="px-3 py-2 cursor-pointer hover:bg-gray-200" onClick={() => handleSelectServiceDescription(index-1, service.ServiceDescription)}>
                      {service?.ServiceDescription}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="celldiv w-full flex flex-row">
              <textarea
                className="textarea bg-yellow-50 focus:bg-yellow-100 cell h-full w-full flex overflow-hidden resize-none focus:outline-none"
                value={service?.Quantity}
                onChange={(e) => handleInputChange(index, 'Quantity', e)}
                onKeyDown={(e) => {if (e.key === 'Enter') e.preventDefault();}}
                onBlur={() => handleSave()}
                rows={1}
                onInput={handleResizeInput}
              />
            </div>
            <div className="celldiv w-full flex flex-row">
              $<textarea
                className="textarea bg-yellow-50 focus:bg-yellow-100 cell h-full w-full flex overflow-hidden resize-none focus:outline-none"
                value={service?.Rate}
                onChange={(e) => handleInputChange(index, 'Rate', e)}
                onKeyDown={(e) => {if (e.key === 'Enter') e.preventDefault();}}
                onBlur={() => handleSave()}
                rows={1}
                onInput={handleResizeInput}
              />
            </div>
            <div className="celldiv w-full flex flex-row">
              <div className="totalcell bg-yellow-50 focus:bg-yellow-100 cell h-full w-full flex overflow-hidden resize-none focus:outline-none">
                ${(service?.Quantity * service?.Rate).toFixed(2)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvoiceServicesForm;