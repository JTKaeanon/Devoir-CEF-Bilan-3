import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import './Erreur.css';

export default function Erreur() {
  useDocumentTitle('Page introuvable | L\'Atelier');

  return (
    <div className="erreur-container">
      <h1 className="erreur-title">404</h1>
      <h2 className="erreur-subtitle">Oups ! Page introuvable</h2>
      <p className="erreur-text">
        Il semblerait que vous vous soyez égaré. La page que vous cherchez n'existe pas ou a été déplacée.
      </p>
      <Link to="/" className="erreur-btn">
        Retour à l'accueil
      </Link>
    </div>
  );
}