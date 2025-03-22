import React, { useState } from 'react';
import Invoices from './Invoices';
import Contacts from './Contacts';
// import Estimates from './Estimates';
// import Payments from './Payments';


const Hub: React.FC = () => {
  const [activeTab, setActiveTab] = useState('contacts');
  return (
    <div>
      <div className="text-">
        <h1 className="text-red-500">TruongInvoice</h1>
        <div className="tab">
          <button onClick={() => setActiveTab('invoices')}>Invoices</button>
          <button onClick={() => setActiveTab('contacts')}>Contacts</button>
          <button onClick={() => setActiveTab('estimates')}>Estimates</button>
          <button onClick={() => setActiveTab('payments')}>Payments</button>
          </div>
      </div>
      <div className="tab-content">
        {activeTab === 'invoices' && <Invoices />}
        {activeTab === 'contacts' && <Contacts />}
        {/* {activeTab === 'estimates' && <Estimates />}
        {activeTab === 'payments' && <Payments />} */}
      </div>
    </div>
  );
};

export default Hub;