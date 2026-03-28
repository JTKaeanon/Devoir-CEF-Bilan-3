import { useState } from 'react';
import './Compte.css';

export default function Compte() {
  // Ce state permet de basculer entre le formulaire de connexion et d'inscription
  const [isLogin, setIsLogin] = useState(true);

  // States pour les champs du formulaire
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      console.log("Tentative de connexion avec :", formData.email);
      // Plus tard (CCP2) : Appel API pour vérifier le mot de passe
    } else {
      console.log("Tentative de création de compte pour :", formData.email);
      // Plus tard (CCP2) : Appel API pour créer l'utilisateur
    }
  };

  return (
    <div className="compte-container">
      <div className="compte-box">
        
        {/* Les boutons pour basculer entre Connexion et Inscription */}
        <div className="compte-tabs">
          <button 
            className={`tab-btn ${isLogin ? 'active' : ''}`} 
            onClick={() => setIsLogin(true)}
          >
            Se connecter
          </button>
          <button 
            className={`tab-btn ${!isLogin ? 'active' : ''}`} 
            onClick={() => setIsLogin(false)}
          >
            S'inscrire
          </button>
        </div>

        <div className="compte-header">
          <h1>{isLogin ? 'Ravi de vous revoir !' : 'Rejoignez-nous'}</h1>
          <p>{isLogin ? 'Connectez-vous pour gérer vos rendez-vous.' : 'Créez un compte pour faciliter vos prochaines réservations.'}</p>
        </div>

        <form onSubmit={handleSubmit} className="compte-form">
          
          {/* Champs visibles UNIQUEMENT pour l'inscription */}
          {!isLogin && (
            <div className="form-row">
              <div className="form-group">
                <label>Prénom</label>
                <input type="text" name="prenom" required={!isLogin} value={formData.prenom} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Nom</label>
                <input type="text" name="nom" required={!isLogin} value={formData.nom} onChange={handleChange} />
              </div>
            </div>
          )}

          {/* Champs communs (Connexion et Inscription) */}
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" required value={formData.email} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Mot de passe</label>
            <input type="password" name="password" required value={formData.password} onChange={handleChange} />
          </div>

          {/* Champ visible UNIQUEMENT pour l'inscription */}
          {!isLogin && (
            <div className="form-group">
              <label>Confirmer le mot de passe</label>
              <input type="password" name="confirmPassword" required={!isLogin} value={formData.confirmPassword} onChange={handleChange} />
            </div>
          )}

          {isLogin && (
            <div className="forgot-password">
              <a href="#!">Mot de passe oublié ?</a>
            </div>
          )}

          <button type="submit" className="btn-submit-compte">
            {isLogin ? 'Me connecter' : 'Créer mon compte'}
          </button>
        </form>

      </div>
    </div>
  );
}