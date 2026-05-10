import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
// import dotenv from "dotenv";

import './index.css';
import App from './App.jsx';
// const clientId = import.meta.env.GOOGLE_CLIENT_ID;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="772181384025-he15pl78oi5um7fepgfku4d3nfij2tbo.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
);