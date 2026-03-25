import { Link } from 'react-router-dom';
import { BsCheckLg } from 'react-icons/bs';
import './Prestations.css';

const prestationsList = [
  { id: 1, nom: 'Coupe Enfant (-12 ans)', duree: '20 Minutes', salons: ['the-old-school','lessence-de-soi', 'latelier-mixte'], prix: '15 €' },
  { id: 2, nom: 'Coupe Homme + Shampoing', duree: '30 Minutes', salons: ['the-old-school', 'latelier-mixte'], prix: '25 €' },
  { id: 3, nom: 'Barbier', duree: '30 Minutes', salons: ['the-old-school'], prix: '22 €' },
  { id: 4, nom: 'Formule Coupe + Barbe', duree: '1 Heure', salons: ['the-old-school'], prix: '42 €' },
  { id: 5, nom: 'Shampoing + Coupe + Brushing Femme', duree: '1 Heure', salons: ['lessence-de-soi', 'latelier-mixte'], prix: '45 €' },
  { id: 6, nom: 'Brushing + Mise en pli', duree: '1 Heure', salons: ['lessence-de-soi', 'latelier-mixte'], prix: '35 €' },
  { id: 7, nom: 'Coloration', duree: '2 Heures', salons: ['lessence-de-soi', 'latelier-mixte'], prix: '85 €' }
];

export default function Prestations() {
  return (
    <div className="prestations-container">
      <h1 className="prestations-title">La Carte des Services</h1>
      <p className="prestations-subtitle">Découvrez l'ensemble des prestations proposées dans nos salons.</p>
      
      <div className="table-responsive-wrapper">
        <table className="prestations-table">
          <thead>
            <tr>
              <th className="th-left">PRESTATIONS</th>
              <th>DURÉE</th>
              <th>THE OLD SCHOOL<br/><span>(Homme)</span></th>
              <th>L'ESSENCE DE SOI<br/><span>(Femme)</span></th>
              <th>L'ATELIER MIXTE<br/><span>(Mixte)</span></th>
              <th>PRIX</th>
            </tr>
          </thead>
          <tbody>
            {prestationsList.map((item) => (
              <tr key={item.id}>
                <td className="presta-name">{item.nom}</td>
                <td className="presta-duree">{item.duree}</td>
                
              
                <td>{item.salons.includes('the-old-school') && <BsCheckLg className="check-icon" />}</td>
                <td>{item.salons.includes('lessence-de-soi') && <BsCheckLg className="check-icon" />}</td>
                <td>{item.salons.includes('latelier-mixte') && <BsCheckLg className="check-icon" />}</td>
                
                <td className="price-cell">
                  <div className="price-content">
                    <Link to="/reservation" className="reserver-btn">Réserver</Link>
                    <span className="price-tag">{item.prix}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}