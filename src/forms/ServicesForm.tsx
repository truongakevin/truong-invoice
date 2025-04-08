import React, { useState, useEffect } from 'react';
import { useAppContext } from '../AppContext';
import { Service } from '../types';

const ServicesForm : React.FC = () => {
  const {
    services,
    fetchServices,
    selectedInvoice,
    invoiceServices,
    setInvoiceServices,
    handleSave,
  } = useAppContext();

  const [filteredDropdownInvoiceServices, setFilteredDropdownInvoiceServices] = useState<any[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (selectedInvoice?.InvoiceID) {
      setInvoiceServices([
        ...services.filter(service => service.InvoiceID === selectedInvoice?.InvoiceID),
        { ServiceID: null, InvoiceID: selectedInvoice.InvoiceID, ServiceDescription: '', ServiceDate: '', Quantity: 0, Rate: 0 }
      ]);
    } else {
      setInvoiceServices(null)
    }
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
      {invoiceServices && <div className='flex flex-row'>
        <h3 className="font-bold text-lg">Services</h3>
      </div>}

      {invoiceServices && <div className="w-full flex flex-row gap-2">
        <div className="w-3/12 bbg-purple-200">Service Date</div>
        <div className="w-6/12 bbg-red-200">Service Description</div>
        <div className="w-1/12 bbg-yellow-200">Quantity</div>
        <div className="w-1/12 bbg-blue-200">Rate</div>
        <div className="w-1/12 bbg-green-200">Total</div>
      </div>}

      <div className="flex flex-col gap-2">
        {invoiceServices?.map((service, index) => (
          <div key={index} className="flex flex-row gap-2">
            <div className="bg-green-800 flex flex-row w-3/12">
              <textarea
                className="textareadiv w-full"
                value={service?.ServiceDate}
                onChange={(e) => handleInputChange(index, 'ServiceDate', e)}
                onBlur={() => handleSave()}
                rows={1}
                onInput={handleResizeInput}
              />
            </div>
            <div className="flex flex-row w-6/12">
              <textarea
                className="textareadiv w-full"
                value={service?.ServiceDescription}
                onChange={(e) => handleInputChange(index, 'ServiceDescription', e)}
                rows={1}
                onBlur={() => {handleSave(); setIsDropdownVisible(false)}}
                onInput={handleResizeInput}
              />
              {isDropdownVisible && activeIndex === index-1 && filteredDropdownInvoiceServices.length > 0 && (
                <div className="absolute bg-white w-fit -mt-1"
                  onMouseDown={(e) => e.preventDefault()}>
                  {filteredDropdownInvoiceServices.map((service, idx) => (
                    <div key={idx} className="px-3 py-2 cursor-pointer hover:bg-gray-200" onClick={() => handleSelectServiceDescription(index-1, service.ServiceDescription)}>
                      {service?.ServiceDescription}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-row w-1/12">
              <textarea
                className="textareadiv w-full"
                value={service?.Quantity}
                onChange={(e) => handleInputChange(index, 'Quantity', e)}
                onKeyDown={(e) => {if (e.key === 'Enter') e.preventDefault();}}
                onBlur={() => handleSave()}
                rows={1}
                onInput={handleResizeInput}
              />
            </div>
            <div className="flex flex-row w-1/12">
              <textarea
                className="textareadiv w-full"
                value={service?.Rate}
                onChange={(e) => handleInputChange(index, 'Rate', e)}
                onKeyDown={(e) => {if (e.key === 'Enter') e.preventDefault();}}
                onBlur={() => handleSave()}
                rows={1}
                onInput={handleResizeInput}
              />
            </div>
            <div className="flex flex-row w-1/12">
              <div className="textareadiv w-full">
                ${(service?.Quantity * service?.Rate).toFixed(2)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesForm;