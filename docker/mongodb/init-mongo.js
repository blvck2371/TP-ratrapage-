// Script d'initialisation MongoDB
// Exécuté au premier démarrage du conteneur

db = db.getSiblingDB('api_database');

// Création des collections
db.createCollection('users');

// Index sur l'email
db.users.createIndex({ email: 1 }, { unique: true });

print('Base de données initialisée');
