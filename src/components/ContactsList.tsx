import React from 'react';

// const ContactsList = ({ contacts, setSelectedContact, setShowForm }: { contacts: any[], setSelectedContact: (contact: any) => void, setShowForm: (value: boolean) => void }) => {
const ContactsList = ({ 
  contacts, 
  setSelectedContact 
}: { 
  contacts: any[], 
  setSelectedContact: (contact: any) => void
}) => {
  return (
  //   <div className="w-full shadow-md rounded-lg">
    <div className="w-full overflow-x-auto shadow-lg sm:rounded-lg">
      <table className="w-full text-md text-left text-black rounded-lg">
        <thead className="bg-gray-200">
          <tr>
            {['ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Address', 'City'].map((header) => (
              <th key={header} className="px-2 py-2.5">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {contacts.map(({ CustomerID, FirstName, LastName, Email, Phone, Address1, City }, index) => (
            <tr 
              key={index} className="hover:bg-green-50 even:bg-gray-100 odd:bg-gray-50 transition" 
              onClick={() => {
                setSelectedContact({ CustomerID, FirstName, LastName, Email, Phone, Address1, City });
                // setShowForm(false);
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