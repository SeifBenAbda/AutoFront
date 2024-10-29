import CarDevisTrackingPage from "../pages/CarDevisTrackingPage";
import Header from "../components/organisms/Header";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CarsTrackingPage } from "../pages/CarsTrackingPage";

const CarTrackingLayout: React.FC = () => {
    const queryClient = new QueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            <div className="min-h-screen flex flex-col">
                {/* Header */}
                <Header />

                {/* Main Content */}
                <main className="flex-1 p-4 bg-whiteSecond flex">
                    <CarDevisTrackingPage />
                </main>
            </div>
        </QueryClientProvider>
    );
};

export default CarTrackingLayout;
