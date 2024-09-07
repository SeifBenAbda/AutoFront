
import Header from "../components/organisms/Header";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ItemChangeTrackingPage from "../pages/ItemChangeTrackingPage";

const ItemTrackingLayout: React.FC = () => {
    const queryClient = new QueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            <div className="min-h-screen flex flex-col">
                {/* Header */}
                <Header />

                {/* Main Content */}
                <main className="flex-1 p-4 bg-gray-100 flex">
                    <ItemChangeTrackingPage />
                </main>
            </div>
        </QueryClientProvider>
    );
};

export default ItemTrackingLayout;
