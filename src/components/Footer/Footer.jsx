import { Link } from 'react-router-dom';
import { FaFacebook, FaTiktok, FaInstagram } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer-container">
      
      <div className="footer-section">
        <h4 className="footer-title">Informations Pratiques</h4>
        <p>Lundi - Samedi</p>
        <p>9h00 - 19h00</p>
        <Link to="/contact">Contact</Link>
        <Link to="/compte">Espace Client</Link>
      </div>

      <div className="footer-section footer-center">
        <Link to="/" className="footer-logo-link">
          <h2 className="footer-logo">Le Groupe l'Atelier</h2>
        </Link>
        
        <div className="social-icons">
          <a href="https://facebook.com" aria-label="Visitez notre page Facebook" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
          <a href="https://x.com" aria-label="Visitez notre page X" target="_blank" rel="noopener noreferrer"><FaXTwitter /></a>
          <a href="https://tiktok.com" aria-label="Visitez notre page Tiktok" target="_blank" rel="noopener noreferrer"><FaTiktok /></a>
          <a href="https://instagram.com" aria-label="Visitez notre page Instagram" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
        </div>
      </div>

      <div className="footer-section footer-right">
        <Link to="/mentions-legales">Mentions Légales</Link>
        <Link to="/confidentialite">Politique de confidentialité (RGPD)</Link>
      </div>

    </footer>
  );
}