import DevisPage from "../pages/DevisPage";
import Header from "../components/organisms/Header";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Sidebar } from "../components/organisms/SideBar"; // Import the Sidebar component
import { useNavigate } from "react-router-dom";

const CarRequestLayout: React.FC = () => {
  const queryClient = new QueryClient();
  const [isExpanded, setIsExpanded] = useState(true); // Track Sidebar expand/collapse state
  const [currentPath, setCurrentPath] = useState("/main"); // Track Sidebar expand/collapse state
  const [isMobile, setIsMobile] = useState(false); // For mobile responsiveness
  const [isSidebarVisible, setIsSidebarVisible] = useState(false); // Manage sidebar visibility on mobile
  const navigate = useNavigate();


  useEffect(() => {
    window.scrollTo(0, 0);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // Adjust for mobile view
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleToggleSidebar = () => {
    setIsExpanded(!isExpanded); // Toggle sidebar expansion
  };

  const handleSidebarToggle = () => {
    setIsSidebarVisible(!isSidebarVisible); // Toggle sidebar visibility on mobile
  };

  const handleNavigate = (path: string) => {
    console.log(path);
    setCurrentPath(path);
    navigate(path);
    if (isMobile) {
      setIsSidebarVisible(false); // Close the mobile sidebar when navigating
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <Header />

        {/* Sidebar + Main Layout */}
        <div className="flex flex-1">
          {/* Sidebar */}

          {/* Button to toggle sidebar on mobile 
          <Sidebar
            onNavigate={handleNavigate}
            currentPath={currentPath}
            isExpanded={isExpanded}
            onToggleExpand={handleToggleSidebar}
           
            className="flex-shrink-0 mb-6"
          />

          */}

          {/* Button to toggle mobile sidebar */}
          

          {/* Main Content */}
          <main
            className={`flex-1 w-full overflow-auto transition-all duration-300 sticky`}
          >
            <DevisPage />
          </main>
        </div>
      </div>
    </QueryClientProvider>
  );
};

export default CarRequestLayout;
