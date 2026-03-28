import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { salonsData } from '../api/salons';
import { prestationsData } from '../api/prestations';
import { BsCheckCircleFill } from 'react-icons/bs';
import './Reservation.css';
import { useDocumentTitle } from '../hooks/useDocumentTitle';


// Fausse équipe pour l'exemple (à mettre dans une API plus tard)
const mockEquipe = [
  { id: 'e1', nom: 'Sarah', role: 'Manager & Visagiste' },
  { id: 'e2', nom: 'Thomas', role: 'Barbier & Coupe Homme' },
  { id: 'e3', nom: 'Camille', role: 'Coloriste' },
  { id: 'e4', nom: 'Pas de préférence', role: 'Premier disponible' }
];

export default function Reservation() {
  // Récupération des données passées via le Link (depuis SalonDetail ou Prestations)
  const location = useLocation();
  const passedState = location.state || {};

  // 1. Stocker toutes les données de la réservation en pré-remplissant si possible
  const [formData, setFormData] = useState({
    salon: passedState.salonId || '',
    prestation: passedState.prestationNom || '',
    coiffeur: '',
    date: '',
    heure: '',
    nom: '',
    prenom: '',
    email: '',
    telephone: ''
  });

  // 2. Gérer l'étape actuelle intelligemment (de 1 à 6)
  const [step, setStep] = useState(() => {
    // Si on connait DÉJÀ le salon ET la prestation -> On saute direct à l'étape 3 (Le Coiffeur)
    if (passedState.salonId && passedState.prestationNom) return 3;
    // Si on ne connait QUE le salon -> On saute à l'étape 2 (La Prestation)
    if (passedState.salonId) return 2;
    // Sinon, on démarre normalement à l'étape 1
    return 1;
  });

  // Fonction pour mettre à jour les données
  const handleSelect = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // Fonctions pour naviguer entre les étapes
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  // Soumission finale
  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici, plus tard, on enverra les données à la vraie base de données (CCP2)
    console.log("Réservation envoyée :", formData);
    nextStep(); // Passe à l'étape 6 (Confirmation)
  };

  // Filtrer les prestations en fonction du salon choisi (soit à l'étape 1, soit via le state)
  const availablePrestations = prestationsData.filter(presta => presta.salons.includes(formData.salon));

  useDocumentTitle('Prendre RDV');

  return (
    <div className="reservation-container">
      <div className="reservation-header">
        <h1>Prendre Rendez-vous</h1>
        <p>Réservez votre moment de détente en quelques clics.</p>
      </div>

      {/* Barre de progression (masquée à l'étape finale) */}
      {step < 6 && (
        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${(step / 5) * 100}%` }}></div>
          </div>
          <p className="step-indicator">Étape {step} sur 5</p>
        </div>
      )}

      <div className="wizard-card">
        
        {/* --- ÉTAPE 1 : LE SALON --- */}
        {step === 1 && (
          <div className="step-content">
            <h2>1. Choisissez votre salon</h2>
            <div className="options-grid">
              {salonsData.map(salon => (
                <div 
                  key={salon.id} 
                  className={`option-card ${formData.salon === salon.id ? 'selected' : ''}`}
                  onClick={() => handleSelect('salon', salon.id)}
                >
                  <h3>{salon.name}</h3>
                  <p>{salon.address}</p>
                </div>
              ))}
            </div>
            <button className="btn-next" disabled={!formData.salon} onClick={nextStep}>Suivant</button>
          </div>
        )}

        {/* --- ÉTAPE 2 : LA PRESTATION --- */}
        {step === 2 && (
          <div className="step-content">
            <h2>2. Choisissez votre prestation</h2>
            <div className="options-grid list-view">
              {availablePrestations.map(presta => (
                <div 
                  key={presta.id} 
                  className={`option-card ${formData.prestation === presta.nom ? 'selected' : ''}`}
                  onClick={() => handleSelect('prestation', presta.nom)}
                >
                  <div className="presta-info">
                    <h3>{presta.nom}</h3>
                    <p>{presta.duree}</p>
                  </div>
                  <span className="presta-price">{presta.prix}</span>
                </div>
              ))}
            </div>
            <div className="wizard-actions">
              <button className="btn-prev" onClick={prevStep}>Retour</button>
              <button className="btn-next" disabled={!formData.prestation} onClick={nextStep}>Suivant</button>
            </div>
          </div>
        )}

        {/* --- ÉTAPE 3 : LE COIFFEUR --- */}
        {step === 3 && (
          <div className="step-content">
            <h2>3. Choisissez votre coiffeur</h2>
            <div className="options-grid">
              {mockEquipe.map(membre => (
                <div 
                  key={membre.id} 
                  className={`option-card ${formData.coiffeur === membre.nom ? 'selected' : ''}`}
                  onClick={() => handleSelect('coiffeur', membre.nom)}
                >
                  <h3>{membre.nom}</h3>
                  <p>{membre.role}</p>
                </div>
              ))}
            </div>
            <div className="wizard-actions">
              <button className="btn-prev" onClick={prevStep}>Retour</button>
              <button className="btn-next" disabled={!formData.coiffeur} onClick={nextStep}>Suivant</button>
            </div>
          </div>
        )}

        {/* --- ÉTAPE 4 : DATE ET HEURE --- */}
        {step === 4 && (
          <div className="step-content">
            <h2>4. Date et Heure</h2>
            <div className="datetime-container">
              <div className="form-group">
                <label>Date du rendez-vous</label>
                <input 
                  type="date" 
                  value={formData.date} 
                  onChange={(e) => handleSelect('date', e.target.value)} 
                  min={new Date().toISOString().split('T')[0]} 
                />
              </div>
              <div className="form-group">
                <label>Heure souhaitée</label>
                <select value={formData.heure} onChange={(e) => handleSelect('heure', e.target.value)}>
                  <option value="">Choisir un horaire...</option>
                  <option value="09:00">09:00</option>
                  <option value="10:00">10:00</option>
                  <option value="11:30">11:30</option>
                  <option value="14:00">14:00</option>
                  <option value="15:30">15:30</option>
                  <option value="17:00">17:00</option>
                </select>
              </div>
            </div>
            <div className="wizard-actions">
              <button className="btn-prev" onClick={prevStep}>Retour</button>
              <button className="btn-next" disabled={!formData.date || !formData.heure} onClick={nextStep}>Suivant</button>
            </div>
          </div>
        )}

        {/* --- ÉTAPE 5 : COORDONNÉES --- */}
        {step === 5 && (
          <div className="step-content">
            <h2>5. Vos coordonnées</h2>
            <form onSubmit={handleSubmit} className="details-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Prénom</label>
                  <input required type="text" value={formData.prenom} onChange={(e) => handleSelect('prenom', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Nom</label>
                  <input required type="text" value={formData.nom} onChange={(e) => handleSelect('nom', e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label>Email</label>
                <input required type="email" value={formData.email} onChange={(e) => handleSelect('email', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Téléphone</label>
                <input required type="tel" value={formData.telephone} onChange={(e) => handleSelect('telephone', e.target.value)} />
              </div>
              
              <div className="wizard-actions">
                <button type="button" className="btn-prev" onClick={prevStep}>Retour</button>
                <button type="submit" className="btn-submit">Confirmer le RDV</button>
              </div>
            </form>
          </div>
        )}

        {/* --- ÉTAPE 6 : CONFIRMATION --- */}
        {step === 6 && (
          <div className="step-content success-step">
            <BsCheckCircleFill className="success-icon" />
            <h2>Rendez-vous Confirmé !</h2>
            <p>Merci {formData.prenom}, votre rendez-vous est bien enregistré pour le <strong>{formData.date.split('-').reverse().join('/')} à {formData.heure}</strong>.</p>
            <p>Un email de confirmation vient de vous être envoyé à <em>{formData.email}</em>.</p>
            <button className="btn-next" onClick={() => window.location.href = '/'}>Retour à l'accueil</button>
          </div>
        )}

      </div>
    </div>
  );
}