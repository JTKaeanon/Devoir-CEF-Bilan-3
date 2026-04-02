import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BsCheckLg } from 'react-icons/bs';
import './Prestations.css';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function Prestations() {
  const [prestations, setPrestations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useDocumentTitle('Nos prestations');

  useEffect(() => {
    const fetchPrestations = async () => {
      try {
        const reponse = await fetch('http://localhost:3000/api/prestations');
        if (!reponse.ok) throw new Error('Erreur de chargement');
        const data = await reponse.json();
        setPrestations(data);
      } catch (erreur) {
        console.error("Erreur :", erreur);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPrestations();
  }, []);

  // minutes ou heures
  const formatDuree = (minutes) => {
    if (minutes < 60) return `${minutes} min`;
    if (minutes === 60) return `1 Heure`;
    
    const heures = Math.floor(minutes / 60);
    const resteMinutes = minutes % 60;
    
    if (resteMinutes === 0) {
      return `${heures} Heures`;
    } else {
      return `${heures}h${resteMinutes}`; // Ex: 1h30
    }
  };

  return (
    <div className="prestations-container">
      <h1 className="prestations-title">La Carte des Services</h1>
      <p className="prestations-subtitle">Découvrez l'ensemble des prestations proposées dans nos salons.</p>

      {isLoading ? (
        <p style={{textAlign: 'center', marginTop: '50px'}}>Chargement de la carte des services...</p>
      ) : (
        <div className="table-responsive-wrapper">
          <table className="prestations-table">
            <thead>
              <tr>
                <th className="th-left">PRESTATIONS</th>
                <th>DURÉE</th>
                <th>THE OLD SCHOOL<br /><span>(Homme)</span></th>
                <th>L'ESSENCE DE SOI<br /><span>(Femme)</span></th>
                <th>L'ATELIER MIXTE<br /><span>(Mixte)</span></th>
                <th>PRIX</th>
              </tr>
            </thead>
            <tbody>
              {prestations.map((item) => (
                <tr key={item.id}>
                  <td className="presta-name">{item.nom}</td>
                  
                  {/* 🌟 NOUVEAU : On utilise notre fonction ici ! */}
                  <td className="presta-duree">{formatDuree(item.duree)}</td>

                  <td>{item.salons && item.salons.some(s => s.slug === 'the-old-school') && <BsCheckLg className="check-icon" />}</td>
                  <td>{item.salons && item.salons.some(s => s.slug === 'lessence-de-soi') && <BsCheckLg className="check-icon" />}</td>
                  <td>{item.salons && item.salons.some(s => s.slug === 'latelier-mixte') && <BsCheckLg className="check-icon" />}</td>

                  <td className="price-cell">
                    <div className="price-content">
                      <Link
                        to="/reservation"
                        state={{
                          prestationNom: item.nom,
                          salonId: item.salons && item.salons.length === 1 ? item.salons[0].id : null
                        }}
                        className="reserver-btn"
                      >
                        Réserver
                      </Link>
                      <span className="price-tag">{item.prix} €</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}