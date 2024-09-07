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
      case '/carTracking':
        setActiveLink('Suivi Devis Voiture');
        break;
      case '/itemTracking':
        setActiveLink('Suivi Changement des Pieces');
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
          className="bg-veryGrey text-greenFour border rounded-md p-2"
        >
          <option value="/dashboard">Dashboard</option>
          <option value="/car-request">Dossier Voiture</option>
          <option value="/item-change">Commande des Pieces</option>
          <option value="/carTracking">Suivi Devis Voiture</option>
          <option value="/itemTracking">Suivi Changement des Pieces</option>
        </select>
      </div>
    );
  }

  return (
    <nav className="hidden md:flex md:text-xs md:space-x-2 lg:text-base justify-center space-x-4 border rounded-2xl border-white bg-white">
      <button
        onClick={() => handleNavClick('Dashboard', "/dashboard")}
        className={`p-2 rounded-md ${activeLink === 'Dashboard' ? 'bg-greenFour text-white font-oswald' : 'bg-white text-greenFour font-oswald'}`}
      >
        Dashboard
      </button>
      <button
        onClick={() => handleNavClick('Dossier Voiture', "/car-request")}
        className={`p-2 rounded-md ${activeLink === 'Dossier Voiture' ? 'bg-greenFour text-white font-oswald' : 'bg-white text-greenFour font-oswald'}`}
      >
        Dossier Voiture
      </button>
      <button
        onClick={() => handleNavClick('Commande des Pieces', "/item-change")}
        className={`p-2 rounded-md ${activeLink === 'Commande des Pieces' ? 'bg-greenFour text-white font-oswald' : 'bg-white text-greenFour font-oswald'}`}
      >
        Commande des Pieces
      </button>

      <button
        onClick={() => handleNavClick('Suivi Devis Voiture', "/carTracking")}
        className={`p-2 rounded-md ${activeLink === 'Suivi Devis Voiture' ? 'bg-greenFour text-white font-oswald' : 'bg-white text-greenFour font-oswald'}`}
      >

        Suivi Devis Voiture
      </button>

      <button
        onClick={() => handleNavClick('Suivi Changement des Pieces', "/itemTracking")}
        className={`p-2 rounded-md ${activeLink === 'Suivi Changement des Pieces' ? 'bg-greenFour text-white font-oswald' : 'bg-white text-greenFour font-oswald'}`}
      >

        Suivi Changement des Pieces
      </button>


    </nav>
  );
};

export default NavMenu;
