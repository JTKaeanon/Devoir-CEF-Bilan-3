import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './SalonDetail.css';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function SalonDetail() {
  const { slug } = useParams();
  const [salon, setSalon] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useDocumentTitle(salon ? salon.nom : 'Détail du salon');

  useEffect(() => {
    const fetchSalonDetail = async () => {
      try {
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

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <h2>Chargement des informations du salon...</h2>
      </div>
    );
  }

  if (!salon) {
    return (
      <div className="salon-not-found">
        <h2>Oups ! Ce salon n'existe pas.</h2>
        <Link to="/nos-salons" className="retour-btn">Retour aux salons</Link>
      </div>
    );
  }

  return (
    <div className="salon-detail-container">
      <div className="salon-detail-grid">

        {/* top left */}
        <div
          className="grid-box box-image"
          style={{ backgroundImage: salon.image ? `url(${salon.image})` : 'none' }}
        ></div>

        {/* top right */}
        <div
          className="grid-box box-presentation"
          style={{ backgroundImage: salon.presentationImage ? `url(${salon.presentationImage})` : 'none' }}
        >
          <div className="presentation-content">
            <h1>{salon.nom}</h1>
            <h2>{salon.subtitle || "Bienvenue dans notre salon"}</h2>
            <p>Présentation</p>
          </div>
        </div>

        {/* bottom left */}
        <div className="grid-box box-team">
          <h3>Nos coiffeurs</h3>
          <div className="team-list">
            {salon.employes && salon.employes.length > 0 ? salon.employes.map(membre => (
              
              <div key={membre.id} className="team-member-card">
                <p className="team-member-name">{membre.nom} - {membre.role}</p>
                
                {membre.horaires && membre.horaires.length > 0 ? (
                  <ul className="team-schedule-list">
                    {membre.horaires.map(horaire => (
                      <li key={horaire.id} className="team-schedule-item">
                        {/* Séparation du jour et de l'heure pour l'alignement */}
                        <span className="team-schedule-day">{horaire.jour}</span>
                        <span className="team-schedule-hours">{horaire.heure_debut} - {horaire.heure_fin}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="team-schedule-empty">Horaires non définis</p>
                )}
              </div>

            )) : <p style={{textAlign: 'center', width: '100%'}}>Équipe en cours de recrutement</p>}
          </div>
        </div>

        {/* bottom right */}
        <div className="grid-box box-services">
          <h3>Carte des services - {salon.nom}</h3>
          <div className="services-list">
            {salon.prestations && salon.prestations.length > 0 ? salon.prestations.map(presta => (
              <div key={presta.id} className="service-card">
                
                <div className="service-info">
                  <p className="service-info-name">
                    {presta.nom}
                  </p>
                  <p className="service-info-duration">
                    <i className="bi bi-clock service-icon-clock"></i>
                    {formatDuree(presta.duree)}
                  </p>
                </div>

                <div className="service-action">
                  <p className="service-price">
                    {presta.prix} €
                  </p>
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