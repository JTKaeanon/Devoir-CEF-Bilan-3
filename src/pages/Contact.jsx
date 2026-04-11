import { useState, useEffect } from "react";
import { BsGeoAltFill, BsTelephoneFill, BsCheckCircleFill } from "react-icons/bs";
import "./Contact.css";
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function Contact() {
  // pre remplis si connecté
  const utilisateurData = localStorage.getItem('utilisateur');
  const utilisateurConnecte = utilisateurData ? JSON.parse(utilisateurData) : null;

  const [salonsData, setSalonsData] = useState([]);

  // salons
  useEffect(() => {
    fetch('https://groupe-atelier-devoir-bilan.onrender.com/api/salons')
      .then(res => res.json())
      .then(data => setSalonsData(data))
      .catch(err => console.error("Erreur de chargement des salons :", err));
  }, []);

  const [formData, setFormData] = useState({
    prenom: utilisateurConnecte ? utilisateurConnecte.prenom : '',
    nom: utilisateurConnecte ? utilisateurConnecte.nom : '',
    email: utilisateurConnecte ? utilisateurConnecte.email : '',
    telephone: utilisateurConnecte && utilisateurConnecte.telephone ? utilisateurConnecte.telephone : '',
    salon: '',
    message: ''
  });

  const [isSent, setIsSent] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Message envoyé :", formData);
    setIsSent(true);
    
    //reset
    setTimeout(() => {
      setIsSent(false);
      setFormData({ 
        prenom: utilisateurConnecte ? utilisateurConnecte.prenom : '', 
        nom: utilisateurConnecte ? utilisateurConnecte.nom : '', 
        email: utilisateurConnecte ? utilisateurConnecte.email : '', 
        telephone: utilisateurConnecte && utilisateurConnecte.telephone ? utilisateurConnecte.telephone : '', 
        salon: '', 
        message: '' 
      });
    }, 4000);
  };

  useDocumentTitle('Contact');

  return (
    <div className="contact-container">
      <h1 className="contact-title">Contactez-nous</h1>
      <div className="contact-wrapper">
        
        {/* formulaire */}
        <section className="contact-form-section">
          <h2>Envoyer un message</h2>
          {isSent ? (
            <div className="success-message">
              <BsCheckCircleFill className="success-icon" />
              <h3>Message bien reçu !</h3>
              <p>Merci {formData.prenom}, nous vous répondrons très bientôt.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Prénom</label>
                  <input type="text" name="prenom" required value={formData.prenom} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Nom</label>
                  <input type="text" name="nom" required value={formData.nom} onChange={handleChange} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Téléphone</label>
                  <input type="tel" name="telephone" value={formData.telephone} onChange={handleChange} />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="salon">Salon concerné</label>
                <select name="salon" id="salon" required value={formData.salon} onChange={handleChange}>
                  <option value="">Choisir un salon...</option>
                  {salonsData.map(salon => (
                    <option key={salon.id} value={salon.id}>{salon.nom}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Votre message</label>
                <textarea name="message" rows="5" required value={formData.message} onChange={handleChange}></textarea>
              </div>

              <button type="submit" className="submit-btn">Envoyer</button>
            </form>
          )}
        </section>

        {/* infos salons */}
        <section className="contact-info-section">
          <h2>Nos Salons</h2>
          {salonsData.map(salon => (
            <div key={salon.id} className="salon-info-card">
              {/* On utilise les champs en français de la BDD */}
              <h3>{salon.nom}</h3>
              <p className="info-line">
                <BsGeoAltFill className="contact-icon" /> 
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(salon.adresse)}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  {salon.adresse}
                </a>
              </p>
              <p className="info-line">
                <BsTelephoneFill className="contact-icon" /> 
                <a href={`tel:${salon.telephone}`}>{salon.telephone}</a>
              </p>
            </div>
          ))}
        </section>

      </div>
    </div>
  );
}