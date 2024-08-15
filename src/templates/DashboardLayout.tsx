import React from 'react';
import Header from '../components/organisms/Header'; // Import the Header component
import DataTable from '../components/organisms/MvtVenliTableMain';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ResizableTable from '../components/organisms/ResizableTable';

interface DashboardLayoutProps {
}

const DashboardLayout: React.FC<DashboardLayoutProps> = () => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 p-4 bg-gray-100 flex">
        
        {/* Main Content Area */}
        <section className="flex-1 ml-4 bg-gray-150">
        <DataTable/>
        <ResizableTable/>
        </section>
      </main>

    </div>
    </QueryClientProvider>
  );
};

export default DashboardLayout;
