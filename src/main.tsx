// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { UserProvider } from './context/userContext.tsx';
import { AuthProvider } from './context/authContext.tsx';
import { DevisCompteurProvider } from './context/devisCompteurContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <UserProvider>
        <DevisCompteurProvider>
          <App />
        </DevisCompteurProvider>
      </UserProvider>
    </AuthProvider>
  </StrictMode>
);
