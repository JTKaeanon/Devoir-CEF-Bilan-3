const express = require('express');
const cors = require('cors');

// import
const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');

// init prisma
const adapter = new PrismaBetterSqlite3({ url: "file:./prisma/dev.db" });
const prisma = new PrismaClient({ adapter });

const app = express();

const bcrypt = require('bcrypt');

app.use(cors()); 
app.use(express.json());

// ==========================================
// routing
// ==========================================

// test
app.get('/', (req, res) => {
  res.json({ message: "Bienvenue sur l'API du Groupe l'Atelier !" });
});

// salons 
app.get('/api/salons', async (req, res) => {
  try {
    const tousLesSalons = await prisma.salon.findMany();
    res.json(tousLesSalons);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erreur: "Impossible de récupérer les salons" });
  }
});

// 1 salons par slug
app.get('/api/salons/:slug', async (req, res) => {
  try {
    const leSlug = req.params.slug; 
    
    const salon = await prisma.salon.findUnique({
      where: { slug: leSlug },
      include: {
        employes: {
          include: {
            horaires: true
          }
        },
        // trie prestations
        prestations: {
          orderBy: {
            duree: 'asc'
          }
        }
      }
    });

    if (!salon) {
      return res.status(404).json({ erreur: "Salon non trouvé" });
    }

    res.json(salon);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erreur: "Impossible de récupérer ce salon" });
  }
});

// prestations  salons
app.get('/api/prestations', async (req, res) => {
  try {
    const prestations = await prisma.prestation.findMany({
      include: {
        salons: true 
      },
      orderBy: {
        duree: 'asc' // durée plus petit au plsus grand
      }
    });
    res.json(prestations);
  } catch (error) {
    console.error("Erreur Prisma :", error);
    res.status(500).json({ erreur: "Impossible de récupérer les prestations" });
  }
});


// inscription
app.post('/api/inscription', async (req, res) => {
  try {
    // donnée front 
    const { nom, prenom, email, mot_de_passe, telephone } = req.body;

    // email deja présent
    const utilisateurExistant = await prisma.utilisateur.findUnique({
      where: { email: email }
    });

    if (utilisateurExistant) {
      return res.status(400).json({ erreur: "Cet email est déjà utilisé." });
    }

    // 3. hash mdp
    const saltRounds = 10;
    const motDePasseHache = await bcrypt.hash(mot_de_passe, saltRounds);

    // 4. enregistrement
    const nouvelUtilisateur = await prisma.utilisateur.create({
      data: {
        nom: nom,
        prenom: prenom,
        email: email,
        mot_de_passe: motDePasseHache,
        telephone: telephone || null,
        role: "CLIENT"
      }
    });

    // succes message
    res.status(201).json({ 
      message: "Inscription réussie !", 
      utilisateur: { id: nouvelUtilisateur.id, nom: nouvelUtilisateur.nom, email: nouvelUtilisateur.email } 
    });

  } catch (error) {
    console.error("Erreur Inscription :", error);
    res.status(500).json({ erreur: "Erreur lors de l'inscription." });
  }
});


// connect
app.post('/api/connexion', async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;

    // check email in db
    const utilisateur = await prisma.utilisateur.findUnique({
      where: { email: email }
    });

    // si pas présent => incorrect
    if (!utilisateur) {
      return res.status(401).json({ erreur: "Email ou mot de passe incorrect." });
    }

    // compare mdp avec hash dans db
    const motDePasseValide = await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe);

    if (!motDePasseValide) {
      return res.status(401).json({ erreur: "Email ou mot de passe incorrect." });
    }

    // 3. renvoi infos client sans mdp
    res.json({
      message: "Connexion réussie !",
      utilisateur: {
        id: utilisateur.id,
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        email: utilisateur.email,
        role: utilisateur.role
      }
    });

  } catch (error) {
    console.error("Erreur Connexion :", error);
    res.status(500).json({ erreur: "Erreur lors de la connexion." });
  }
});

