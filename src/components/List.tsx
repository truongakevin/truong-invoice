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

  const sortData = (data: T[], key: string, order: string): T[] => {
    return [...data].sort((a, b) => {
      const aValue = getValue(a, key);
      const bValue = getValue(b, key);

      if (aValue < bValue) return order === 'asc' ? -1 : 1;
      if (aValue > bValue) return order === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const getValue = (item: T, key: string): any => {
    if (key.includes('Contact.')) {
      const field = key.split('.')[1];
      return item.Contact ? item.Contact[field] : '';
    }
    return item[key];
  };

  const handleSort = (key: string) => {
    const newOrder = sortKey === key && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortKey(key);
    setSortOrder(newOrder);
  };

  const sortedItems = sortData(items, sortKey, sortOrder);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key != 'ArrowDown' && event.key != 'ArrowUp') return;
      event.preventDefault();

      if (!setSelectedCell) return;

      const currentIndex = items.findIndex(item => item[fieldValues[0]] === selectedCell[fieldValues[0]]);
      if (event.key === 'ArrowDown' && currentIndex < items.length - 1) {
        setSelectedCell(items[currentIndex + 1]);
      } else if (event.key === 'ArrowUp' && currentIndex > 0) {
        setSelectedCell(items[currentIndex - 1]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCell, items, setSelectedCell]);

  useEffect(() => {
    if (selectedCell) {
      const selectedRow = document.querySelector('.selected-row');
      selectedRow?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [selectedCell, items]);

  return (
    <div className="overflow-y-auto overflow-x-auto rounded-lg border-2 border-green-800">
      <table className="w-full">
        <thead>
          <tr>
            {fieldNames.map((header, index) => (
              <th
                key={header}
                className="sticky top-0 px-2 py-2 text-left text-white bg-green-800 cursor-pointer"
                onClick={() => handleSort(fieldValues[index])}
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
            className={`transition ${selectedCell && item[fieldValues[0]] === selectedCell[fieldValues[0]] ? 'selected-row border-0 border-green-800 bg-green-100' : 'even:bg-white odd:bg-neutral-100 hover:bg-green-50'}`}
            onClick={() => setSelectedCell && setSelectedCell(item)}
          >
            {fieldValues.map((key, idx) => (
              <td key={idx} className={`px-2 py-1 ${key.includes('Amount') ? 'text-right' : ''}`}>
                { key.includes('Amount') ? `$${item[key] ? item[key] : 0}.00` :
                  key.includes('Contact.') ? item.Contact[key.split('.')[1]] : 
                  item[key] }
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