import DevisPage from "../pages/DevisPage";
import Header from "../components/organisms/Header";

const CarRequestPage: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <Header/>

            {/* Main Content */}
            <main className="flex-1 p-4 bg-gray-100 flex gap-4">
                <DevisPage/>
                <DevisPage/>
            </main>
        </div>
    );
};

export default CarRequestPage;