// reservations

app.post('/api/reservations', async (req, res) => {
  try {
    const { date, heure, prestationId, employeId, utilisateurId, nom, prenom, email, telephone } = req.body;

    let finalUtilisateurId = utilisateurId;

    // gestion user si pas co
    if (!finalUtilisateurId) {
      // email dans db
      let userExistant = await prisma.utilisateur.findUnique({
        where: { email: email }
      });

      if (userExistant) {
        finalUtilisateurId = userExistant.id;
      } else {
        // compte invité automatique ID requis bdd
        const fauxMotDePasse = await bcrypt.hash("invite1234", 10); // faux mdp 
        
        const newUser = await prisma.utilisateur.create({
          data: {
            nom: nom,
            prenom: prenom,
            email: email,
            telephone: telephone || null,
            mot_de_passe: fauxMotDePasse,
            role: "CLIENT"
          }
        });
        finalUtilisateurId = newUser.id;
      }
    }

    // conversion date
    const dateRdvObj = new Date(date);

    // prise RDV
    const nouveauRdv = await prisma.rendezVous.create({
      data: {
        date_rdv: dateRdvObj,
        heure_rdv: heure,
        statut: "A_VENIR",
        utilisateurId: finalUtilisateurId,
        prestationId: parseInt(prestationId),
        employeId: parseInt(employeId)
      }
    });

    res.status(201).json({ message: "Réservation confirmée avec succès !", rdv: nouveauRdv });

  } catch (error) {
    console.error("Erreur lors de la réservation :", error);
    res.status(500).json({ erreur: "Impossible de valider la réservation." });
  }
});


// rdv dashboard client


app.get('/api/utilisateurs/:id/reservations', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    // rdv user 
    const mesRdv = await prisma.rendezVous.findMany({
      where: { 
        utilisateurId: userId 
      },
      include: {
        prestation: true, // infos presta
        employe: {
          include: { 
            salon: true // salon employé
          }
        }
      },
      orderBy: { 
        date_rdv: 'asc' // plus recent 
      }
    });

    res.json(mesRdv);

  } catch (error) {
    console.error("Erreur récupération RDV :", error);
    res.status(500).json({ erreur: "Impossible de récupérer vos rendez-vous." });
  }
});

// modif client

app.put('/api/utilisateurs/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { nom, prenom, email, telephone } = req.body;

    const utilisateurMisAJour = await prisma.utilisateur.update({
      where: { id: userId },
      data: {
        nom: nom,
        prenom: prenom,
        email: email,
        telephone: telephone
      }
    });

    // modif accept
    res.json({
      message: "Profil mis à jour avec succès !",
      utilisateur: {
        id: utilisateurMisAJour.id,
        nom: utilisateurMisAJour.nom,
        prenom: utilisateurMisAJour.prenom,
        email: utilisateurMisAJour.email,
        telephone: utilisateurMisAJour.telephone,
        role: utilisateurMisAJour.role
      }
    });

  } catch (error) {
    console.error("Erreur de mise à jour :", error);
    // error mail deja utilisé
    res.status(500).json({ erreur: "Impossible de mettre à jour. Cet email est peut-être déjà utilisé." });
  }
});

// ==========================================
// C.R.U.D PRESTATIONS (ADMINISTRATEUR)
// ==========================================

// 1. CREATE : Ajouter une nouvelle prestation
app.post('/api/prestations', async (req, res) => {
  try {
    const { nom, description, prix, duree } = req.body;
    const nouvellePrestation = await prisma.prestation.create({
      data: {
        nom,
        description,
        prix: parseFloat(prix),
        duree: parseInt(duree) // Durée en minutes
      }
    });
    res.status(201).json(nouvellePrestation);
  } catch (error) {
    console.error("Erreur CREATE prestation :", error);
    res.status(500).json({ erreur: "Impossible d'ajouter la prestation." });
  }
});

