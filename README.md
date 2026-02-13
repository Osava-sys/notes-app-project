# 📱 Notes App - Gestionnaire de Notes d'Examen

Application mobile Android moderne pour gérer les notes d'examen des étudiants, développée avec **Ionic 8**, **Angular 18**, **Capacitor 6** et **Node.js**.

## 🚀 Fonctionnalités

✅ **Gestion des Notes**
- Ajouter une nouvelle note
- Modifier une note existante
- Supprimer une note
- Lister toutes les notes

✅ **Statistiques**
- Moyenne générale
- Moyennes par semestre
- Visualisations interactives

✅ **Authentification**
- Inscription utilisateur
- Connexion sécurisée (JWT)
- Gestion de session

✅ **Interface Moderne**
- Design Material avec Tailwind CSS
- Animations fluides
- Mode responsive
- Splash screen personnalisé
- Icône de lancement personnalisée

## 🛠 Stack Technique

### Backend
- **Node.js 20** - Runtime JavaScript
- **Express 4.19** - Framework web
- **PostgreSQL** - Base de données
- **Prisma ORM** - ORM moderne et type-safe
- **JWT** - Authentification
- **Zod** - Validation des données
- **bcryptjs** - Hachage des mots de passe

### Frontend
- **Ionic 8** - Framework mobile
- **Angular 18** - Framework TypeScript
- **Capacitor 6** - Bridge natif
- **NgRx** - Gestion d'état (Redux pattern)
- **Tailwind CSS** - Framework CSS utilitaire
- **RxJS** - Programmation réactive

### DevOps
- **Docker** - Conteneurisation
- **TypeScript** - Typage statique
- **ESLint** - Linter
- **Prettier** - Formatage du code

## 📋 Prérequis

- **Node.js** >= 20.0.0
- **npm** >= 10.0.0
- **PostgreSQL** >= 14
- **Docker** (optionnel, pour la base de données)
- **Android Studio** (pour build Android)
- **Java JDK** >= 17

## 🔧 Installation

### 1. Cloner le projet

```bash
git clone <url-du-repo>
cd notes-app-project
```

### 2. Configuration du Backend

```bash
cd backend

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Démarrer PostgreSQL avec Docker (optionnel)
docker-compose up -d

# Générer le client Prisma
npm run prisma:generate

# Exécuter les migrations
npm run prisma:migrate

# Démarrer le serveur de développement
npm run dev
```

Le backend sera accessible sur `http://localhost:3000`

### 3. Configuration du Frontend

```bash
cd ../frontend

# Installer les dépendances
npm install

# Démarrer le serveur de développement
ionic serve
```

L'application sera accessible sur `http://localhost:8100`

## 📱 Build Android

### 1. Préparer l'environnement

```bash
cd frontend

# Build de production
npm run build:prod

# Ajouter la plateforme Android (première fois seulement)
npm run cap:add

# Synchroniser les fichiers
npm run cap:sync
```

### 2. Générer l'APK

```bash
# APK de debug
npm run android:build

# APK de release (signé)
npm run android:release
```

L'APK sera généré dans : `frontend/android/app/build/outputs/apk/`

### 3. Ouvrir dans Android Studio

```bash
npm run cap:open
```

## 🗄 Structure du Projet

```
notes-app-project/
├── backend/                    # Backend Node.js + Express
│   ├── prisma/                # Schéma Prisma
│   │   └── schema.prisma
│   ├── src/
│   │   ├── config/           # Configuration DB
│   │   ├── controllers/      # Contrôleurs
│   │   ├── routes/           # Routes API
│   │   ├── utils/            # Utilitaires (JWT, etc.)
│   │   ├── validators/       # Validations Zod
│   │   └── server.ts         # Point d'entrée
│   ├── .env.example
│   ├── docker-compose.yml
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/                   # Frontend Ionic + Angular
    ├── src/
    │   ├── app/
    │   │   ├── core/         # Services, guards, models
    │   │   ├── pages/        # Pages de l'app
    │   │   ├── store/        # NgRx store
    │   │   ├── app.component.ts
    │   │   ├── app.config.ts
    │   │   └── app.routes.ts
    │   ├── assets/           # Images, icônes
    │   ├── environments/     # Variables d'environnement
    │   ├── theme/            # Styles Ionic
    │   ├── global.scss       # Styles globaux
    │   ├── index.html
    │   └── main.ts
    ├── android/              # Projet Android natif
    ├── capacitor.config.ts
    ├── ionic.config.json
    ├── tailwind.config.js
    ├── package.json
    └── tsconfig.json
```

