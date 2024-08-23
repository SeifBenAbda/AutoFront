import DataTable from "../components/organisms/DevisMainTable";


const CarDevisTrackingPage: React.FC = () => {
    return (
        <section className="flex-1 ml-4 bg-gray-150">
      <DataTable typeDevis={"TC"}/>
      </section>
    )
}

export default CarDevisTrackingPage

