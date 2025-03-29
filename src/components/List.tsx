import React, { useEffect, useState } from 'react';

// Sort function for sorting the table rows based on selected field and order
const sortData = (data: any[], sortKey: string, order: string) => {
  return [...data].sort((a, b) => { // Create a new sorted array
    let aValue = a;
    let bValue = b;

    // If the sortKey is related to a nested Contact field, extract the value
    if (sortKey.includes("Contact.")) {
      const field = sortKey.split('.')[1]; // Extract 'FirstName' or 'LastName'
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
const List = ({
  fieldNames,
  fieldValues,
  items,
  selectedCell,
  setSelectedCell,
}: {
  fieldNames: string[];
  fieldValues: string[];
  items: any[];
  selectedCell?: any[];
  setSelectedCell?: (item: any) => void;
}) => {
  const [sortKey, setSortKey] = useState<string>(fieldValues[0]);
  const [sortOrder, setSortOrder] = useState<string>('asc');

  useEffect(() => {
  }, []);

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
      <table className="w-full text-md text-left text-black rounded-lg">
        <thead className="bg-green-700 text-white sticky">
          <tr>
            {fieldNames.map((header, index) => (
              <th
                key={header}
                className="px-2 py-2.5 sticky cursor-pointer"
                onClick={() => handleSort(fieldValues[index])} // Sort by the column index
              >
                {`${header}${sortKey === fieldValues[index] ? sortOrder === 'asc' ? ' ↓ ' : ' ↑ ' : ' '}`}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedItems.map((item, index) => (
            <tr
              key={index}
              className={`border-2 hover:bg-neutral-200 even:bg-gray-100 odd:bg-gray-50 transition`}
              onClick={() => setSelectedCell && setSelectedCell(item)}
            >
              {fieldValues.map((key, idx) => (
                <td
                  key={idx}
                  className={`px-2 py-1 ${item == selectedCell && 'bg-neutral-300'} ${fieldValues[idx].includes("Amount") && 'text-right'}`}
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