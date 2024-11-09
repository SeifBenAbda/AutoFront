import { Car, FilePenLine, LayoutDashboard, Pickaxe } from 'lucide-react';
import { Button } from '../../@/components/ui/button';
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NavMenu: React.FC = () => {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState<string>(''); // Default active link
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768); // Initial check for mobile
  const navigate = useNavigate();

  // Update activeLink based on the current pathname
  useEffect(() => {
    const devisRegex = /^\/carTracking\/devis\/[^/]+$/;
  
    switch (true) {
      case devisRegex.test(location.pathname):
        setActiveLink('Suivi Devis Voiture');
        break;
      case location.pathname === '/car-request':
        setActiveLink('Dossier Voiture');
        break;
      case location.pathname === '/carTracking':
        setActiveLink('Suivi Devis Voiture');
        break;
      case location.pathname === '/profile':
        setActiveLink('');
        break;
      case location.pathname === '/devis':
        setActiveLink('Suivi Devis Voiture');
        break;
      default:
        setActiveLink('Dossier Voiture');
    }
  }, [location.pathname]);

  // Update isMobile state on window resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavClick = (section: string, navigateTo: string) => {
    setActiveLink(section);
    navigate(navigateTo); // Navigate to the specified path
  };

  // <option value="/dashboard">Dashboard</option>
  // <option value="/itemTracking">Suivi Changement des Pieces</option>
  if (isMobile) {
    return (
      <div className="block md:hidden"> {/* Hide on larger screens */}
        <select
          onChange={(e) => handleNavClick(e.target.options[e.target.selectedIndex].text, e.target.value)}
          value={location.pathname}
          className="bg-veryGrey text-highGrey2 border rounded-md p-2"
        >
          <option value="/car-request">Dossier Voiture</option>
          <option value="/carTracking">Suivi Devis Voiture</option>
        </select>
      </div>
    );
  }

  return (
    <nav className="hidden md:flex md:text-xs md:space-x-2 lg:text-base justify-center space-x-4 border rounded-2xl border-lightWhite bg-lightWhite">

      {/*
      <Button
        onClick={() => handleNavClick('Dashboard', "/dashboard")}
        className={`flex items-center justify-center p-2 rounded-md ${activeLink === 'Dashboard' ? 'bg-highGrey2 text-white font-oswald hover:bg-highGrey2' : 'bg-lightWhite text-highGrey2 font-oswald hover:bg-lightWhite'}`}
      >
        <div className="flex items-center space-x-2">
          <LayoutDashboard />
          <span>Dashboard</span>
        </div>
      </Button>
       */}
      <Button
        onClick={() => handleNavClick('Dossier Voiture', "/car-request")}
        className={`flex items-center justify-center p-2 rounded-md ${activeLink === 'Dossier Voiture' ? 'bg-highGrey2 text-white font-oswald hover:bg-highGrey2' : 'bg-lightWhite text-highGrey2 font-oswald hover:bg-lightWhite'}`}
      >
        <div className="flex items-center space-x-2">
          <Car />
          <span>Dossier Voiture</span>

        </div>
      </Button>

      <Button
        onClick={() => handleNavClick('Suivi Devis Voiture', "/carTracking")}
        className={`p-2 rounded-md ${activeLink === 'Suivi Devis Voiture' ? 'bg-highGrey2 text-white font-oswald hover:bg-highGrey2' : 'bg-lightWhite text-highGrey2 font-oswald hover:bg-lightWhite'}`}
      >
        <div className="flex items-center space-x-2">
          <FilePenLine />
          <span>Suivi Devis Voiture</span>
        </div>

      </Button>

      {/*
        <Button
        onClick={() => handleNavClick('Suivi Changement des Pieces', "/itemTracking")}
        className={`p-2 rounded-md ${activeLink === 'Suivi Changement des Pieces' ? 'bg-highGrey2 text-white font-oswald hover:bg-highGrey2' : 'bg-white text-highGrey2 font-oswald hover:bg-lightWhite'}`}
      >
        <div className="flex items-center space-x-2">
          <FilePenLine />
          <span>Suivi Changement des Pieces</span>
        </div>

      </Button>
      */}



    </nav>
  );
};

export default NavMenu;
