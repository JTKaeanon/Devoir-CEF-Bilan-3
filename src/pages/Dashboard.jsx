import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import './Dashboard.css';

export default function Dashboard() {
  useDocumentTitle('Mon Espace | Groupe l\'Atelier');
  const navigate = useNavigate();

  const [utilisateur, setUtilisateur] = useState(() => {
    const data = localStorage.getItem('utilisateur');
    return data ? JSON.parse(data) : null;
  });

  const [mesRdv, setMesRdv] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // modif profil
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nom: utilisateur?.nom || '',
    prenom: utilisateur?.prenom || '',
    email: utilisateur?.email || '',
    telephone: utilisateur?.telephone || ''
  });

  useEffect(() => {
    if (!utilisateur) {
      navigate('/compte');
      return;
    }

    const fetchMesRdv = async () => {
      try {
        const response = await fetch(`https://groupe-atelier-devoir-bilan.onrender.com/api/utilisateurs/${utilisateur.id}/reservations`);
        if (response.ok) {
          const data = await response.json();
          setMesRdv(data);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des rendez-vous", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMesRdv();
  }, [navigate, utilisateur]);

  const handleEditChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://groupe-atelier-devoir-bilan.onrender.com/api/utilisateurs/${utilisateur.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('utilisateur', JSON.stringify(data.utilisateur));
        setUtilisateur(data.utilisateur);
        setIsEditing(false); 
        alert("Profil mis à jour avec succès !");
      } else {
        alert(data.erreur);
      }
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la mise à jour.");
    }
  };

  // annulation rdv
  const handleAnnulerRdv = async (rdvId) => {
    if (window.confirm("Êtes-vous sûr de vouloir annuler ce rendez-vous ?")) {
      try {
        const response = await fetch(`https://groupe-atelier-devoir-bilan.onrender.com/api/reservations/${rdvId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          setMesRdv(mesRdv.filter(rdv => rdv.id !== rdvId));
          alert("Votre rendez-vous a bien été annulé.");
        } else {
          alert("Erreur lors de l'annulation du rendez-vous.");
        }
      } catch (error) {
        console.error("Erreur :", error);
        alert("Impossible de joindre le serveur.");
      }
    }
  };

  // rdv tri
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // rdv a venir
  const rdvAVenir = mesRdv.filter(rdv => new Date(rdv.date_rdv) >= today);
  // rdv passé
  const rdvPasses = mesRdv.filter(rdv => new Date(rdv.date_rdv) < today);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  if (!utilisateur || isLoading) {
    return <div className="dashboard-loading">Chargement de votre espace...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Bonjour, {utilisateur.prenom} !</h1>
        <p>Gérez vos informations et vos rendez-vous depuis cet espace.</p>
      </div>

      <div className="dashboard-layout">
        
        {/* profil */}
        <aside className="dashboard-sidebar">
          <div className="profile-card">
            <div className="profile-header">
              <h2>Mon Profil</h2>
              {!isEditing && (
                <button className="btn-edit" onClick={() => setIsEditing(true)}>
                  <i className="bi bi-pencil-square"></i> Modifier
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleUpdateProfile} className="profile-form">
                <div className="form-group">
                  <label>Prénom</label>
                  <input type="text" name="prenom" value={formData.prenom} onChange={handleEditChange} required />
                </div>
                <div className="form-group">
                  <label>Nom</label>
                  <input type="text" name="nom" value={formData.nom} onChange={handleEditChange} required />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleEditChange} required />
                </div>
                <div className="form-group">
                  <label>Téléphone</label>
                  <input type="tel" name="telephone" value={formData.telephone} onChange={handleEditChange} />
                </div>
                <div className="form-actions">
                  <button type="button" className="btn-cancel" onClick={() => setIsEditing(false)}>Annuler</button>
                  <button type="submit" className="btn-save">Enregistrer</button>
                </div>
              </form>
            ) : (
              <div className="profile-info">
                <p><strong>Nom :</strong> {utilisateur.prenom} {utilisateur.nom}</p>
                <p><strong>Email :</strong> {utilisateur.email}</p>
                <p><strong>Téléphone :</strong> {utilisateur.telephone || 'Non renseigné'}</p>
              </div>
            )}
          </div>
        </aside>

        {/* rendez vous */}
        <main className="dashboard-main">
          
          {/* a venir */}
          <section className="rdv-section">
            <h2 className="section-title"><i className="bi bi-calendar-event"></i> Rendez-vous à venir</h2>
            {rdvAVenir.length === 0 ? (
              <div className="no-rdv">
                <p>Vous n'avez aucun rendez-vous prévu.</p>
                <button onClick={() => navigate('/prestations')} className="btn-reserver-dash">
                  Prendre rendez-vous
                </button>
              </div>
            ) : (
              <div className="rdv-grid">
                {rdvAVenir.map((rdv) => (
                  <div key={rdv.id} className="rdv-card upcoming">
                    <div className="rdv-date-box">
                      <span className="rdv-date">{formatDate(rdv.date_rdv)}</span>
                      <span className="rdv-time">{rdv.heure_rdv}</span>
                    </div>
                    <div className="rdv-info">
                      <h3>{rdv.prestation.nom}</h3>
                      <p><i className="bi bi-shop"></i> {rdv.employe.salon.nom}</p>
                      <p><i className="bi bi-person"></i> Avec {rdv.employe.nom}</p>
                    </div>
                    <div className="rdv-status status-column">
                      <span className={`status-badge ${rdv.statut.toLowerCase()}`}>
                        {rdv.statut.replace('_', ' ')}
                      </span>
                      <button 
                        className="btn-cancel-rdv"
                        onClick={() => handleAnnulerRdv(rdv.id)}
                      >
                        Annuler ce RDV
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* historique */}
          {true && (
            <section className="rdv-section past-rdv">
              <h2 className="section-title"><i className="bi bi-clock-history"></i> Historique</h2>
              <div className="rdv-grid">
                {rdvPasses.map((rdv) => (
                  <div key={rdv.id} className="rdv-card past">
                    <div className="rdv-date-box">
                      <span className="rdv-date">{formatDate(rdv.date_rdv)}</span>
                    </div>
                    <div className="rdv-info">
                      <h3>{rdv.prestation.nom}</h3>
                      <p>{rdv.employe.salon.nom} - Avec {rdv.employe.nom}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

        </main>
      </div>
    </div>
  );
}