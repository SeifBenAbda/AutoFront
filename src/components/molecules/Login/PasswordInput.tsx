import React from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid'; // Ensure this is the correct import
import { Input } from '../../../@/components/ui/input';

interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTogglePassword: () => void;
  showPassword: boolean;
  placeholder?:string;
  id?:number;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({ value, onChange, onTogglePassword, showPassword }) => {
  return (
    <div className="relative">
      <Input
        type={showPassword ? 'text' : 'password'}
        id="password"
        name="password"
        value={value}
        onChange={onChange}
        className="w-full p-2 border border-veryGrey focus:border-highBlue focus:outline-none rounded-md mt-1 font-oswald text-gray-600 pr-10"
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


export const PasswordInputNew: React.FC<PasswordInputProps> = ({ value, onChange, onTogglePassword, showPassword , placeholder , id }) => {
  return (
    <div className="relative">
      <Input
        type={showPassword ? 'text' : 'password'}
        id={id?.toString()}
        name="password"
        value={value}
        onChange={onChange}
        className="w-full mt-1 p-2 mr-2 block border border-highBlue text-highBlue rounded-md shadow-sm focus:ring-0 sm:text-sm font-oswald"
        placeholder={placeholder?placeholder:"Mot de passe"}
      />
      <button
        type="button"
        onClick={onTogglePassword}
        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-800"
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


