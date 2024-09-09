import React from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid'; // Ensure this is the correct import

interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTogglePassword: () => void;
  showPassword: boolean;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ value, onChange, onTogglePassword, showPassword }) => {
  return (
    <div className="relative">
      <input
        type={showPassword ? 'text' : 'password'}
        id="password"
        name="password"
        value={value}
        onChange={onChange}
        className="w-full p-2 border border-veryGrey focus:border-highGrey focus:outline-none rounded-md mt-1 font-oswald text-gray-600 pr-10"
        placeholder="Mot de passe"
      />
      <button
        type="button"
        onClick={onTogglePassword}
        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
      >
        {showPassword ? (
          <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
        ) : (
          <EyeIcon className="h-5 w-5" aria-hidden="true" />
        )}
      </button>
    </div>
  );
};

export default PasswordInput;
