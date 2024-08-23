import React from 'react';
import Header from '../components/organisms/Header'; // Import the Header component
import DataTable from '../components/organisms/DevisMainTable';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


interface DashboardLayoutProps {
}

const DashboardLayout: React.FC<DashboardLayoutProps> = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 p-4 bg-gray-100 flex">


      </main>

    </div>
  )
};

export default DashboardLayout;
