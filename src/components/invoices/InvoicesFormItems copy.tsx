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

  const [filteredServices, setFilteredServices] = useState<any>({});
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  useEffect(() => {
    fetchServices("p");
  }, []);

  const fetchServices = async (query: string) => {
    const fetchedServices = await window.electron.ipcRenderer.invoke('get-invoice-items');
    setFilteredServices(
      fetchedServices.filter((invoiceItem: any) =>
        invoiceItem['ServiceDescription'].toLowerCase().startsWith(query.toLowerCase())
      )
    );
  };


  const handleServicetSelect = async (service: string) => {
    setIsDropdownVisible(false);
  };

  const handleMoneyInput = (value: string): string => {
    if (value === '') return value;

    let cleanValue = value.match(/\d+/g)?.join('') || '';
    cleanValue = cleanValue.padStart(3, '0');

    const beforeDecimal = cleanValue.slice(0, cleanValue.length - 2);
    const afterDecimal = cleanValue.slice(cleanValue.length - 2);

    return `$${beforeDecimal}.${afterDecimal}`;
  };

  const handleCellChange = (index: number, field: keyof Item, value: any) => {
    if(field == 'ServiceDescription') {
      setIsDropdownVisible(true);
      fetchServices(value);
    }
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setItems(updatedItems);

    // Clean up empty rows and add a new empty row if necessary
    if (updatedItems[index].ServiceDescription === '' && updatedItems[index].ServiceDate === '' && updatedItems[index].Quantity === '' && updatedItems[index].Rate === '') {
      setItems(updatedItems.filter((_, idx) => idx !== index));
    } else if (updatedItems[updatedItems.length - 1].ServiceDescription !== '' || updatedItems[updatedItems.length - 1].ServiceDate !== '' || updatedItems[updatedItems.length - 1].Quantity !== '' || updatedItems[updatedItems.length - 1].Rate !== ''
    ) {
      setItems(prevItems => [...prevItems, { ServiceDescription: '', ServiceDate: '', Quantity: '', Rate: '' }]);
    }
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

      {items.map((item, index) => (
        <div key={index} className="w-full border-0 rounded px-0 py-0 focus:outline-none bbg-yellow-50 focus:bg-yellow-100">
          <div className="w-full flex flex-row">
            <textarea
              className="border-0 overflow-hidden rounded px-0 py-0 focus:outline-none w-3/12 bg-purple-200 bbg-yellow-50 focus:bg-yellow-100 resize-none"
              value={item.ServiceDate}
              onChange={(e) => handleCellChange(index, 'ServiceDate', e.target.value)}
              rows={1}
              onInput={handleResizeInput}
            />
            <textarea
              className="border-0 overflow-hidden rounded px-0 py-0 focus:outline-none w-8/12 bg-red-200 bbg-yellow-50 focus:bg-yellow-100 resize-none"
              value={item.ServiceDescription}
              onChange={(e) => handleCellChange(index, 'ServiceDescription', e.target.value)}
              rows={1}
              onInput={handleResizeInput}
              />
            {/* {isDropdownVisible && filteredServices.length > 0 && ( */}
            {isDropdownVisible && filteredServices.length > 0 && (
              <div className="absolute bg-white shadow-sm w-full border rounded-md mt-1 z-20">
                {filteredServices.map((invoiceItem, idx) => (
                  <div
                    key={idx}
                    className="px-3 py-2 cursor-pointer hover:bg-gray-200"
                    onClick={() => handleServicetSelect(invoiceItem.ServiceDescription)}
                  >
                    {invoiceItem.ServiceDescription}
                  </div>
                ))}
              </div>
            )}
            <textarea
              className="border-0 overflow-hidden rounded px-0 py-0 focus:outline-none w-1/12 bg-yellow-200 bbg-yellow-50 focus:bg-yellow-100 resize-none"
              value={item.Quantity}
              onChange={(e) => { handleCellChange(index, 'Quantity', e.target.value)}}
              rows={1}
              onInput={handleResizeInput}
              inputMode="numeric"
            />
            <textarea
              className="border-0 overflow-hidden rounded px-0 py-0 focus:outline-none w-1/12 bg-blue-200 bbg-yellow-50 focus:bg-yellow-100 resize-none"
              value={item.Rate}
              onChange={(e) => handleCellChange(index, 'Rate', handleMoneyInput(e.target.value))}
              rows={1}
              onInput={handleResizeInput}
            />
            <div className="justify-end h-auto border-0 overflow-hidden rounded px-0 py-0 focus:outline-none w-1/12 bg-green-200 bbg-yellow-50 focus:bg-yellow-100 resize-none break-words whitespace-pre-wrap">
              ${(item.Quantity && item.Rate) && (item.Quantity * parseFloat(item.Rate.slice(1))).toFixed(2)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InvoicesFormItems;