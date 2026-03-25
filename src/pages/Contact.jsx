// src/pages/Contact.jsx
import { salonsData } from '../api/salons';
import { BsGeoAltFill, BsTelephoneFill } from 'react-icons/bs';
import './Contact.css';

export default function Contact() {
  return (
    <div className="contact-container">
      <h1 className="contact-title">Contactez-nous</h1>
      <div className="contact-wrapper">
        
        <section className="contact-form-section">
          <h2>Envoyer un message</h2>
          <form className="contact-form">
            {/* ... autres champs ... */}
            <div className="form-group">
              <label htmlFor="subject">Salon concerné</label>
              <select id="subject">
                <option value="">Choisir un salon...</option>
                {/* Menu déroulant dynamique */}
                {salonsData.map(salon => (
                  <option key={salon.id} value={salon.id}>{salon.name}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="submit-btn">Envoyer</button>
          </form>
        </section>

        <section className="contact-info-section">
          <h2>Nos Salons</h2>
          {/* Liste des salons dynamique */}
          {salonsData.map(salon => (
            <div key={salon.id} className="salon-info-card">
              <h3>{salon.name}</h3>
              <p className="info-line"><BsGeoAltFill /> {salon.address}</p>
              <p className="info-line"><BsTelephoneFill /> <a href={`tel:${salon.phone}`}>{salon.phone}</a></p>
            </div>
          ))}
        </section>

      </div>
    </div>
  );
}