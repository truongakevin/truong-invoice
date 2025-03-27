import React, { useState } from 'react';

// Sort function for sorting the table rows based on selected field and order
const sortData = (data: any[], sortKey: string, order: string) => {
  return [...data].sort((a, b) => { // Create a new sorted array
    if (a[sortKey] < b[sortKey]) return order === 'asc' ? -1 : 1;
    if (a[sortKey] > b[sortKey]) return order === 'asc' ? 1 : -1;
    return 0;
  });
};
const List = ({
  fieldNames,
  fieldValues,
  items,
  setSelectedCell,
}: {
  fieldNames: string[];
  fieldValues: string[];
  items: any[];
  setSelectedCell?: (item: any) => void;
}) => {
  const [sortKey, setSortKey] = useState<string>(fieldValues[0]);
  const [sortOrder, setSortOrder] = useState<string>('asc');

  // Handle sorting when a header is clicked
  const handleSort = (key: string) => {
    const newOrder = sortKey === key && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortKey(key);
    setSortOrder(newOrder);
  };

  // Sort the items based on the selected sort key and order
  const sortedItems = sortData(items, sortKey, sortOrder);

  return (
    <div className="w-full shadow-lg sm:rounded-lg h-min max-h-[40rem] overflow-y-auto">
      <table className="w-full text-md text-left text-black rounded-lg">
        <thead className="bg-gray-200 sticky top-0 z-10">
          <tr>
            {fieldNames.map((header, index) => (
              <th
                key={header}
                className="px-2 py-2.5 cursor-pointer"
                onClick={() => handleSort(fieldValues[index])} // Sort by the column index
              >
                {header}
                {sortKey === fieldValues[index] && (
                  <span>{sortOrder === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedItems.map((item, index) => (
            <tr
              key={index}
              className="hover:bg-green-50 even:bg-gray-100 odd:bg-gray-50 transition"
              onClick={() => setSelectedCell && setSelectedCell(item)}
            >
              {Object.values(item).map((value, idx) => (
                <td key={idx} className={`border px-2 py-1.5 ${fieldValues[idx].includes("Amount")&& 'text-right'}`}>{fieldValues[idx].includes("Amount")&& '$'}{String(value)}{fieldValues[idx].includes("Amount")&& '.00'}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default List;