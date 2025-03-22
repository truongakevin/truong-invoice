import React from 'react';
import { createRoot } from 'react-dom/client';
import Hub from './components/Hub';
import './index.css';

const root = createRoot(document.body);
root.render(
    <React.StrictMode>
        <Hub />
    </React.StrictMode>
);
