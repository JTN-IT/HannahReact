import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Auth0Provider } from "@auth0/auth0-react";
import App from './App.jsx';
import './index.css';


console.log("VITE_AUTH0_DOMAIN:", import.meta.env.VITE_AUTH0_DOMAIN);
console.log("VITE_AUTH0_CLIENT_ID:", import.meta.env.VITE_AUTH0_CLIENT_ID);
// Optionally log the fallback Netlify vars if you want:
console.log("AUTH0_DOMAIN:", import.meta.env.AUTH0_DOMAIN);
console.log("AUTH0_CLIENT_ID:", import.meta.env.AUTH0_CLIENT_ID);



createRoot(document.getElementById("root")).render(
  <Auth0Provider
    domain={import.meta.env.VITE_AUTH0_DOMAIN || import.meta.env.AUTH0_DOMAIN}
    clientId={import.meta.env.VITE_AUTH0_CLIENT_ID || import.meta.env.AUTH0_CLIENT_ID}
    
    authorizationParams={{
      redirect_uri: window.location.origin,
    }}
  >
      <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>
  </Auth0Provider>
);