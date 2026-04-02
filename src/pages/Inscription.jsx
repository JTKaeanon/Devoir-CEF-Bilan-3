import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import './Inscription.css';

export default function Inscription() {
  useDocumentTitle('Créer un compte | Groupe l\'Atelier');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    mot_de_passe: '',
    telephone: ''
  });

  const [message, setMessage] = useState({ type: '', texte: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', texte: '' });

    try {
      const reponse = await fetch('http://localhost:3000/api/inscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await reponse.json();

      if (!reponse.ok) {
        throw new Error(data.erreur || "Une erreur est survenue.");
      }

      // 🚀 REDIRECTION IMMÉDIATE VERS LA PAGE DE CONNEXION
      navigate('/compte'); 

    } catch (erreur) {
      setMessage({ type: 'error', texte: erreur.message });
    }
  };

  return (
    <div className="inscription-container">
      
      <div className="inscription-header">
        <h1 className="inscription-title">Créer un compte</h1>
        <p className="inscription-subtitle">Rejoignez le Groupe l'Atelier pour gérer vos réservations.</p>
      </div>

      <div className="inscription-form-box">
        {message.texte && (
          <div className={`message-box ${message.type === 'error' ? 'message-error' : 'message-success'}`}>
            {message.texte}
          </div>
        )}

        <form onSubmit={handleSubmit} className="inscription-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="prenom">Prénom *</label>
              <input type="text" id="prenom" name="prenom" required onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="nom">Nom *</label>
              <input type="text" id="nom" name="nom" required onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Adresse Email *</label>
            <input type="email" id="email" name="email" required onChange={handleChange} />
          </div>

          <div className="form-group">
            <label htmlFor="telephone">Téléphone</label>
            <input type="tel" id="telephone" name="telephone" onChange={handleChange} />
          </div>

          <div className="form-group">
            <label htmlFor="mot_de_passe">Mot de passe *</label>
            <input type="password" id="mot_de_passe" name="mot_de_passe" required onChange={handleChange} />
          </div>

          <button type="submit" className="inscription-submit-btn">S'inscrire</button>
        </form>

        <div className="inscription-footer">
          <p>Vous avez déjà un compte ? <Link to="/compte">Connectez-vous</Link></p>
        </div>
      </div>
    </div>
  );
}