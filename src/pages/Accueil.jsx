// src/pages/Accueil.jsx
import { Link } from 'react-router-dom';
import { salonsData } from '../api/salons'; // Import des données
import './Accueil.css';

export default function Accueil() {
  return (
    <div className="accueil-container">
      <section className="hero-grid">
        <div className="grid-item presentation-block">
          <div className="presentation-content">
            <h1 className="group-title">Le Groupe l'Atelier</h1>
            <p className="group-text">L'excellence au service de votre beauté depuis 10 ans.</p>
            <Link to="/nos-salons" className="group-cta">Découvrir nos salons</Link>
          </div>
        </div>

        {/* Génération dynamique des cartes salons */}
        {salonsData.map((salon) => (
          <Link 
            key={salon.id} 
            to="/nos-salons" 
            className="grid-item salon-card" 
            style={{ backgroundImage: `url(${salon.image})` }}
          >
            <div className="salon-overlay">
              <h3>{salon.name}</h3>
              <p>{salon.subtitle}</p>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}