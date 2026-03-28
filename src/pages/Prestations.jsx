import { Link } from 'react-router-dom';
import { BsCheckLg } from 'react-icons/bs';
import './Prestations.css';
import { prestationsData } from '../api/prestations';
import { useDocumentTitle } from '../hooks/useDocumentTitle';


export default function Prestations() {
  useDocumentTitle('Nos prestations');
  
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
              <th>THE OLD SCHOOL<br /><span>(Homme)</span></th>
              <th>L'ESSENCE DE SOI<br /><span>(Femme)</span></th>
              <th>L'ATELIER MIXTE<br /><span>(Mixte)</span></th>
              <th>PRIX</th>
            </tr>
          </thead>
          <tbody>
            {prestationsData.map((item) => (
              <tr key={item.id}>
                <td className="presta-name">{item.nom}</td>
                <td className="presta-duree">{item.duree}</td>


                <td>{item.salons.includes('the-old-school') && <BsCheckLg className="check-icon" />}</td>
                <td>{item.salons.includes('lessence-de-soi') && <BsCheckLg className="check-icon" />}</td>
                <td>{item.salons.includes('latelier-mixte') && <BsCheckLg className="check-icon" />}</td>

                <td className="price-cell">
                  <div className="price-content">
                    <Link
                      to="/reservation"
                      state={{
                        prestationNom: item.nom,
                        // Si la prestation n'est dispo que dans 1 salon, on l'envoie direct !
                        salonId: item.salons.length === 1 ? item.salons[0] : null
                      }}
                      className="reserver-btn"
                    >
                      Réserver
                    </Link>
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