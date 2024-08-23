import Header from "../components/organisms/Header";
import { useEffect } from "react";

const ItemChangeTrackingPage: React.FC = () => {
    useEffect(() => {
        // Scroll to the top when the component mounts
        window.scrollTo(0, 0);
      }, []);
      return (
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <Header />
    
          {/* Main Content */}
          <main className="flex-1 pt-16"> {/* pt-16 adds padding-top equal to 4rem, adjust if needed */}
            <div>Item Tracking</div>
          </main>
        </div>
      );
}

export default ItemChangeTrackingPage


