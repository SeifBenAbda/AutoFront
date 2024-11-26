// src/components/pages/LoginForm.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import { PasswordInput } from './PasswordInput';
import Loading from '../../atoms/Loading';
import { Input } from '../../../@/components/ui/input';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { handleLogin, error } = useAuth();

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await handleLogin(username, password, () => navigate('/dashboard'));
    setIsLoading(false);
  };

  return (
    <div className="relative">
      {isLoading && <Loading />}
      <form onSubmit={handleSubmit} className="relative z-10">
        <div className="mb-4">
          <Input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border border-veryGrey focus:border-highGrey2 focus:outline-none rounded-md mt-1 font-oswald text-gray-600 pr-10"
            placeholder="Nom d'utilisateur"
          />
        </div>
        <div className="mb-6">
          <PasswordInput
            value={password}
            onChange={handlePasswordChange}
            onTogglePassword={handleTogglePassword}
            showPassword={showPassword}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-white text-highGrey2 p-2 rounded-lg hover:highGrey2 transition duration-300 font-oswald"
          disabled={isLoading}
        >
          {isLoading ? 'Chargement...' : 'Se Connecter'}
        </button>
        {error && <p className="text-white text-center m-2">{error}</p>}
      </form>
    </div>
  );
};

export default LoginForm;
