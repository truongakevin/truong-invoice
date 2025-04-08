import React from 'react';
import { createRoot } from 'react-dom/client';
import Hub from '../pages/Hub';
import { AppProvider } from '../AppContext';

const root = createRoot(document.getElementById('root'));

root.render(
  <AppProvider>
    <Hub />
  </AppProvider>
);

