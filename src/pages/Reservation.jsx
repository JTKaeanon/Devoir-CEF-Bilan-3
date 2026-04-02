import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { BsCheckCircleFill } from 'react-icons/bs';
import './Reservation.css';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function Reservation() {
  const location = useLocation();
  const passedState = location.state || {};

  const utilisateurData = localStorage.getItem('utilisateur');
  const utilisateurConnecte = utilisateurData ? JSON.parse(utilisateurData) : null;

  const [salons, setSalons] = useState([]);
  const [prestations, setPrestations] = useState([]);
  const [employesDuSalon, setEmployesDuSalon] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [pourUnProche, setPourUnProche] = useState(false);

  const [formData, setFormData] = useState({
    salonId: passedState.salonId || '',
    prestationId: passedState.prestationId || '',
    employeId: '',
    date: '',
    heure: '',
    nom: utilisateurConnecte ? utilisateurConnecte.nom : '',
    prenom: utilisateurConnecte ? utilisateurConnecte.prenom : '',
    email: utilisateurConnecte ? utilisateurConnecte.email : '',
    telephone: utilisateurConnecte && utilisateurConnecte.telephone ? utilisateurConnecte.telephone : ''
  });

  const [step, setStep] = useState(() => {
    if (passedState.salonId && passedState.prestationNom) return 3;
    if (passedState.salonId) return 2;
    return 1;
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [resSalons, resPrestas] = await Promise.all([
          fetch('http://localhost:3000/api/salons'),
          fetch('http://localhost:3000/api/prestations')
        ]);
        const salonsData = await resSalons.json();
        const prestasData = await resPrestas.json();
        
        setSalons(salonsData);
        setPrestations(prestasData);
        
        if (passedState.prestationNom) {
          const laPresta = prestasData.find(p => p.nom === passedState.prestationNom);
          if (laPresta) {
            setFormData(prev => ({ ...prev, prestationId: laPresta.id }));
          }
        }
        
        if (passedState.salonId) {
          const leSalon = salonsData.find(s => s.id === passedState.salonId);
          if (leSalon) {
            const resDetail = await fetch(`http://localhost:3000/api/salons/${leSalon.slug}`);
            const salonDetail = await resDetail.json();
            setEmployesDuSalon(salonDetail.employes || []);
          }
        }
      } catch (error) {
        console.error("Erreur de chargement :", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, [passedState.salonId, passedState.prestationNom]);

  const handleSalonSelect = async (salonId) => {
    setFormData({ ...formData, salonId: salonId, employeId: '' }); 
    
    const leSalon = salons.find(s => s.id === salonId);
    if (leSalon) {
      try {
        const res = await fetch(`http://localhost:3000/api/salons/${leSalon.slug}`);
        const data = await res.json();
        setEmployesDuSalon(data.employes || []);
      } catch (error) {
        console.error("Erreur récupération employés:", error);
      }
    }
  };

  const handleSelect = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    setPourUnProche(isChecked);

    if (isChecked) {
      setFormData({ ...formData, nom: '', prenom: '' });
    } else {
      setFormData({ 
        ...formData, 
        nom: utilisateurConnecte ? utilisateurConnecte.nom : '', 
        prenom: utilisateurConnecte ? utilisateurConnecte.prenom : '' 
      });
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const reponse = await fetch('http://localhost:3000/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          utilisateurId: utilisateurConnecte ? utilisateurConnecte.id : null 
        })
      });

      if (!reponse.ok) throw new Error("Erreur lors de la réservation");

      nextStep();
    } catch (error) {
      alert("Une erreur est survenue. Le serveur n'est pas encore prêt !");
      console.error(error);
    }
  };

  useDocumentTitle('Prendre RDV');

  const availablePrestations = prestations.filter(presta => 
    presta.salons && presta.salons.some(s => s.id === formData.salonId)
  );

  if (isLoading) return <div className="reservation-loading">Chargement de la réservation...</div>;

  return (
    <div className="reservation-container">
      <div className="reservation-header">
        <h1>Prendre Rendez-vous</h1>
        <p>Réservez votre moment de détente en quelques clics.</p>
      </div>

      {step < 6 && (
        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${(step / 5) * 100}%` }}></div>
          </div>
          <p className="step-indicator">Étape {step} sur 5</p>
        </div>
      )}

      <div className="wizard-card">
        
        {/* salon */}
        {step === 1 && (
          <div className="step-content">
            <h2>1. Choisissez votre salon</h2>
            <div className="options-grid">
              {salons.map(salon => (
                <div 
                  key={salon.id} 
                  className={`option-card ${formData.salonId === salon.id ? 'selected' : ''}`}
                  onClick={() => handleSalonSelect(salon.id)}
                >
                  <h3>{salon.nom}</h3>
                  <p>{salon.adresse}</p>
                </div>
              ))}
            </div>
            <button className="btn-next" disabled={!formData.salonId} onClick={nextStep}>Suivant</button>
          </div>
        )}

        {/* prestation */}
        {step === 2 && (
          <div className="step-content">
            <h2>2. Choisissez votre prestation</h2>
            <div className="options-grid list-view">
              {availablePrestations.map(presta => (
                <div 
                  key={presta.id} 
                  className={`option-card ${formData.prestationId === presta.id ? 'selected' : ''}`}
                  onClick={() => handleSelect('prestationId', presta.id)}
                >
                  <div className="presta-info">
                    <h3>{presta.nom}</h3>
                    <p>{presta.duree} min</p>
                  </div>
                  <span className="presta-price">{presta.prix} €</span>
                </div>
              ))}
              {availablePrestations.length === 0 && <p>Aucune prestation disponible pour ce salon.</p>}
            </div>
            <div className="wizard-actions">
              <button className="btn-prev" onClick={prevStep}>Retour</button>
              <button className="btn-next" disabled={!formData.prestationId} onClick={nextStep}>Suivant</button>
            </div>
          </div>
        )}

        {/* coiffeur */}
        {step === 3 && (
          <div className="step-content">
            <h2>3. Choisissez votre coiffeur</h2>
            <div className="options-grid">
              {employesDuSalon.map(membre => (
                <div 
                  key={membre.id} 
                  className={`option-card ${formData.employeId === membre.id ? 'selected' : ''}`}
                  onClick={() => handleSelect('employeId', membre.id)}
                >
                  <h3>{membre.nom}</h3>
                  <p>{membre.role}</p>
                </div>
              ))}
              {employesDuSalon.length === 0 && <p>L'équipe est en cours de recrutement.</p>}
            </div>
            <div className="wizard-actions">
              <button className="btn-prev" onClick={prevStep}>Retour</button>
              <button className="btn-next" disabled={!formData.employeId} onClick={nextStep}>Suivant</button>
            </div>
          </div>
        )}

        {/* date heure */}
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

        {/* coordonnées */}
        {step === 5 && (
          <div className="step-content">
            <h2>5. Vos coordonnées</h2>
            
            {/* 🌟 NOUVEAU : Classes CSS au lieu de styles en ligne */}
            {utilisateurConnecte && !pourUnProche && (
              <div className="notice-success">
                <i className="bi bi-person-check-fill"></i> Bonjour {utilisateurConnecte.prenom}, vos informations ont été pré-remplies !
              </div>
            )}

            {utilisateurConnecte && (
              <div className="checkbox-wrapper">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    className="checkbox-input"
                    checked={pourUnProche} 
                    onChange={handleCheckboxChange} 
                  />
                  Je prends rendez-vous pour une autre personne (enfant, conjoint...)
                </label>
              </div>
            )}

            <form onSubmit={handleSubmit} className="details-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Prénom {pourUnProche && "de la personne"}</label>
                  <input required type="text" value={formData.prenom} onChange={(e) => handleSelect('prenom', e.target.value)} placeholder={pourUnProche ? "Ex: Léo" : ""} />
                </div>
                <div className="form-group">
                  <label>Nom {pourUnProche && "de la personne"}</label>
                  <input required type="text" value={formData.nom} onChange={(e) => handleSelect('nom', e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label>Email de confirmation</label>
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

        {/* confirmation */}
        {step === 6 && (
          <div className="step-content success-step">
            <BsCheckCircleFill className="success-icon" />
            <h2>Rendez-vous Confirmé !</h2>
            <p>Le rendez-vous pour {formData.prenom} est bien enregistré le <strong>{formData.date.split('-').reverse().join('/')} à {formData.heure}</strong>.</p>
            <p>Un email de confirmation vient de vous être envoyé à <em>{formData.email}</em>.</p>
            
            {/* boutton accueil */}
            <Link to="/" className="btn-next btn-home-return">Retour à l'accueil</Link>
          </div>
        )}

      </div>
    </div>
  );
}