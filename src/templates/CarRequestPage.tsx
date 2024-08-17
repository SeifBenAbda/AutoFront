import DevisPage from "../pages/DevisPage";
import Header from "../components/organisms/Header";

const CarRequestPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}

      <DevisPage />
    </div>
  );
};

export default CarRequestPage;
