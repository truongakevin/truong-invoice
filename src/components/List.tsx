import React, { useEffect, useState } from 'react';

const List = <T extends Record<string, any>>({
  fieldNames,
  fieldValues,
  items,
  selectedCell,
  setSelectedCell,
}: {
  fieldNames: string[];
  fieldValues: string[];
  items: T[];
  selectedCell?: T;
  setSelectedCell?: (item: T) => void;
}) => {
  const [sortKey, setSortKey] = useState<string>(fieldValues[0]);
  const [sortOrder, setSortOrder] = useState<string>('asc');

  useEffect(() => {
  }, []);

  const sortData = (data: any[], sortKey: string, order: string) => {
    return [...data].sort((a, b) => { // Create a new sorted array
      let aValue = a;
      let bValue = b;

      // If the sortKey is related to a nested Contact field, extract the value
      if (sortKey.includes("Contact.")) {
        const field = sortKey.split('.')[1];
        aValue = a.Contact ? a.Contact[field] : '';
        bValue = b.Contact ? b.Contact[field] : '';
      } else {
        aValue = a[sortKey];
        bValue = b[sortKey];
      }

      if (aValue < bValue) return order === 'asc' ? -1 : 1;
      if (aValue > bValue) return order === 'asc' ? 1 : -1;
      return 0;
    });
  };
  // Handle sorting when a header is clicked
  const handleSort = (key: string) => {
    const newOrder = sortKey === key && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortKey(key);
    setSortOrder(newOrder);
  };
  // Sort the items based on the selected sort key and order
  const sortedItems = sortData(items, sortKey, sortOrder);

  return (
    <div className="shadow-lg rounded-lg border-2 overflow-y-auto">
      <table className="w-full text-left text-black rounded-lg">
        <thead className="bg-green-800 text-white sticky">
          <tr className='sticky'>
            {fieldNames.map((header, index) => (
              <th
                key={header}
                className="px-2 py-2.5 sticky cursor-pointer"
                onClick={() => handleSort(fieldValues[index])} // Sort by the column index
              >
              {`${header}${sortKey === fieldValues[index] ? (sortOrder === 'asc' ? ' ↓ ' : ' ↑ ') : '\u00A0\u00A0\u00A0\u00A0'}`}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedItems.map((item, index) => (
            <tr
              key={index}
              className={`hover:bg-neutral-200 even:bg-gray-100 odd:bg-gray-50 transition`}
              onClick={() => setSelectedCell && setSelectedCell(item)}
            >
              {fieldValues.map((key, idx) => (
                <td
                  key={idx}
                  className={`px-2 py-1 ${item && selectedCell && item[fieldValues[0]] == selectedCell[fieldValues[0]] && 'bg-neutral-300'} ${fieldValues[idx].includes("Amount") && 'text-right'}`}
                >
                  {fieldValues[idx].includes("Amount") && '$'}
                  {key.includes("Contact.") 
                  ? item.Contact[key.split('.')[1]]
                  : item[key]
                  }
                  {key.includes("Amount") && '.00'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
  );
};

export default List;