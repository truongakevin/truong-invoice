import React from 'react';
import { createRoot } from 'react-dom/client';
import Hub from './components/Hub';

const root = createRoot(document.body);
root.render(
    <React.StrictMode>
        <Hub />
    </React.StrictMode>
);
