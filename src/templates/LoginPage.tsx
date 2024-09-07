import React from 'react';
import LoginForm from '../components/molecules/LoginForm';

const LoginPage: React.FC = () => {
  return (
    <div
      className="h-screen flex flex-col bg-greenZero"
      style={{ backgroundImage: 'url("https://undraw.co/api/illustrations/2d09f2c8-2a6d-4c12-bb1c-6c589e3eae7f")', backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute top-4 left-4">
        <h1 className="text-2xl font-bold text-greenFour font-oswald">AUTO PRO</h1>
      </div>
      <div className="flex-grow flex items-center justify-center z-10">
        <div className="w-full max-w-md bg-greenFour p-8 rounded-xl shadow-md m-4">
          <h1 className="text-3xl font-bold mb-6 text-center font-oswald text-white">Connexion</h1>
          <LoginForm />
        </div>
      </div>
      <footer className="text-greenFour py-4">
        <div className="container mx-auto text-center font-oswald">
          <span>&copy; 2024 UniversSoft Tunisie</span>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
