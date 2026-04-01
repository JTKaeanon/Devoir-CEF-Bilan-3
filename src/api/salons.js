export const salonsData = [
  {
    id: 'the-old-school',
    name: 'The Old School',
    subtitle: "L'art du rasage traditionnel, le style en plus.",
    target: 'Homme et enfant',
    address: '12 Rue de la Monnaie, 35000 Rennes',
    phone: '02 99 31 45 67',
    description: "Un espace dédié à l'élégance intemporelle au cœur du centre historique de Rennes.",
    // teams
    equipe: [
        { id: 1, nom: 'Carte\nCoiffeur' },
        { id: 2, nom: 'Carte\nCoiffeur' },
        { id: 3, nom: 'Carte\nCoiffeur' },
        { id: 4, nom: 'Carte\nCoiffeur' }
    ],
    // services
    prestations: [
        { id: 1, nom: 'Coupe Homme (avec ou sans shampoing)', duree: '30 Minutes', prix: '25 €' },
        { id: 2, nom: 'Barbier (Taille de barbe)', duree: '30 Minutes', prix: '22 €' },
        { id: 3, nom: 'Formule Coupe + Barbe', duree: '1 Heure', prix: '42 €' }
    ]
  },
  {
    id: 'lessence-de-soi',
    name: "L'essence de soi",
    subtitle: "Élégance & Lumière",
    target: 'Femme et enfant',
    address: '45 Mail François Mitterrand, 35000 Rennes',
    phone: '02 99 40 12 89',
    description: "Baigné de lumière naturelle, ce salon offre une pause sensorielle sur le prestigieux Mail."
  },
  {
    id: 'latelier-mixte',
    name: "L'Atelier mixte",
    subtitle: "Nature & Pureté",
    target: 'Mixte - Tout le monde',
    address: '8 Rue Saint-Georges, 35000 Rennes',
    phone: '02 99 65 33 21',
    description: "Une ambiance organique et apaisante dans l'une des rues les plus charmantes de la ville."
  }
];