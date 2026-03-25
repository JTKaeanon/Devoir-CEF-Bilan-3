import { Link } from 'react-router-dom';
import './Accueil.css';
import imgSalon1 from '../assets/salon1.jpg';
import imgSalon2 from '../assets/salon2.jpg';
import imgSalon3 from '../assets/salon3.jpg';

export default function Accueil() {
  return (
    <div className="accueil-container">
      <section className="hero-grid">
        
        {/*top left */}
        <div className="grid-item presentation-block">
          <div className="presentation-content">
            <h1 className="group-title">Le Groupe l'Atelier</h1>
            <h2 className="group-subtitle">L'excellence au service de votre beauté</h2>
            <p className="group-text">
              Depuis plus de 10 ans, nos salons incarnent un savoir-faire unique et une passion 
              pour la coiffure haute couture. Découvrez nos univers dédiés au bien-être et à l'élégance.
            </p>
            <Link to="/nos-salons" className="group-cta">Découvrir nos salons</Link>
          </div>
        </div>

        {/* top right */}
        <Link to="/nos-salons" className="grid-item salon-card" style={{ backgroundImage: `url(${imgSalon1})` }}>
          <div className="salon-overlay">
            <h3>The Old school</h3>
            <p>Chic & Contemporain</p>
          </div>
        </Link>

        {/* bottom left */}
        <Link to="/nos-salons" className="grid-item salon-card" style={{ backgroundImage: `url(${imgSalon2})` }}>
          <div className="salon-overlay">
            <h3>L'essence de soi</h3>
            <p>Élégance & Lumière</p>
          </div>
        </Link>

        {/*  bottom right */}
        <Link to="/nos-salons" className="grid-item salon-card" style={{ backgroundImage: `url(${imgSalon3})` }}>
          <div className="salon-overlay">
            <h3>L'Atelier mixte</h3>
            <p>Nature & Pureté</p>
          </div>
        </Link>

      </section>
    </div>
  );
}