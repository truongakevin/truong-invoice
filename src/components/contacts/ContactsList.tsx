import React, { useState } from 'react';

// Sort function
const sortData = (data: any[], sortKey: string, order: string) => {
  return data.sort((a, b) => {
    if (a[sortKey] < b[sortKey]) return order === 'asc' ? -1 : 1;
    if (a[sortKey] > b[sortKey]) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

const ContactsList = ({
  contacts,
  setSelectedContact
}: {
  contacts: any[];
  setSelectedContact: (contact: any) => void;
}) => {
  const [sortKey, setSortKey] = useState<string>('CustomerID');
  const [sortOrder, setSortOrder] = useState<string>('asc');

  // Handle sorting when a header is clicked
  const handleSort = (key: string) => {
    const newOrder = sortKey === key && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortKey(key);
    setSortOrder(newOrder);
  };

  // Sort contacts based on selected sort key and order
  const sortedContacts = sortData(contacts, sortKey, sortOrder);

  return (
    <div className="w-full shadow-lg sm:rounded-lg h-min max-h-[50rem] overflow-y-auto">
      <table className="w-full text-md text-left text-black rounded-lg">
        <thead className="bg-gray-200 sticky top-0 z-10">
          <tr>
            {['ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Address', 'City'].map((header) => (
              <th
                key={header}
                className="px-2 py-2.5 cursor-pointer"
                onClick={() => handleSort(header === 'Address' ? 'Address1' : header.replace(' ', ''))}
              >
                {header}
                {sortKey === (header === 'Address' ? 'Address1' : header.replace(' ', '')) && (
                  <span>{sortOrder === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedContacts.map(({ CustomerID, FirstName, LastName, Email, Phone, Address1, City }, index) => (
            <tr
              key={index}
              className="hover:bg-green-50 even:bg-gray-100 odd:bg-gray-50 transition"
              onClick={() => {
                setSelectedContact({ CustomerID, FirstName, LastName, Email, Phone, Address1, City });
              }}
            >
              {[CustomerID, FirstName, LastName, Email, Phone, Address1, City].map((value, idx) => (
                <td key={idx} className="border px-2 py-1.5">{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContactsList;