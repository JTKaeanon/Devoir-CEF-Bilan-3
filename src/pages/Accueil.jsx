import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Accueil.css';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function Accueil() {
  const [salons, setSalons] = useState([]);
  
  useDocumentTitle('Accueil');

  useEffect(() => {
    const fetchSalons = async () => {
      try {
        const reponse = await fetch('https://groupe-atelier-devoir-bilan.onrender.com/api/salons');
        if (reponse.ok) {
          const data = await reponse.json();
          setSalons(data);
        }
      } catch (erreur) {
        console.error("Erreur de chargement des salons", erreur);
      }
    };
    fetchSalons();
  }, []);

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

        {/* dynamique card db */}
        {salons.map((salon) => (
          <Link 
            key={salon.id} 
            to={`/salon/${salon.slug}`} 
            className="grid-item salon-card" 
            style={{ 
              backgroundColor: '#2c3e50', // couleurs si pas image
              backgroundImage: salon.image ? `url(${salon.image})` : 'none' 
            }}
          >
            <div className="salon-overlay">
              <h3>{salon.nom}</h3>
              <p>{salon.subtitle || "Découvrir ce salon"}</p>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}