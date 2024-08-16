import Header from "../components/organisms/Header";

const ItemChangePage: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header/>

      {/* Main Content */}
      <main className="flex-1 p-4 bg-gray-100 flex">
        <p>Item Change</p>
      </main>

    </div>
    );
  };
  
  export default ItemChangePage;