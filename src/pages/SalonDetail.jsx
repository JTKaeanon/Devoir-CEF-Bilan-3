import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './SalonDetail.css';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function SalonDetail() {
  const { slug } = useParams(); // Récupère l'ID dans l'URL (ex: /salon/1)
  const [salon, setSalon] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Met à jour le titre de l'onglet du navigateur
  useDocumentTitle(salon ? salon.nom : 'Détail du salon');

  useEffect(() => {
    const fetchSalonDetail = async () => {
      try {
        // On interroge notre nouvelle route backend avec l'ID
        const reponse = await fetch(`http://localhost:3000/api/salons/${slug}`);
        
        if (!reponse.ok) {
          throw new Error('Salon introuvable');
        }
        
        const data = await reponse.json();
        setSalon(data);
      } catch (erreur) {
        console.error("Erreur :", erreur);
        setSalon(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSalonDetail();
  }, [slug]);

  // 1. Affichage pendant le chargement
  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <h2>Chargement des informations du salon...</h2>
      </div>
    );
  }

  // 2. Affichage si le salon n'existe pas
  if (!salon) {
    return (
      <div className="salon-not-found">
        <h2>Oups ! Ce salon n'existe pas.</h2>
        <Link to="/nos-salons" className="retour-btn">Retour aux salons</Link>
      </div>
    );
  }

  // 3. Affichage normal du salon
  return (
    <div className="salon-detail-container">
      <div className="salon-detail-grid">

        {/* top left */}
        <div
          className="grid-box box-image"
          style={{ backgroundColor: '#e9ecef', backgroundImage: salon.image ? `url(${salon.image})` : 'none' }}
        ></div>

        {/* top right */}
        <div
          className="grid-box box-presentation"
          style={{ backgroundColor: '#2c3e50', backgroundImage: salon.presentationImage ? `url(${salon.presentationImage})` : 'none' }}
        >
          <div className="presentation-content">
            {/* Attention à bien utiliser salon.nom (et non salon.name) */}
            <h1>{salon.nom}</h1>
            <h2>{salon.subtitle || "Bienvenue dans notre salon"}</h2>
            <p>Présentation</p>
          </div>
        </div>

        {/* bottom left */}
        <div className="grid-box box-team">
          <h3>Nos coiffeurs :</h3>
          <div className="team-list">
            {salon.equipe && salon.equipe.length > 0 ? salon.equipe.map(membre => (
              <div key={membre.id} className="team-member">
                {membre.nom}
              </div>
            )) : <p>Équipe en cours de recrutement</p>}
          </div>
        </div>

        {/* bottom right */}
        <div className="grid-box box-services">
          <h3>Carte des services - {salon.nom}</h3>
          <div className="services-list">
            {salon.prestations && salon.prestations.length > 0 ? salon.prestations.map(presta => (
              <div key={presta.id} className="service-card">
                <div className="service-info">
                  <p className="service-info-name">{presta.nom}</p>
                  <p className="service-info-duration">{presta.duree}</p>
                </div>
                <div className="service-action">
                  <p className="service-price">{presta.prix}</p>
                  <Link
                    to="/reservation"
                    state={{ salonId: salon.id, prestationNom: presta.nom }}
                    className="service-reserver-btn"
                  >
                    Réserver
                  </Link>
                </div>
              </div>
            )) : <p>Aucun service disponible pour le moment.</p>}
          </div>
        </div>

      </div>
    </div>
  );
}