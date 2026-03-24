import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="navbar-container">
      
      {/* GROUPE GAUCHE (Desktop uniquement) */}
      <div className={`nav-links-left ${isMenuOpen ? 'open' : ''}`}>
        <Link to="/" onClick={toggleMenu}>Nos Salons</Link>
        <Link to="/prestations" onClick={toggleMenu}>Prestations</Link>
      </div>

      {/* LE LOGO (Au centre sur Desktop, à gauche sur Mobile) */}
      <div className="logo-container">
        <Link to="/" className="logo">Le Groupe l'Atelier</Link>
      </div>

      {/* LE BURGER MENU (Mobile uniquement) */}
      <button className="burger-menu" onClick={toggleMenu} aria-label="Menu">
        {/* J'ai mis trois tirets pour faire un burger maison plus fidèle à ta maquette */}
        {isMenuOpen ? '✖' : '☰'} 
      </button>

      {/* GROUPE DROITE (Desktop) ou MENU ENTIER (Mobile) */}
      <div className={`nav-links-right ${isMenuOpen ? 'open' : ''}`}>
        {/* On remet les liens de gauche ici pour le menu mobile */}
        <Link to="/" className="mobile-only" onClick={toggleMenu}>Nos Salons</Link>
        <Link to="/prestations" className="mobile-only" onClick={toggleMenu}>Prestations</Link>
        
        <Link to="/reservation" onClick={toggleMenu}>Prendre RDV</Link>
        <Link to="/compte" onClick={toggleMenu}>Mon compte</Link>
      </div>
      
    </header>
  );
}