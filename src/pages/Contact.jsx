import './Contact.css';
import { BsGeoAltFill, BsTelephoneFill } from 'react-icons/bs';

export default function Contact() {
  return (
    <div className="contact-container">
      <h1 className="contact-title">Contactez-nous</h1>
      <p className="contact-subtitle">Une question ? Une demande spécifique ? Notre équipe est à votre écoute.</p>

      <div className="contact-wrapper">
        
        {/* COLONNE GAUCHE : Formulaire Global */}
        <section className="contact-form-section">
          <h2>Envoyer un message</h2>
          <form className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Nom complet</label>
              <input type="text" id="name" placeholder="Votre nom et prénom" required />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Adresse Email</label>
              <input type="email" id="email" placeholder="votre@email.com" required />
            </div>
            
            <div className="form-group">
              <label htmlFor="subject">Objet de votre demande</label>
              <select id="subject">
                <option>Renseignement général</option>
                <option>Partenariat / Presse</option>
                <option>Recrutement</option>
                <option>Problème avec une réservation</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Votre message</label>
              <textarea id="message" rows="6" placeholder="Comment pouvons-nous vous aider ?" required></textarea>
            </div>
            
            <button type="submit" className="submit-btn">Envoyer le message</button>
          </form>
        </section>

        {/* COLONNE DROITE : Coordonnées des salons (Rennes) */}
        <section className="contact-info-section">
          <h2>Nos Salons</h2>
          
          <div className="salon-info-card">
            <h3>The Old School</h3>
            <p className="info-line">
              <BsGeoAltFill className="contact-icon" />
              <a href="https://maps.google.com/?q=12+Rue+de+la+Monnaie,+35000+Rennes" target="_blank" rel="noopener noreferrer">
                12 Rue de la Monnaie, 35000 Rennes
              </a>
            </p>
            <p className="info-line">
              <BsTelephoneFill className="contact-icon" />
              <a href="tel:+33299314567">02 99 31 45 67</a>
            </p>
          </div>
          
          <div className="salon-info-card">
            <h3>L'essence de soi</h3>
            <p className="info-line">
              <BsGeoAltFill className="contact-icon" />
              <a href="https://maps.google.com/?q=45+Mail+François+Mitterrand,+35000+Rennes" target="_blank" rel="noopener noreferrer">
                45 Mail François Mitterrand, 35000 Rennes
              </a>
            </p>
            <p className="info-line">
              <BsTelephoneFill className="contact-icon" />
              <a href="tel:+33299401289">02 99 40 12 89</a>
            </p>
          </div>
          
          <div className="salon-info-card">
            <h3>L'Atelier mixte</h3>
            <p className="info-line">
              <BsGeoAltFill className="contact-icon" />
              <a href="https://maps.google.com/?q=8+Rue+Saint-Georges,+35000+Rennes" target="_blank" rel="noopener noreferrer">
                8 Rue Saint-Georges, 35000 Rennes
              </a>
            </p>
            <p className="info-line">
              <BsTelephoneFill className="contact-icon" />
              <a href="tel:+33299653321">02 99 65 33 21</a>
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}