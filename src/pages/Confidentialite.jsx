import './Confidentialite.css';

export default function Confidentialite() {
  return (
    <div className="policy-container">
      <h1 className="policy-title">Politique de Confidentialité</h1>
      
      <section className="policy-section">
        <h2>1. Introduction (RGPD)</h2>
        <p>Le Groupe l'Atelier s'engage à ce que la collecte et le traitement de vos données soient conformes au Règlement Général sur la Protection des Données (RGPD).</p>
      </section>

      <section className="policy-section">
        <h2>2. Collecte des données</h2>
        <p>Nous collectons les informations que vous nous fournissez via nos formulaires de contact et de réservation :</p>
        <ul>
          <li>Identité (Nom, Prénom)</li>
          <li>Coordonnées (Email, Téléphone)</li>
          <li>Historique de vos prestations et rendez-vous</li>
        </ul>
      </section>

      <section className="policy-section">
        <h2>3. Utilisation de vos données</h2>
        <p>Vos données sont exclusivement utilisées pour :</p>
        <ul>
          <li>La gestion de vos rendez-vous dans nos salons rennais</li>
          <li>L'envoi de confirmations par email</li>
          <li>La réponse à vos demandes via le formulaire de contact</li>
        </ul>
      </section>

      <section className="policy-section">
        <h2>4. Vos Droits</h2>
        <p>Conformément à la loi "Informatique et Libertés", vous disposez d'un droit d'accès, de rectification et de suppression des données vous concernant. Vous pouvez exercer ce droit en nous contactant via notre page Contact.</p>
      </section>
    </div>
  );
}