import DataTable from "../components/organisms/DevisMainTable";

const CarDevisTrackingPage: React.FC = () => {
    return (
        <section className="flex-1 flex flex-col ml-4 bg-gray-150 overflow-hidden">
            <DataTable typeDevis={"TC"} />
        </section>
    );
};

export default CarDevisTrackingPage;
