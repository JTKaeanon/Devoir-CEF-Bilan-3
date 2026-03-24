import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // close menu on selection
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="navbar-container">

      {/* GAUCHE Desktop */}
      <div className={`nav-links-left ${isMenuOpen ? 'open' : ''}`}>
        <Link to="/nos-salons" onClick={closeMenu}>Nos Salons</Link>
        <Link to="/prestations" onClick={closeMenu}>Prestations</Link>
      </div>

      {/* LOGO Centre desktop, gauche mobile) */}
      <div className="logo-container">
        <Link to="/" className="logo" onClick={closeMenu}>Le Groupe l'Atelier</Link>
      </div>

      {/* BURGER */}
      <button className="burger-menu" onClick={toggleMenu} aria-label="Menu">
        {isMenuOpen ? '✖' : '☰'}
      </button>

      {/* DROITE (Desktop) / MENU (Mobile) */}
      <div className={`nav-links-right ${isMenuOpen ? 'open' : ''}`}>

        <Link to="/nos-salons" className="mobile-only" onClick={closeMenu}>Nos Salons</Link>
        <Link to="/prestations" className="mobile-only" onClick={closeMenu}>Prestations</Link>
        <Link to="/reservation" onClick={closeMenu}>Prendre RDV</Link>
        <Link to="/compte" onClick={closeMenu}>Mon compte</Link>

        {/* Mentions Légales burger mobile */}
        <Link to="/mentions-legales" className="mobile-only" onClick={closeMenu}>Mentions Légales</Link>
      </div>

    </header>
  );
}