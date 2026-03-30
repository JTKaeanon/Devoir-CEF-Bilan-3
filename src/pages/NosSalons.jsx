import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BsGeoAltFill, BsTelephoneFill, BsPeopleFill } from 'react-icons/bs';
import './NosSalons.css';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { salonsData } from '../api/salons';

export default function NosSalons() {
  const [salons, setSalons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // On garde le petit délai de 800ms pour simuler un vrai chargement réseau,
    // c'est une excellente pratique pour préparer le terrain à une vraie base de données !
    const timer = setTimeout(() => {
      setSalons(salonsData); // On utilise les données de notre API locale ici
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  useDocumentTitle('Nos salons');

  return (
    <div className="nos-salons-container">
      <div className="salons-header">
        <h1 className="salons-title">Nos Salons</h1>
        <p className="salons-subtitle">Découvrez nos espaces rennais dédiés à votre bien-être.</p>
      </div>

      {isLoading ? (
        <div className="loading-spinner"><p>Chargement de nos salons...</p></div>
      ) : (
        <div className="salons-list">
          {salons.map((salon) => (
            <div key={salon.id} className="salon-list-card">
              <div className="salon-list-image" style={{ backgroundImage: `url(${salon.image})` }}></div>
              <div className="salon-list-content">
                <h2>{salon.name}</h2>
                <span className="salon-badge">{salon.subtitle}</span>
                <p className="salon-desc">{salon.description}</p>

                <div className="salon-infos">
                  <p className="info-item"><BsPeopleFill className="icon" /> <strong>Public :</strong> {salon.target}</p>
                  <p className="info-item"><BsGeoAltFill className="icon" /> {salon.address}</p>
                  <p className="info-item"><BsTelephoneFill className="icon" /> {salon.phone}</p>
                </div>

                {/* Le bouton pointe dynamiquement vers /salon/nom-du-salon */}
                <Link to={`/salon/${salon.id}`} className="salon-btn">Découvrir ce salon</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}