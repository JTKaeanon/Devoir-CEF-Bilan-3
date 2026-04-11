import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import './Compte.css';

export default function Compte() {
  useDocumentTitle('Connexion | Groupe l\'Atelier');

  const [formData, setFormData] = useState({
    email: '',
    mot_de_passe: ''
  });

  const [message, setMessage] = useState({ type: '', texte: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', texte: '' });

    try {
      const reponse = await fetch('https://groupe-atelier-devoir-bilan.onrender.com/api/connexion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await reponse.json();

      if (!reponse.ok) {
        throw new Error(data.erreur || "Erreur lors de la connexion.");
      }

      // save user dans nav
      localStorage.setItem('utilisateur', JSON.stringify(data.utilisateur));

      // reload navbar
      window.location.href = '/'; 

    } catch (erreur) {
      setMessage({ type: 'error', texte: erreur.message });
    }
  };

  return (
    <div className="compte-container">
      
      <div className="compte-header">
        <h1 className="compte-title">Connexion</h1>
        <p className="compte-subtitle">Accédez à votre espace client l'Atelier.</p>
      </div>

      <div className="compte-form-box">
        {message.texte && (
          <div className={`message-box ${message.type === 'error' ? 'message-error' : 'message-success'}`}>
            {message.texte}
          </div>
        )}

        <form onSubmit={handleSubmit} className="compte-form">
          <div className="form-group">
            <label htmlFor="email">Adresse Email</label>
            <input type="email" id="email" name="email" required onChange={handleChange} />
          </div>

          <div className="form-group">
            <label htmlFor="mot_de_passe">Mot de passe</label>
            <input type="password" id="mot_de_passe" name="mot_de_passe" required onChange={handleChange} />
          </div>

          <button type="submit" className="compte-submit-btn">Se connecter</button>
        </form>

        <div className="compte-footer">
          <p>Nouveau client ? <Link to="/inscription">Créer un compte</Link></p>
        </div>
      </div>

    </div>
  );
}