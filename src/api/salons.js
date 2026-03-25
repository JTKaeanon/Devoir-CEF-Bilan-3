// src/api/salons.js
import imgSalon1 from '../assets/salon1.jpg';
import imgSalon2 from '../assets/salon2.jpg';
import imgSalon3 from '../assets/salon3.jpg';

export const salonsData = [
  {
    id: 'the-old-school',
    name: 'The Old School',
    subtitle: "Chic & Contemporain",
    target: 'Homme et enfant ',
    address: '12 Rue de la Monnaie, 35000 Rennes',
    phone: '02 99 31 45 67',
    image: imgSalon1,
    description: "Un espace dédié à l'élégance intemporelle au cœur du centre historique de Rennes."
  },
  {
    id: 'lessence-de-soi',
    name: "L'essence de soi",
    subtitle: "Élégance & Lumière",
    target: 'Femme et enfant',
    address: '45 Mail François Mitterrand, 35000 Rennes',
    phone: '02 99 40 12 89',
    image: imgSalon2,
    description: "Baigné de lumière naturelle, ce salon offre une pause sensorielle sur le prestigieux Mail."
  },
  {
    id: 'latelier-mixte',
    name: "L'Atelier mixte",
    subtitle: "Nature & Pureté",
    target: 'Mixte - Tout le monde',
    address: '8 Rue Saint-Georges, 35000 Rennes',
    phone: '02 99 65 33 21',
    image: imgSalon3,
    description: "Une ambiance organique et apaisante dans l'une des rues les plus charmantes de la ville."
  }
];