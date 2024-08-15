// src/components/pages/LoginForm.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import useAuth from '../../hooks/useAuth'; // Import your custom hook
import PasswordInput from './PasswordInput'; // Ensure this is correctly imported

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate
  const { handleLogin, error } = useAuth(); // Use the custom hook

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(username, password, ()=>navigate('/dashboard')); // Pass navigate to handleLogin
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border border-veryGrey focus:border-bluePrimary focus:outline-none rounded-md mt-1 font-oswald text-gray-600"
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
        className="w-full bg-bluePrimary text-gray-700 p-2 rounded-lg hover:bg-yellow-600 transition duration-300 font-oswald font-semibold"
      >
        Se Connecter
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
};

export default LoginForm;
