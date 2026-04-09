# Groupe L'Atelier - Plateforme de Réservation de Salons de Coiffure

Ce projet a été réalisé dans le cadre du devoir bilan 3 avec le Centre Européen de Formation. Il s'agit d'une application complète permettant la réservation de prestations de coiffure dans différents salons.

##  Fonctionnalités Principales

* **Côté Client :**
    * Parcours de réservation dynamique (choix du salon, prestation, coiffeur, date et heure).
    * Création de compte et authentification sécurisée.
    * Tableau de bord client (historique des rendez-vous, annulation, modification du profil).
* **Côté Administrateur :**
    * Tableau de bord (Dashboard) sécurisé.
    * Gestion (C.R.U.D) des salons, des prestations, et du personnel.
    * Gestion des plannings (créneaux horaires des coiffeurs).

## Stack Technique

* **Front-end :** React.js (via Vite), React Router Dom, CSS pur.
* **Back-end :** Node.js, Express.js.
* **Base de données :** SQLite.
* **ORM :** Prisma.
* **Sécurité :** Bcrypt (hachage des mots de passe).

## Installation

Suivez ces étapes pour exécuter le projet localement sur votre machine.

### 1. Cloner le dépôt
```bash
git clone https://github.com/JTKaeanon/Devoir-CEF-Bilan-3
cd Devoir-CEF-Bilan-3

#### 2. Lancer le Back-end (API & Base de données)
Ouvrez un terminal et naviguez dans le dossier du back-end :

```bash
cd atelier-backend
npm install
# Initialiser la base de données SQLite avec Prisma
npx prisma db push
# Démarrer le serveur API (tourne sur http://localhost:3000)
node server.js