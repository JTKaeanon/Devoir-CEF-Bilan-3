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

      {/* LEFT (Desktop only) */}
      <div className={`nav-links-left ${isMenuOpen ? 'open' : ''}`}>
        <Link to="/" onClick={toggleMenu}>Nos Salons</Link>
        <Link to="/prestations" onClick={toggleMenu}>Prestations</Link>
      </div>

      {/* LOGO (center desktop , left mobile) */}
      <div className="logo-container">
        <Link to="/" className="logo">Le Groupe l'Atelier</Link>
      </div>

      {/* BURGER (mobile only) */}
      <button className="burger-menu" onClick={toggleMenu} aria-label="Menu">
        {isMenuOpen ? '✖' : '☰'}
      </button>

      {/* RIGHT (Desktop only) - MENU (Mobile) */}
      <div className={`nav-links-right ${isMenuOpen ? 'open' : ''}`}>
        <Link to="/" className="mobile-only" onClick={toggleMenu}>Nos Salons</Link>
        <Link to="/prestations" className="mobile-only" onClick={toggleMenu}>Prestations</Link>
        
        <Link to="/reservation" onClick={toggleMenu}>Prendre RDV</Link>
        <Link to="/compte" onClick={toggleMenu}>Mon compte</Link>

        {/* mobile only */}
        <Link to="/mentions-legales" className="mobile-only" onClick={toggleMenu}>Mentions Légales</Link>
      </div>

    </header>
  );
}