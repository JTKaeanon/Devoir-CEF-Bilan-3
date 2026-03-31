const express = require('express');
const cors = require('cors');

// import
const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');

// init prisma
const adapter = new PrismaBetterSqlite3({ url: "file:./prisma/dev.db" });
const prisma = new PrismaClient({ adapter });

const app = express();


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
        // NOUVEAU : On inclut les employés ET leurs horaires !
        employes: {
          include: {
            horaires: true
          }
        },
        prestations: true
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

// ==========================================
// init serever
// ==========================================
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré avec succès sur http://localhost:${PORT}`);
});