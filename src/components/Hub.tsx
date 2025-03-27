import React, { useState } from 'react';
import InvoicesPage from './invoices/InvoicesPage';
import ContactsPage from './contacts/ContactsPage';
// import Estimates from './Estimates';
// import Payments from './Payments';

const Hub: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Contacts');

  return (
    <div className="fex flex-col min-h-screen w-full items-start justify-start m-0 p-0 border-0 shadow-none rounded-none bg-neutral-50">
      {/* Header */}
      <div className="flex flex-row p-16 pb-0 shadow-lg justify-between items-end bg-neutral-200">
        <div className='flex flex-row gap-8'>
            {['Home', 'Invoices', 'Contacts', 'Estimates', 'Payments', 'Settings'].map((tab) => (
              <div
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-3xl font-semibold transition ${
                  activeTab === tab ? 'border-b-4 border-neutral-800' : 'hover:scale-110'}`}
              >
                {tab}
              </div>
            ))}
        </div>
        <h1 className="pb-6 text-5xl font-bold">TruongInvoice</h1>
      </div>
      
      {/* Tab Content */}
      <div className="px-10">
        {/* {activeTab === 'Home' && <Home />} */}
        {activeTab === 'Invoices' && <InvoicesPage />}
        {activeTab === 'Contacts' && <ContactsPage />}
        {/* {activeTab === 'estimates' && <Estimates />}
        {activeTab === 'payments' && <Payments />} */}
        {/* {activeTab === 'Settings' && <Settings />} */}
      </div>
    </div>
  );
};

export default Hub;