import React from 'react';
import Header from '../components/organisms/Header';
import DashboardPage from '../pages/DashboardPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface DashboardLayoutProps {}

const DashboardLayout: React.FC<DashboardLayoutProps> = () => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 p-6 bg-gray-100 flex flex-col">
          <div className="text-2xl font-oswald text-highBlue mb-4">
            Dashboard
          </div>
          <DashboardPage />
        </main>
      </div>
    </QueryClientProvider>
  );
};

export default DashboardLayout;
