import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// No cambiar el orden en que se importa el boostrap y luego el index.css
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import App from './App';

const container = document.getElementById('root');

if (!container) {
  throw new Error('No se encontró el elemento #root en index.html');
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
