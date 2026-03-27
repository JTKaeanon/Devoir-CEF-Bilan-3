import { useState } from 'react';
import { salonsData } from '../api/salons';
import { BsGeoAltFill, BsTelephoneFill, BsCheckCircleFill } from 'react-icons/bs';
import './Contact.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
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
    
    // Réinitialisation après 4 secondes
    setTimeout(() => {
      setIsSent(false);
      setFormData({ prenom: '', nom: '', email: '', telephone: '', salon: '', message: '' });
    }, 4000);
  };

  return (
    <div className="contact-container">
      <h1 className="contact-title">Contactez-nous</h1>
      <div className="contact-wrapper">
        
        {/* SECTION GAUCHE : FORMULAIRE */}
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
                    <option key={salon.id} value={salon.id}>{salon.name}</option>
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

        {/* SECTION DROITE : INFOS SALONS */}
        <section className="contact-info-section">
          <h2>Nos Salons</h2>
          {salonsData.map(salon => (
            <div key={salon.id} className="salon-info-card">
              <h3>{salon.name}</h3>
              <p className="info-line">
                <BsGeoAltFill className="contact-icon" /> 
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(salon.address)}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  {salon.address}
                </a>
              </p>
              <p className="info-line">
                <BsTelephoneFill className="contact-icon" /> 
                <a href={`tel:${salon.phone}`}>{salon.phone}</a>
              </p>
            </div>
          ))}
        </section>

      </div>
    </div>
  );
}