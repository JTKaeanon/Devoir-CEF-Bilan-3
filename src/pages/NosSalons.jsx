import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// Ajout de BsPeopleFill pour le public ciblé
import { BsGeoAltFill, BsTelephoneFill, BsPeopleFill } from 'react-icons/bs';
import './NosSalons.css';

import imgSalon1 from '../assets/salon1.jpg';
import imgSalon2 from '../assets/salon2.jpg';
import imgSalon3 from '../assets/salon3.jpg';

const mockApiResponse = [
  {
    id: 'the-old-school',
    name: 'The Old School',
    subtitle: "L'alliance sacrée de l'héritage et de l'audace",
    target: 'Homme et enfant masculin (12 ans +)', // Nouvelle donnée
    address: '12 Rue de la Monnaie, 35000 Rennes',
    phone: '02 99 31 45 67',
    image: imgSalon1,
    description: "Un espace dédié à l'élégance intemporelle au cœur du centre historique de Rennes. Ici, la tradition rencontre les tendances les plus pointues."
  },
  {
    id: 'lessence-de-soi',
    name: "L'essence de soi",
    subtitle: "Une parenthèse de clarté pour magnifier votre éclat naturel",
    target: 'Femme et enfant (12 ans et -)', // Nouvelle donnée
    address: '45 Mail François Mitterrand, 35000 Rennes',
    phone: '02 99 40 12 89',
    image: imgSalon2,
    description: "Baigné de lumière naturelle, ce salon offre une pause sensorielle sur le prestigieux Mail, pour une transformation tout en douceur."
  },
  {
    id: 'latelier-mixte',
    name: "L'Atelier mixte",
    subtitle: "L'éveil des sens au cœur d'un refuge végétal",
    target: 'Mixte - Tout le monde', // Nouvelle donnée
    address: '8 Rue Saint-Georges, 35000 Rennes',
    phone: '02 99 65 33 21',
    image: imgSalon3,
    description: "Une ambiance organique et apaisante dans l'une des rues les plus charmantes de la ville. Le rendez-vous de la pureté et du style."
  }
];

export default function NosSalons() {
  const [salons, setSalons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSalons(mockApiResponse);
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

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
                  {/* Nouvelle ligne pour le public ciblé */}
                  <p className="info-item"><BsPeopleFill className="icon"/> <strong>Public :</strong> {salon.target}</p>
                  <p className="info-item"><BsGeoAltFill className="icon"/> {salon.address}</p>
                  <p className="info-item"><BsTelephoneFill className="icon"/> {salon.phone}</p>
                </div>

                <Link to={`/salon/${salon.id}`} className="salon-btn">Découvrir ce salon</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}