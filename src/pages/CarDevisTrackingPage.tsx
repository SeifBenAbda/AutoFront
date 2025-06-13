import DataTable from "../components/organisms/DevisTracking/DevisMainTable";

interface CarDevisTrackingPageProps {
  autoOpenDevisId?: number | string;
}

const CarDevisTrackingPage: React.FC<CarDevisTrackingPageProps> = ({ autoOpenDevisId }) => {
    return (
        <section className="flex-1 flex flex-col ml-4 bg-gray-150 overflow-hidden">
            <DataTable typeDevis={"TC"} autoOpenDevisId={autoOpenDevisId} />
        </section>
    );
};

export default CarDevisTrackingPage;
