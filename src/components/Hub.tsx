import React, { useState } from 'react';
import Invoices from './Invoices';
import Contacts from './contacts/ContactsPage';
// import Estimates from './Estimates';
// import Payments from './Payments';

const Hub: React.FC = () => {
  const [activeTab, setActiveTab] = useState('contacts');

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-lg px-20 pt-12 pb-8 flex justify-between items-end">
        <h1 className="text-5xl font-bold">TruongInvoice</h1>
        <div className="">
          {['invoices', 'contacts', 'estimates', 'payments'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`p-4 pb-0 text-3xl font-semibold rounded-md transition text-black ${
                activeTab === tab ? '' : 'hover:scale-110'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="py-4 px-24 bg-gray-100">
        {activeTab === 'invoices' && <Invoices />}
        {activeTab === 'contacts' && <Contacts />}
        {/* {activeTab === 'estimates' && <Estimates />}
        {activeTab === 'payments' && <Payments />} */}
      </div>
    </div>
  );
};

export default Hub;