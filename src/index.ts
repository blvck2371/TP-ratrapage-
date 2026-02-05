// Point d'entrée de l'application

import { createApp } from './app.js';
import { env, connectMongoDB, connectInfluxDB, closeDatabases } from './config/index.js';

const start = async () => {
  try {
    // Connexion aux bases de données
    console.log('Connexion aux bases de données...');
    await connectMongoDB();
    connectInfluxDB();

    // Démarrage du serveur
    const app = createApp();
    
    app.listen(env.PORT, () => {
      console.log(`Serveur démarré sur http://localhost:${env.PORT}`);
      console.log(`API disponible sur http://localhost:${env.PORT}/api/v1`);
    });

    // Gestion de l'arrêt propre
    process.on('SIGTERM', async () => {
      console.log('Arrêt du serveur...');
      await closeDatabases();
      process.exit(0);
    });

  } catch (error) {
    console.error('Erreur au démarrage:', error);
    process.exit(1);
  }
};

start();
