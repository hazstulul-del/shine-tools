import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

fetch('/api/visitor', {
  method: 'POST'
}).catch(() => {});

createRoot(document.getElementById('root')!).render(
  <App />
);
