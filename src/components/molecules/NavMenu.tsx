import React, { useEffect, useState } from 'react';
import NavLink from '../atoms/NavLink';
import { useNavigate, useLocation } from 'react-router-dom';

const NavMenu: React.FC = () => {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState<string>(''); // Default active link
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

  const handleNavClick = (section: string, navigateTo: string) => {
    setActiveLink(section);
    navigate(navigateTo); // Navigate to the specified path
  };

  return (
    <nav className="justify-center space-x-5 border rounded-2xl border-veryGrey inline-flex bg-veryGrey">
      <NavLink
        href="#dashboard"
        label="Dashboard"
        isActive={activeLink === 'Dashboard'}
        onClick={() => handleNavClick('Dashboard', "/dashboard")}
        activeBgColor="bg-bluePrimary"
        activeTextColor="text-white"
        defaultBgColor="bg-veryGrey"
        defaultTextColor="text-bluePrimary"
      />
      <NavLink
        href="#carrequest"
        label="Dossier Voiture"
        isActive={activeLink === 'Dossier Voiture'}
        onClick={() => handleNavClick('Dossier Voiture', "/car-request")}
        activeBgColor="bg-bluePrimary"
        activeTextColor="text-white"
        defaultBgColor="bg-veryGrey"
        defaultTextColor="text-bluePrimary"
      />
      <NavLink
        href="#itemchange"
        label="Commande des Pieces"
        isActive={activeLink === 'Commande des Pieces'}
        onClick={() => handleNavClick('Commande des Pieces', "/item-change")}
        activeBgColor="bg-bluePrimary"
        activeTextColor="text-white"
        defaultBgColor="bg-veryGrey"
        defaultTextColor="text-bluePrimary"
      />
    </nav>
  );
};

export default NavMenu;
