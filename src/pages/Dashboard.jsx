import { useState } from 'react';
import './Dashboard.css';

// Fausses données pour simuler la base de données (CCP2)
const mockRDV = [
  { id: 1, heure: '09:00', client: 'Jean Dupont', prestation: 'Coupe Homme + Barbe', coiffeur: 'Thomas', statut: 'À venir' },
  { id: 2, heure: '10:30', client: 'Marie Curie', prestation: 'Coloration', coiffeur: 'Camille', statut: 'En cours' },
  { id: 3, heure: '14:00', client: 'Paul Martin', prestation: 'Coupe Enfant', coiffeur: 'Thomas', statut: 'À venir' },
  { id: 4, heure: '15:30', client: 'Sophie Leroux', prestation: 'Brushing', coiffeur: 'Sarah', statut: 'Terminé' }
];

export default function Dashboard() {
  // State pour simuler la connexion avec un rôle spécifique
  const [role, setRole] = useState('admin'); // 'admin' ou 'coiffeur'

  // Filtrer les RDV si on est en vue coiffeur (ex: on simule qu'on est connecté en tant que "Thomas")
  const rdvAffiches = role === 'coiffeur' 
    ? mockRDV.filter(rdv => rdv.coiffeur === 'Thomas') 
    : mockRDV;

  return (
    <div className="dashboard-container">
      
      {/* HEADER DU DASHBOARD ET SIMULATEUR DE RÔLE */}
      <div className="dashboard-header">
        <div>
          <h1>Tableau de bord</h1>
          <p>Bienvenue dans votre espace de gestion.</p>
        </div>
        
        {/* Ce bloc est temporaire pour ta démo RNCP */}
        <div className="role-simulator">
          <span>Vue actuelle :</span>
          <button 
            className={`role-btn ${role === 'admin' ? 'active' : ''}`}
            onClick={() => setRole('admin')}
          >
            Admin (Manager)
          </button>
          <button 
            className={`role-btn ${role === 'coiffeur' ? 'active' : ''}`}
            onClick={() => setRole('coiffeur')}
          >
            Coiffeur (Thomas)
          </button>
        </div>
      </div>

      {/* CONTENU SPÉCIFIQUE À L'ADMIN */}
      {role === 'admin' && (
        <div className="dashboard-content">
          <div className="kpi-grid">
            <div className="kpi-card">
              <h3>Chiffre du jour</h3>
              <p className="kpi-value">485 €</p>
            </div>
            <div className="kpi-card">
              <h3>Nouveaux clients</h3>
              <p className="kpi-value">+ 3</p>
            </div>
            <div className="kpi-card">
              <h3>Rendez-vous (Aujourd'hui)</h3>
              <p className="kpi-value">{mockRDV.length}</p>
            </div>
          </div>

          <div className="admin-actions">
            <h2>Actions rapides</h2>
            <div className="actions-grid">
              <button className="action-btn">➕ Ajouter une prestation</button>
              <button className="action-btn">✂️ Gérer l'équipe</button>
              <button className="action-btn">📅 Voir le planning complet</button>
              <button className="action-btn">⚙️ Paramètres des salons</button>
            </div>
          </div>
        </div>
      )}

      {/* CONTENU COMMUN / VUE COIFFEUR (Planning du jour) */}
      <div className="dashboard-section">
        <h2>{role === 'admin' ? 'Tous les rendez-vous du jour' : 'Mon planning du jour'}</h2>
        
        <div className="table-responsive">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Heure</th>
                <th>Client</th>
                <th>Prestation</th>
                {role === 'admin' && <th>Coiffeur</th>}
                <th>Statut</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rdvAffiches.map(rdv => (
                <tr key={rdv.id}>
                  <td className="fw-bold">{rdv.heure}</td>
                  <td>{rdv.client}</td>
                  <td>{rdv.prestation}</td>
                  {role === 'admin' && <td>{rdv.coiffeur}</td>}
                  <td>
                    <span className={`badge-statut ${rdv.statut.replace(/\s+/g, '-').toLowerCase()}`}>
                      {rdv.statut}
                    </span>
                  </td>
                  <td>
                    <button className="btn-edit-rdv">Modifier</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}