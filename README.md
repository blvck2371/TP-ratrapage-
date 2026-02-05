# API Node.js Dockerisée - TP Rattrapage

**LINDOU NGAPOUT ABDEL RAOUFOU **

Projet d'API REST avec Node.js, MongoDB et InfluxDB, le tout dans des conteneurs Docker.

---

## Ce que contient le projet

- Backend en Node.js avec Express et TypeScript
- Validation des données avec Zod
- MongoDB pour stocker les utilisateurs (avec Mongoose comme ORM)
- InfluxDB pour les métriques et logs
- Tout est dockerisé avec docker-compose

---

## Structure du projet

```
TP-ratrapage-/
├── docker-compose.yml     --> Config des conteneurs
├── Dockerfile             --> Image de l'API
├── package.json
├── tsconfig.json
├── README.md
│
├── docker/
│   └── mongodb/
│       └── init-mongo.js  --> Script init de la base
│
└── src/
    ├── index.ts           --> Démarrage du serveur
    ├── app.ts             --> Config Express
    │
    ├── config/            --> Configuration générale
    │   ├── env.ts         --> Variables d'environnement (validées avec Zod)
    │   └── database.ts    --> Connexions aux BDD
    │
    ├── models/            --> Modèles de données
    │   ├── mongodb/
    │   │   └── user.model.ts    --> Modèle Mongoose pour les users
    │   └── influxdb/
    │       └── metrics.model.ts --> Gestion des métriques
    │
    ├── schemas/           --> Schemas de validation Zod
    │   ├── user.schema.ts
    │   └── metrics.schema.ts
    │
    ├── services/          --> Logique métier
    │   ├── user.service.ts
    │   └── metrics.service.ts
    │
    ├── controllers/       --> Gestion des requêtes HTTP
    │   ├── user.controller.ts
    │   └── metrics.controller.ts
    │
    ├── routes/            --> Définition des routes
    │   ├── user.routes.ts
    │   └── metrics.routes.ts
    │
    ├── middlewares/       --> Middlewares Express
    │   ├── error.middleware.ts
    │   ├── validation.middleware.ts
    │   └── logger.middleware.ts
    │
    └── utils/
        └── logger.ts      --> Utilitaire de log
```

---

## Pourquoi ces choix techniques ?

### Mongoose pour MongoDB

J'ai choisi Mongoose comme ORM parce que c'est le plus utilisé avec Node.js et MongoDB. Il permet de définir des schémas, faire de la validation, et c'est bien documenté. C'était plus simple que d'utiliser le driver natif MongoDB.

### Zod pour la validation

Zod permet de valider les données entrantes (body, params, query) et en plus il génère automatiquement les types TypeScript. Du coup on a la validation ET le typage au même endroit.

### InfluxDB pour les métriques

InfluxDB est fait pour les données temporelles (time-series). Je l'utilise pour stocker les stats des requêtes API : temps de réponse, nombre de requêtes, etc. C'est plus adapté que MongoDB pour ce type de données.

### Architecture en couches

J'ai séparé le code en plusieurs couches pour que ce soit plus clair :

```
Routes -> Middlewares -> Controllers -> Services -> Models -> Base de données
```

- **Routes** : définit les URLs et appelle les middlewares
- **Middlewares** : validation, logging, gestion d'erreurs
- **Controllers** : reçoit la requête, appelle le service, renvoie la réponse
- **Services** : contient la logique métier
- **Models** : interagit avec la base de données

---

## Les services Docker

Le fichier docker-compose.yml définit 3 services :

### 1. api (le backend)
- Construit à partir du Dockerfile
- Port 3000
- Se connecte à MongoDB et InfluxDB
- Attend que les BDD soient prêtes avant de démarrer

### 2. mongodb
- Image : mongo:7.0
- Port 27017
- Stocke les données des utilisateurs
- Volume pour persister les données

### 3. influxdb
- Image : influxdb:2.7
- Port 8086
- Stocke les métriques de l'API
- Volume pour persister les données

Les 3 services sont sur le même réseau Docker pour communiquer entre eux.

---

## Flux de données

Quand une requête arrive, voilà ce qui se passe :

```
1. Le client envoie une requête HTTP (ex: POST /api/v1/users)

2. Express reçoit la requête et passe par les middlewares globaux :
   - helmet (sécurité)
   - cors
   - parsing du JSON
   - logger (enregistre la requête)

3. La route correspondante est trouvée

4. Le middleware de validation (Zod) vérifie les données
   - Si erreur -> renvoie 400

5. Le controller récupère les données validées et appelle le service

6. Le service exécute la logique métier :
   - Appelle le model pour interagir avec MongoDB
   - Peut aussi logger dans InfluxDB

7. La réponse remonte : Service -> Controller -> Client

8. Si erreur quelque part, le middleware d'erreur la capture et renvoie une réponse propre
```

### Exemple concret : créer un utilisateur

```
POST /api/v1/users
Body: { "email": "test@mail.com", "name": "Test" }

1. validate(createUserSchema) -> vérifie le body avec Zod
2. UserController.create() -> récupère req.body
3. UserService.create() -> vérifie si l'email existe déjà, crée le user
4. User.save() -> Mongoose sauvegarde dans MongoDB
5. MetricsModel.recordUserActivity() -> log l'action dans InfluxDB
6. Réponse: { success: true, data: { id, email, name } }
```

---

## Comment lancer le projet

### Avec Docker (recommandé)

```bash
# Cloner le repo
git clone <url-du-repo>
cd TP-ratrapage-

# Lancer tous les services
docker-compose up --build
```

L'API sera dispo sur http://localhost:3000

### En local (dev)

```bash
# Installer les dépendances
npm install

# Lancer MongoDB et InfluxDB avec Docker
docker-compose up mongodb influxdb -d

# Créer un fichier .env avec les variables nécessaires
# (voir .env.example ou docker-compose.yml pour les valeurs)

# Lancer en mode dev
npm run dev
```

---

## Endpoints disponibles

Base URL : `http://localhost:3000/api/v1`

### Users
- `GET /users` - liste les utilisateurs
- `POST /users` - crée un utilisateur
- `GET /users/:id` - récupère un utilisateur
- `PUT /users/:id` - modifie un utilisateur
- `DELETE /users/:id` - supprime un utilisateur

### Metrics
- `GET /metrics` - récupère les métriques
- `POST /metrics` - enregistre une métrique
- `GET /metrics/stats` - stats des requêtes API

---

## Exemples de requêtes

```bash
# Créer un utilisateur
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"email": "john@mail.com", "name": "John"}'

# Lister les utilisateurs
curl http://localhost:3000/api/v1/users
```

---

LINDOU NGAPOUT - TP Rattrapage
