// src/main.tsx
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { UserProvider } from './context/userContext.tsx';
import { AuthProvider } from './context/authContext.tsx';

createRoot(document.getElementById('root')!).render(
 
    <AuthProvider>
      <UserProvider>

        <App />

      </UserProvider>
    </AuthProvider>
);
