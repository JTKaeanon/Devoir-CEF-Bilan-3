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
// init serveur
// ==========================================
const PORT = 3000;
app.listen(PORT, () => {
  console.log(` Serveur démarré avec succès sur http://localhost:${PORT}`);
});