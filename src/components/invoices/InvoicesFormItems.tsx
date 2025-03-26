import React, { useState, useEffect } from 'react';

interface Item {
  ServiceDate: string;
  ServiceDescription: string;
  Quantity: number | string;
  Rate: string;
}

interface InvoicesFormItemsProps {
  items: Item[];
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
}

const InvoicesFormItems: React.FC<InvoicesFormItemsProps> = ({ items, setItems }) => {
  const [filteredServices, setFilteredServices] = useState<any[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (activeIndex !== null) fetchServices(items[activeIndex].ServiceDescription);
  }, [activeIndex, items]);

  const fetchServices = async (query: string) => {
    const fetchedServices = await window.electron.ipcRenderer.invoke('get-invoice-items');
    
    const uniqueServices = fetchedServices.filter((invoiceItem: any, index: number, self: any[]) =>
      index === self.findIndex((t: any) => t.ServiceDescription === invoiceItem.ServiceDescription)
    );
    
    setFilteredServices(
      uniqueServices.filter((invoiceItem: any) =>
        invoiceItem['ServiceDescription'].toLowerCase().startsWith(query.toLowerCase())
      )
    );
  };

  const handleMoneyInput = (value: string): string => {
    const match = value.match(/\d+/g);
    if (!match) return '';
    const formatted = parseFloat(match.join('')).toString().padStart(3, '0');
    return `$${formatted.slice(0, -2)}.${formatted.slice(-2)}`;
  };

  const handleCellChange = (index: number, field: keyof Item, value: any) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setItems(updatedItems);

    if (field === 'ServiceDescription') {
      setActiveIndex(index);
      setIsDropdownVisible(true);
      fetchServices(value);
    }

    if (!updatedItems[index].ServiceDescription && !updatedItems[index].ServiceDate && !updatedItems[index].Quantity && !updatedItems[index].Rate) {
      setItems(updatedItems.filter((_, idx) => idx !== index));
    }

    if (index === updatedItems.length - 1 || updatedItems[updatedItems.length - 1].ServiceDescription || updatedItems[updatedItems.length - 1].ServiceDate || updatedItems[updatedItems.length - 1].Quantity || updatedItems[updatedItems.length - 1].Rate) {
      setItems(prevItems => [...prevItems, { ServiceDescription: '', ServiceDate: '', Quantity: '', Rate: '' }]);
    }
  };

  const handleSelectServiceDescription = (index: number, serviceDescription: string) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], ServiceDescription: serviceDescription };
    setItems(updatedItems);
    setIsDropdownVisible(false);
  };

  const handleResizeInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    target.style.height = 'auto';
    target.style.height = `${target.scrollHeight}px`;
  };

  return (
    <div className="w-full">
      <h4 className="text-xl font-semibold pb-2">Invoice Items</h4>
      <div className="w-full flex flex-row">
        <div className="w-3/12 bg-purple-200">Service Date</div>
        <div className="w-8/12 bg-red-200">Service Description</div>
        <div className="w-1/12 bg-yellow-200">Quantity</div>
        <div className="w-1/12 bg-blue-200">Rate</div>
        <div className="w-1/12 bg-green-200">Total</div>
      </div>

      <div className="flex flex-col">
        {items.map((item, index) => (
          <div key={index} className="flex flex-row">
            <div className="celldiv w-full flex flex-row">
              <textarea
                className="textarea bg-yellow-50 focus:bg-yellow-100 cell h-full w-full flex overflow-hidden resize-none focus:outline-none"
                value={item.ServiceDate}
                onChange={(e) => handleCellChange(index, 'ServiceDate', e.target.value)}
                rows={1}
                onInput={handleResizeInput}
              />
            </div>
            <div className="celldiv w-full flex flex-row">
              <textarea
                className="textarea bg-yellow-50 focus:bg-yellow-100 cell h-full w-full flex overflow-hidden resize-none focus:outline-none"
                value={item.ServiceDescription}
                onChange={(e) => handleCellChange(index, 'ServiceDescription', e.target.value)}
                rows={1}
                onInput={handleResizeInput}
              />
              {isDropdownVisible && activeIndex === index-1 && filteredServices.length > 0 && (
                <div className="absolute bg-white shadow-sm w-fit border rounded-md mt-1 z-20">
                  {filteredServices.map((invoiceItem, idx) => (
                    <div key={idx} className="px-3 py-2 cursor-pointer hover:bg-gray-200" onClick={() => handleSelectServiceDescription(index-1, invoiceItem.ServiceDescription)}>
                      {invoiceItem.ServiceDescription}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="celldiv w-full flex flex-row">
              <textarea
                className="textarea bg-yellow-50 focus:bg-yellow-100 cell h-full w-full flex overflow-hidden resize-none focus:outline-none"
                value={item.Quantity}
                onChange={(e) => handleCellChange(index, 'Quantity', e.target.value)}
                rows={1}
                onInput={handleResizeInput}
                inputMode="numeric"
              />
            </div>
            <div className="celldiv w-full flex flex-row">
              <textarea
                className="textarea bg-yellow-50 focus:bg-yellow-100 cell h-full w-full flex overflow-hidden resize-none focus:outline-none"
                value={item.Rate}
                onChange={(e) => handleCellChange(index, 'Rate', handleMoneyInput(e.target.value))}
                onKeyDown={(e) => {if (e.key === 'Enter') e.preventDefault();}}
                rows={1}
                onInput={handleResizeInput}
              />
            </div>
            <div className="celldiv w-full flex flex-row">
              <div className="totalcell bg-yellow-50 focus:bg-yellow-100 cell h-full w-full flex overflow-hidden resize-none focus:outline-none">
                ${(item.Quantity && item.Rate) ? (item.Quantity * parseFloat(item.Rate.slice(1))).toFixed(2) : '0.00'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvoicesFormItems;