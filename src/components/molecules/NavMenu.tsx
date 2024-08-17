import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NavMenu: React.FC = () => {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState<string>(''); // Default active link
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768); // Initial check for mobile
  const navigate = useNavigate();

  // Update activeLink based on the current pathname
  useEffect(() => {
    switch (location.pathname) {
      case '/dashboard':
        setActiveLink('Dashboard');
        break;
      case '/car-request':
        setActiveLink('Dossier Voiture');
        break;
      case '/item-change':
        setActiveLink('Commande des Pieces');
        break;
      default:
        setActiveLink('Dashboard'); // Default case if no match
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

  if (isMobile) {
    return (
      <div className="block md:hidden"> {/* Hide on larger screens */}
        <select
          onChange={(e) => handleNavClick(e.target.options[e.target.selectedIndex].text, e.target.value)}
          value={location.pathname}
          className="bg-veryGrey text-bluePrimary border rounded-md p-2"
        >
          <option value="/dashboard">Dashboard</option>
          <option value="/car-request">Dossier Voiture</option>
          <option value="/item-change">Commande des Pieces</option>
        </select>
      </div>
    );
  }

  return (
    <nav className="hidden md:flex justify-center space-x-5 border rounded-2xl border-veryGrey bg-veryGrey">
      <button
        onClick={() => handleNavClick('Dashboard', "/dashboard")}
        className={`p-2 rounded-md ${activeLink === 'Dashboard' ? 'bg-bluePrimary text-white' : 'bg-veryGrey text-bluePrimary'}`}
      >
        Dashboard
      </button>
      <button
        onClick={() => handleNavClick('Dossier Voiture', "/car-request")}
        className={`p-2 rounded-md ${activeLink === 'Dossier Voiture' ? 'bg-bluePrimary text-white' : 'bg-veryGrey text-bluePrimary'}`}
      >
        Dossier Voiture
      </button>
      <button
        onClick={() => handleNavClick('Commande des Pieces', "/item-change")}
        className={`p-2 rounded-md ${activeLink === 'Commande des Pieces' ? 'bg-bluePrimary text-white' : 'bg-veryGrey text-bluePrimary'}`}
      >
        Commande des Pieces
      </button>
    </nav>
  );
};

export default NavMenu;
