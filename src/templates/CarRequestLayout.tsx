import DevisPage from "../pages/DevisPage";
import Header from "../components/organisms/Header";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Sidebar } from "../components/organisms/SideBar";
import { useNavigate } from "react-router-dom";
import Loading from "../components/atoms/Loading";

const CarRequestLayout: React.FC = () => {
  const queryClient = new QueryClient();
  const [isExpanded, setIsExpanded] = useState(true);
  const [currentPath, setCurrentPath] = useState("/main");
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Manage loading state here
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleToggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSidebarToggle = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const handleNavigate = (path: string) => {
    console.log(path);
    setCurrentPath(path);
    navigate(path);
    if (isMobile) {
      setIsSidebarVisible(false);
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      {isLoading && <Loading />}
      <div className="flex flex-col">
        {/* Header */}
        <Header />

        {/* Sidebar + Main Layout */}
        <div className="flex flex-1">
          {/* Main Content */}
          <main
            className={`flex-1 w-full overflow-auto transition-all duration-300 sticky`}
          >
            {/* Pass isLoading and setIsLoading to DevisPage */}
            <DevisPage isLoading={isLoading} setIsLoading={setIsLoading} />
            {/* Render Loading component here */}
            
          </main>
        </div>
      </div>
    </QueryClientProvider>
  );
};

export default CarRequestLayout;