// 2. UPDATE : Modifier une prestation existante
app.put('/api/prestations/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { nom, description, prix, duree } = req.body;
    
    const prestationMaj = await prisma.prestation.update({
      where: { id: id },
      data: {
        nom,
        description,
        prix: parseFloat(prix),
        duree: parseInt(duree)
      }
    });
    res.json(prestationMaj);
  } catch (error) {
    console.error("Erreur UPDATE prestation :", error);
    res.status(500).json({ erreur: "Impossible de modifier la prestation." });
  }
});

// 3. DELETE : Supprimer une prestation
app.delete('/api/prestations/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.prestation.delete({
      where: { id: id }
    });
    res.json({ message: "Prestation supprimée avec succès." });
  } catch (error) {
    console.error("Erreur DELETE prestation :", error);
    res.status(500).json({ erreur: "Impossible de supprimer. Cette prestation est peut-être liée à des réservations." });
  }
});

// ==========================================
// C.R.U.D SALONS
// ==========================================

app.post('/api/salons', async (req, res) => {
  try {
    const nouveau = await prisma.salon.create({
      data: req.body // Prisma prend tout ce qu'on lui donne (nom, adresse, horaires...)
    });
    res.status(201).json(nouveau);
  } catch (error) {
    console.error("Erreur POST Salon :", error);
    res.status(500).json({ erreur: "Erreur lors de la création du salon." });
  }
});

app.put('/api/salons/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { id: _, ...donneesAUpdate } = req.body; 

    const maj = await prisma.salon.update({
      where: { id },
      data: donneesAUpdate
    });
    res.json(maj);
  } catch (error) {
    console.error("Erreur PUT Salon :", error);
    res.status(500).json({ erreur: "Erreur lors de la mise à jour." });
  }
});

app.delete('/api/salons/:id', async (req, res) => {
  try {
    await prisma.salon.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "Salon supprimé" });
  } catch (error) {
    res.status(500).json({ erreur: "Erreur suppression (lié à des employés ?)" });
  }
});

app.delete('/api/salons/:id', async (req, res) => {
  try {
    await prisma.salon.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "Salon supprimé" });
  } catch (error) {
    res.status(500).json({ erreur: "Erreur suppression (lié à des employés ?)" });
  }
});

// ==========================================
// C.R.U.D COIFFEURS & PLANNING
// ==========================================

app.get('/api/employes', async (req, res) => {
  try {
    const employes = await prisma.employe.findMany({ 
      include: { 
        salon: true, 
        horaires: true 
      } 
    });
    res.json(employes);
  } catch (error) {
    console.error("Erreur API Employés :", error);
    res.status(500).json({ erreur: "Erreur lors de la récupération des employés." });
  }
});

app.post('/api/employes', async (req, res) => {
  try {
    const { nom, role, salonId } = req.body;
    const nouveau = await prisma.employe.create({
      data: { nom, role, salonId: parseInt(salonId) }
    });
    res.status(201).json(nouveau);
  } catch (error) {
    res.status(500).json({ erreur: "Erreur création employé." });
  }
});

// Ajouter un créneau au planning
app.post('/api/horaires', async (req, res) => {
  try {
    const { jour, heure_debut, heure_fin, employeId } = req.body;
    const nouvelHoraire = await prisma.horaire.create({
      data: { jour, heure_debut, heure_fin, employeId: parseInt(employeId) }
    });
    res.status(201).json(nouvelHoraire);
  } catch (error) {
    res.status(500).json({ erreur: "Erreur ajout horaire." });
  }
});

app.delete('/api/horaires/:id', async (req, res) => {
  await prisma.horaire.delete({ where: { id: parseInt(req.params.id) } });
  res.json({ message: "Créneau supprimé" });
});

// ==========================================
// init serveur
// ==========================================
const PORT = 3000;
app.listen(PORT, () => {
  console.log(` Serveur démarré avec succès sur http://localhost:${PORT}`);
});