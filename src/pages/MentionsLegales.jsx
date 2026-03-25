import './MentionsLegales.css';

export default function MentionsLegales() {
  return (
    <div className="legal-container">
      <h1 className="legal-title">Mentions Légales</h1>
      
      <section className="legal-section">
        <h2>1. Éditeur du site</h2>
        <p>Le site <strong>Le Groupe l'Atelier</strong> est édité dans le cadre d'un projet d'étude.</p>
        <ul>
          <li><strong>Siège social fictif :</strong> 12 Rue de la Monnaie, 35000 Rennes</li>
          <li><strong>Téléphone :</strong> 02 99 31 45 67</li>
          <li><strong>Email :</strong> contact@groupe-atelier.fr</li>
          <li><strong>Directeur de la publication :</strong> Ton Prénom et Nom</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>2. Hébergement</h2>
        <p>Ce site est hébergé par :</p>
        <p>
          <strong> placeholder </strong><br />
          placeholder<br />
          placeholder
        </p>
      </section>

      <section className="legal-section">
        <h2>3. Propriété intellectuelle</h2>
        <p>L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations photographiques.</p>
      </section>

      <section className="legal-section">
        <h2>4. Responsabilité</h2>
        <p>Le Groupe l'Atelier s'efforce d'assurer au mieux de ses possibilités, l'exactitude et la mise à jour des informations diffusées sur ce site. Les photos utilisées sont libres de droits ou utilisées à des fins strictement pédagogiques.</p>
      </section>
    </div>
  );
}