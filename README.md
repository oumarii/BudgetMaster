# MoneyWisee

## Description
application de gestion financière personnelle qui permet aux utilisateurs de suivre leurs dépenses, gérer leurs budgets et visualiser leur situation financière à travers un tableau de bord intuitif.

## Fonctionnalités
- **Gestion des transactions** : Enregistrer et catégoriser les dépenses et revenus
- **Budgets** : Créer et suivre des budgets par catégorie
- **Catégories** : Personnaliser les catégories de transactions
- **Tableau de bord** : Visualiser les données financières avec des graphiques et statistiques
- **Authentification** : Système de connexion et d'inscription sécurisé

## Architecture
- **Frontend** : React.js avec Bootstrap pour l'interface utilisateur
- **Backend** : Spring Boot (Java)
- **Base de données** : MySQL

## Prérequis
- Java 17
- Node.js et npm
- MySQL

## Installation et lancement

### Base de données
1. Assurez-vous que MySQL est installé et en cours d'exécution
2. La base de données sera créée automatiquement au démarrage de l'application (createDatabaseIfNotExist=true)

### Backend
1. Naviguez vers le dossier backend :
   ```
   cd backend
   ```
2. Lancez l'application Spring Boot :
   ```
   mvn spring-boot:run
   ```
   Ou si Maven n'est pas installé globalement :
   ```
   mvnw.cmd spring-boot:run
   ```
3. Le backend sera accessible à l'adresse : http://localhost:8081

### Frontend
1. Naviguez vers le dossier frontend :
   ```
   cd frontend
   ```
2. Installez les dépendances :
   ```
   npm install
   ```
3. Lancez l'application React :
   ```
   npm start
   ```
4. Le frontend sera accessible à l'adresse : http://localhost:3000

## Accès à l'application
Une fois les deux serveurs lancés, vous pouvez accéder à l'application via : http://localhost:3000

