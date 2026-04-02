import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BsGeoAltFill, BsTelephoneFill, BsPeopleFill } from 'react-icons/bs';
import './NosSalons.css';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function NosSalons() {
  const [salons, setSalons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSalons = async () => {
      try {
        const reponse = await fetch('http://localhost:3000/api/salons');
        
        if (!reponse.ok) {
          throw new Error(`Erreur HTTP: ${reponse.status}`);
        }
        
        const data = await reponse.json();
        setSalons(data); 
      } catch (erreur) {
        console.error("Impossible de récupérer les salons :", erreur);
      } finally {
        setIsLoading(false); 
      }
    };

    fetchSalons();
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
              
              {/* image ou couleur */}
              <div 
                className="salon-list-image" 
                style={{ backgroundColor: '#e9ecef', backgroundImage: salon.image ? `url(${salon.image})` : 'none' }}
              ></div>
              
              <div className="salon-list-content">
                {/* colonne ! */}
                <h2>{salon.nom}</h2>
                
                {salon.subtitle && <span className="salon-badge">{salon.subtitle}</span>}
                {salon.description && <p className="salon-desc">{salon.description}</p>}

                <div className="salon-infos">
                  {salon.target && (
                    <p className="info-item"><BsPeopleFill className="icon" /> <strong>Public :</strong> {salon.target}</p>
                  )}
                  <p className="info-item"><BsGeoAltFill className="icon" /> {salon.adresse}</p>
                  <p className="info-item"><BsTelephoneFill className="icon" /> {salon.telephone}</p>
                </div>

                <Link to={`/salon/${salon.slug}`} className="salon-btn">Découvrir ce salon</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}