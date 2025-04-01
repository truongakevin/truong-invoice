import React from 'react';
import { createRoot } from 'react-dom/client';
import Hub from './components/Hub';

const rootElement = document.getElementById('root')!;
const root = createRoot(rootElement);

root.render(
  <Hub />
);