import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// import dotenv from "dotenv";

import './index.css';
import App from './App.jsx';
// const clientId = import.meta.env.GOOGLE_CLIENT_ID;

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <App />
  </StrictMode>
);