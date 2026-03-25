import { useParams, Link } from 'react-router-dom';
import { salonsData } from '../api/salons';
import './SalonDetail.css';

export default function SalonDetail() {
  const { id } = useParams();
  const salon = salonsData.find((s) => s.id === id);

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
            {salon.prestations ? salon.prestations.map(presta => (
              <div key={presta.id} className="service-item">
                <p>{presta.nom}</p>
                <p>Durée : {presta.duree}</p>
                <p>Prix : {presta.prix}</p>
              </div>
            )) : <p>Carte des services à venir</p>}
          </div>
        </div>

      </div>
    </div>
  );
}