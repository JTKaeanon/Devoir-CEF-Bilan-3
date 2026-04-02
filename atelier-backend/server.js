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

// Route de test
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

// Route pour récupérer UN SEUL salon par son SLUG
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
        // 🌟 NOUVEAU : On trie les prestations imbriquées !
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


// Route de connexion
app.post('/api/connexion', async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;

    // 1. On cherche l'utilisateur dans la base de données avec son email
    const utilisateur = await prisma.utilisateur.findUnique({
      where: { email: email }
    });

    // S'il n'existe pas, on renvoie une erreur générique (sécurité : on ne dit pas si c'est l'email ou le mdp qui est faux)
    if (!utilisateur) {
      return res.status(401).json({ erreur: "Email ou mot de passe incorrect." });
    }

    // 2. On compare le mot de passe tapé avec le mot de passe crypté dans la base
    const motDePasseValide = await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe);

    if (!motDePasseValide) {
      return res.status(401).json({ erreur: "Email ou mot de passe incorrect." });
    }

    // 3. Succès ! On renvoie les infos du client (mais SURTOUT PAS son mot de passe !)
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

// ==========================================
// init serveur
// ==========================================
const PORT = 3000;
app.listen(PORT, () => {
  console.log(` Serveur démarré avec succès sur http://localhost:${PORT}`);
});