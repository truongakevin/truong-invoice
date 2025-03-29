import React, { useState } from 'react';
import InvoicesPage from './invoices/InvoicesPage';
import ContactsPage from './contacts/ContactsPage';
// import Estimates from './Estimates';
// import Payments from './Payments';

const Hub: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Contacts');

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex flex-row p-8 pb-0 shadow-lg justify-between items-end bg-green-800 text-white">
        <div className="flex flex-row gap-8">
          {['Home', 'Invoices', 'Contacts', 'Estimates', 'Payments', 'Settings'].map((tab) => (
            <div
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 text-3xl font-semibold transition ${
                activeTab === tab ? 'border-b-4 border-white' : 'hover:scale-110'
              }`}
            >
              {tab}
            </div>
          ))}
        </div>
        <h1 className="pb-4 text-4xl font-bold">TruongInvoice</h1>
      </div>

      {/* Tab Content - Takes Up Remaining Space */}
      <div className="flex-1 overflow-hidden">
        <div className="w-full h-full p-4">
          {activeTab === 'Invoices' && <InvoicesPage />}
          {activeTab === 'Contacts' && <ContactsPage />}
        </div>
      </div>
    </div>
  );
};
export default Hub;