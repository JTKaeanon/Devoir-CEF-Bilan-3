import { useParams, Link } from 'react-router-dom';
import { salonsData } from '../api/salons';
import './SalonDetail.css';
import { prestationsData } from '../api/prestations';

export default function SalonDetail() {
  const { id } = useParams();
  const salon = salonsData.find((s) => s.id === id);
  const salonPrestations = prestationsData.filter(presta => presta.salons.includes(id));

  if (!salon) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <h2>Oups ! Ce salon n'existe pas.</h2>
        <Link to="/nos-salons">Retour aux salons</Link>
      </div>
    );
  }

  return (
    <div className="salon-detail-container">
      <div className="salon-detail-grid">

        {/*top left */}
        <div
          className="grid-box box-image"
          style={{ backgroundImage: `url(${salon.image})` }}
        ></div>

        {/* top right */}
        <div
          className="grid-box box-presentation"
          style={{ backgroundImage: `url(${salon.presentationImage || salon.image})` }}
        >
          <div className="presentation-content">
            <h1>{salon.name}</h1>
            <h2>{salon.subtitle}</h2>
            <p>Présentation</p>
          </div>
        </div>

        {/* bottom left */}
        <div className="grid-box box-team">
          <h3>Nos coiffeurs :</h3>
          <div className="team-list">
            {salon.equipe ? salon.equipe.map(membre => (
              <div key={membre.id} className="team-member">
                {membre.nom}
              </div>
            )) : <p>Équipe à venir</p>}
          </div>
        </div>

        {/* bottom right */}
        <div className="grid-box box-services">
          <h3>Carte des services - {salon.name}</h3>
          <div className="services-list">
            {salonPrestations.length > 0 ? salonPrestations.map(presta => (
              
              <div key={presta.id} className="service-card">
                <div className="service-info">
                  <p className="service-info-name">{presta.nom}</p>
                  <p className="service-info-duration">{presta.duree}</p>
                </div>
                
                <div className="service-action">
                  <p className="service-price">{presta.prix}</p>
                  <Link to="/reservation" className="service-reserver-btn">Réserver</Link>
                </div>
              </div>

            )) : <p>Aucun service disponible pour le moment.</p>}
          </div>
        </div>

      </div>
    </div>
  );
}