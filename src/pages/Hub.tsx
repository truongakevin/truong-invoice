import React from 'react';
import { useAppContext } from '../AppContext';
import InvoicesPage from './InvoicesPage';
import ContactsPage from './ContactsPage';
import EstimatesPage from './EstimatesPage';

const WindowButtons: React.FC = () => {
  return (
    <div className="flex flex-row gap-2 p-4 pl-0 pt-0">
      <div className="w-4 h-4 bg-red-500 rounded-full cursor-pointer" onClick={() => window.electron.ipcRenderer.send('close-window')}></div>
      <div className="w-4 h-4 bg-yellow-500 rounded-full cursor-pointer" onClick={() => window.electron.ipcRenderer.send('minimize-window')}></div>
      <div className="w-4 h-4 bg-green-500 rounded-full cursor-pointer" onClick={() => window.electron.ipcRenderer.send('maximize-window')}></div>
    </div>
  )
}

const Navagation: React.FC = () => {
  const {
    activeTab, 
    setActiveTab
  } = useAppContext();

  return (
    <div className="flex flex-row gap-8 pt-2">
    {['Home', 'Invoices', 'Contacts', 'Estimates', 'Payments', 'Settings'].map((tab) => (
      <div
      key={tab}
      onClick={() => setActiveTab(tab as "Home" | "Invoices" | "Contacts" | "Estimates" | "Payments" | "Settings")}
      className={`pb-2 transition ${activeTab === tab ? 'border-b-4 border-white' : 'hover:scale-110'}`}
      >
      <h2>
        {tab}
      </h2>
      </div>
    ))}
  </div>
  )
}
const Hub: React.FC = () => {
  const {
    activeTab,
  } = useAppContext();

  return (
    <div className="flex flex-col w-screen h-screen justify-normal text-xs text-black p-0 m-0 border-0 bg-white">
      <div className="bg-green-800 shadow-lg topbar flex flex-row justify-between p-4 pb-0 text-white">
          <h1 className="pb-4">TruongInvoice</h1>
          <Navagation />
          <WindowButtons />
      </div>

      <div className="overflow-hidden">
        <div className="w-full h-full p-4">
          {activeTab === 'Contacts' && <ContactsPage />}
          {activeTab === 'Invoices' && <InvoicesPage />}
          {/* {activeTab === 'Estimates' && <EstimatesPage />} */}
          {/* {activeTab === 'Payments' && <PaymentsPage />} */}
        </div>
      </div>
    </div>
  );
};
export default Hub;