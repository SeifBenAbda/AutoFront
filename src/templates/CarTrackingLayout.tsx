import CarDevisTrackingPage from "../pages/CarDevisTrackingPage";
import Header from "../components/organisms/Header";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
const CarTrackingLayout: React.FC = () => {
    const queryClient = new QueryClient();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const devisToModify = params.get('devis');
    return (
        <QueryClientProvider client={queryClient}>
            <div className="min-h-screen flex flex-col">
                {/* Header */}
                <Header />

                {/* Main Content */}
                <main className="flex-1 p-4 bg-bgColorLight flex">
                    <CarDevisTrackingPage autoOpenDevisId={devisToModify ? Number(devisToModify) : undefined} />
                </main>
            </div>
        </QueryClientProvider>
    );
};

export default CarTrackingLayout;