## 🔐 API Endpoints

### Authentification

```
POST   /api/auth/register    - Inscription
POST   /api/auth/login       - Connexion
```

### Notes (nécessite authentification)

```
GET    /api/grades            - Lister toutes les notes
POST   /api/grades            - Créer une note
GET    /api/grades/:id        - Obtenir une note
PUT    /api/grades/:id        - Modifier une note
DELETE /api/grades/:id        - Supprimer une note
GET    /api/grades/statistics - Obtenir les statistiques
```

## 📊 Modèle de Données

### Grade (Note)

```typescript
{
  id: string;
  score: number;        // Note sur 20
  course: string;       // Nom du cours
  semester: number;     // Numéro du semestre (1-10)
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### User (Utilisateur)

```typescript
{
  id: string;
  email: string;
  password: string;     // Haché avec bcrypt
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## 🎨 Personnalisation

### Splash Screen

Le splash screen se configure dans `capacitor.config.ts` :

```typescript
SplashScreen: {
  launchShowDuration: 2000,
  backgroundColor: '#2196f3',
  // ...
}
```

### Icône de l'app

Remplacez les icônes dans `frontend/android/app/src/main/res/`

### Couleurs

Modifiez les couleurs dans :
- `frontend/src/theme/variables.scss` (Ionic)
- `frontend/tailwind.config.js` (Tailwind)

## 🧪 Tests

### Backend

```bash
cd backend
npm run test
```

### Frontend

```bash
cd frontend
npm run test
```

## 🐛 Débogage

### Backend

Utilisez les logs dans la console ou Prisma Studio :

```bash
npm run prisma:studio
```

### Frontend

Utilisez les DevTools du navigateur ou Android Studio Logcat.

## 📦 Scripts Utiles

### Backend

```bash
npm run dev          # Développement avec hot-reload
npm run build        # Build TypeScript
npm run start        # Production
npm run lint         # Linter
npm run format       # Prettier
```

### Frontend

```bash
ionic serve          # Développement navigateur
npm run build        # Build
npm run build:prod   # Build production
npm run lint         # Linter
ionic cap sync       # Sync avec Capacitor
```

## 🚀 Déploiement

### Backend

1. Configurez une base PostgreSQL de production
2. Mettez à jour `.env` avec les variables de production
3. Build et démarrez :

```bash
npm run build
npm start
```

### Frontend (Android)

1. Générez l'APK de release signé
2. Uploadez sur Google Play Store

## 📝 Bonnes Pratiques Implémentées

✅ **Architecture Clean** : Séparation des responsabilités  
✅ **Type Safety** : TypeScript strict partout  
✅ **Gestion d'État** : NgRx pour un état prévisible  
✅ **Validation** : Zod côté backend  
✅ **Sécurité** : JWT, bcrypt, Helmet  
✅ **Performance** : Lazy loading, memoization  
✅ **Code Quality** : ESLint, Prettier  
✅ **Responsive** : Mobile-first design  

## 🤝 Contribution

Ce projet est un projet académique. Pour toute suggestion :

1. Forkez le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT.

## 👨‍💻 Auteur

Projet réalisé dans le cadre du cours IC3 - GSN 2025-2026

## 🔗 Ressources

- [Ionic Documentation](https://ionicframework.com/docs)
- [Angular Documentation](https://angular.io/docs)
- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NgRx Documentation](https://ngrx.io/docs)

---

**Note** : Ce README contient toutes les informations nécessaires pour installer, développer et déployer l'application. Assurez-vous de suivre les étapes dans l'ordre.
