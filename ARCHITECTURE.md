# 🏗 Architecture du Projet

## Vue d'Ensemble

Cette application suit une architecture **moderne et scalable** inspirée des meilleures pratiques de l'industrie en 2025.

## 📐 Patterns Architecturaux

### Backend: Layered Architecture

```
┌─────────────────────────────────────┐
│         API Layer (Routes)          │
│   Gère les requêtes HTTP entrantes  │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Controller Layer               │
│   Logique métier et orchestration   │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Validation Layer (Zod)         │
│   Validation des données entrantes  │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Data Access Layer (Prisma)     │
│   Accès à la base de données        │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         PostgreSQL Database         │
└─────────────────────────────────────┘
```

### Frontend: Redux Pattern avec NgRx

```
┌─────────────────────────────────────┐
│          Components/Pages           │
│   Vue et interaction utilisateur    │
└──────────────┬──────────────────────┘
               │ dispatch
┌──────────────▼──────────────────────┐
│            Actions                  │
│   Événements déclenchés             │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│            Effects                  │
│   Gestion des side effects (API)    │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│            Reducers                 │
│   Modification immutable du state   │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│            Store                    │
│   État global de l'application      │
└──────────────┬──────────────────────┘
               │ select
┌──────────────▼──────────────────────┐
│           Selectors                 │
│   Récupération optimisée du state   │
└──────────────┬──────────────────────┘
               │
               └────────► Components
```

## 🗂 Structure Détaillée

### Backend

```
backend/
├── prisma/
│   └── schema.prisma           # Définition du schéma DB
│
├── src/
│   ├── config/
│   │   └── database.ts         # Configuration Prisma Client
│   │
│   ├── controllers/
│   │   ├── auth.controller.ts  # Logique d'authentification
│   │   └── grades.controller.ts # Logique de gestion des notes
│   │
│   ├── routes/
│   │   ├── auth.routes.ts      # Routes d'authentification
│   │   └── grades.routes.ts    # Routes des notes
│   │
│   ├── utils/
│   │   └── jwt.ts              # Gestion JWT
│   │
│   ├── validators/
│   │   └── schemas.ts          # Schémas de validation Zod
│   │
│   └── server.ts               # Point d'entrée Express
│
├── .env                        # Variables d'environnement
├── docker-compose.yml          # Configuration PostgreSQL
├── package.json
└── tsconfig.json
```

### Frontend

```
frontend/
├── src/
│   ├── app/
│   │   ├── core/               # Module central
│   │   │   ├── guards/
│   │   │   │   └── auth.guard.ts       # Protection des routes
│   │   │   ├── models/
│   │   │   │   └── index.ts            # Types TypeScript
│   │   │   └── services/
│   │   │       ├── api.service.ts      # Client HTTP API
│   │   │       └── auth.service.ts     # Gestion auth
│   │   │
│   │   ├── pages/              # Pages de l'application
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── home/
│   │   │   ├── statistics/
│   │   │   ├── profile/
│   │   │   └── tabs/
│   │   │
│   │   ├── store/              # État global NgRx
│   │   │   ├── grades/
│   │   │   │   ├── grades.actions.ts
│   │   │   │   ├── grades.effects.ts
│   │   │   │   ├── grades.reducer.ts
│   │   │   │   └── grades.selectors.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── app.component.ts
│   │   ├── app.config.ts
│   │   └── app.routes.ts
│   │
│   ├── assets/                 # Images, fonts, icônes
│   ├── environments/           # Config par environnement
│   ├── theme/                  # Variables Ionic
│   ├── global.scss
│   ├── index.html
│   └── main.ts
│
├── android/                    # Projet Android natif
├── capacitor.config.ts
├── ionic.config.json
├── tailwind.config.js
└── package.json
```

## 🔄 Flux de Données

### 1. Authentification

```
┌─────────┐         ┌─────────┐         ┌──────────┐
│  User   │────────▶│  Login  │────────▶│   Auth   │
│  Input  │         │  Page   │         │ Service  │
└─────────┘         └─────────┘         └────┬─────┘
                                              │
                    ┌─────────────────────────┘
                    │
                    ▼
            ┌───────────────┐
            │   API POST    │
            │ /auth/login   │
            └───────┬───────┘
                    │
                    ▼
            ┌───────────────┐
            │   Backend     │
            │   Validates   │
            └───────┬───────┘
                    │
                    ▼
            ┌───────────────┐
            │  Generate JWT │
            │  Return Token │
            └───────┬───────┘
                    │
                    ▼
            ┌───────────────┐
            │ Store Token   │
            │ in Capacitor  │
            │ Preferences   │
            └───────┬───────┘
                    │
                    ▼
            ┌───────────────┐
            │  Navigate to  │
            │     Home      │
            └───────────────┘
```

### 2. CRUD Operations (Notes)

```
┌─────────┐         ┌─────────┐         ┌──────────┐
│  User   │────────▶│  Home   │────────▶│  NgRx    │
│  Action │         │  Page   │         │  Action  │
└─────────┘         └─────────┘         └────┬─────┘
                                              │
                    ┌─────────────────────────┘
                    │
                    ▼
            ┌───────────────┐
            │   Effect      │
            │   Intercepts  │
            └───────┬───────┘
                    │
                    ▼
            ┌───────────────┐
            │   API Call    │
            │ with JWT      │
            └───────┬───────┘
                    │
                    ▼
            ┌───────────────┐
            │   Backend     │
            │   Validates   │
            │   JWT + Data  │
            └───────┬───────┘
                    │
                    ▼
            ┌───────────────┐
            │   Prisma ORM  │
            │   DB Query    │
            └───────┬───────┘
                    │
                    ▼
            ┌───────────────┐
            │   Response    │
            └───────┬───────┘
                    │
                    ▼
            ┌───────────────┐
            │   Effect      │
            │   Success     │
            └───────┬───────┘
                    │
                    ▼
            ┌───────────────┐
            │   Reducer     │
            │   Updates     │
            │   State       │
            └───────┬───────┘
                    │
                    ▼
            ┌───────────────┐
            │   Component   │
            │   Re-renders  │
            └───────────────┘
```

## 🔐 Sécurité

### Backend

1. **Authentification JWT**
   - Token signé avec secret
   - Expiration configurée (7 jours par défaut)
   - Stockage côté client uniquement

2. **Validation des Données**
   ```typescript
   // Exemple avec Zod
   const createGradeSchema = z.object({
     score: z.number().min(0).max(20),
     course: z.string().min(1),
     semester: z.number().int().min(1).max(10)
   });
   ```

3. **Hachage des Mots de Passe**
   ```typescript
   // bcrypt avec 10 rounds de salt
   const hashedPassword = await bcrypt.hash(password, 10);
   ```

4. **Helmet.js**
   - Protection contre les vulnérabilités web communes
   - Headers de sécurité HTTP

5. **CORS**
   - Configuration stricte des origines autorisées
   - Support des credentials

### Frontend

1. **Stockage Sécurisé**
   ```typescript
   // Capacitor Preferences (chiffré sur mobile)
   await Preferences.set({ key: 'token', value: token });
   ```

2. **Guards de Route**
   ```typescript
   // Protection des routes authentifiées
   { path: 'tabs', canActivate: [AuthGuard] }
   ```

3. **Validation Côté Client**
   - Angular Reactive Forms avec validators
   - Feedback immédiat à l'utilisateur

## 🎯 Principes de Design

### SOLID

✅ **Single Responsibility** : Chaque classe/fonction a une seule responsabilité  
✅ **Open/Closed** : Ouvert à l'extension, fermé à la modification  
✅ **Liskov Substitution** : Les interfaces sont respectées  
✅ **Interface Segregation** : Interfaces petites et spécifiques  
✅ **Dependency Inversion** : Dépendance sur les abstractions

### Clean Code

- Variables et fonctions avec des noms explicites
- Fonctions courtes et focalisées
- Pas de duplication de code (DRY)
- Commentaires seulement quand nécessaire
- Tests unitaires (à implémenter)

### Performance

**Backend:**
- Queries Prisma optimisées avec `select`
- Index sur les colonnes fréquemment requêtées
- Connection pooling PostgreSQL

**Frontend:**
- Lazy loading des modules Angular
- OnPush change detection strategy
- Memoization avec selectors NgRx
- Virtual scrolling pour grandes listes

## 📊 Gestion d'État

### Pourquoi NgRx ?

1. **État prévisible** : Single source of truth
2. **Debugging** : Redux DevTools
3. **Time-travel debugging** : Rejeu des actions
4. **Testabilité** : Pure functions
5. **Scalabilité** : Architecture éprouvée

### Flow NgRx Simplifié

```typescript
// 1. Component dispatche une action
store.dispatch(loadGrades());

// 2. Effect intercepte et appelle l'API
this.actions$.pipe(
  ofType(loadGrades),
  switchMap(() => this.api.getAllGrades())
)

// 3. Success dispatché avec les données
return loadGradesSuccess({ grades });

// 4. Reducer met à jour le state
on(loadGradesSuccess, (state, { grades }) => ({
  ...state,
  grades
}))

// 5. Component reçoit via selector
this.grades$ = store.select(selectAllGrades);
```

## 🚀 Scalabilité

### Backend

Pour faire évoluer l'application :

1. **Ajouter un nouveau module**
   ```
   src/
   ├── controllers/courses.controller.ts
   ├── routes/courses.routes.ts
   └── validators/courses.schemas.ts
   ```

2. **Ajouter une nouvelle table Prisma**
   ```prisma
   model Course {
     id    String @id @default(uuid())
     name  String
     // ...
   }
   ```

3. **Scaling horizontal**
   - Load balancer devant plusieurs instances Node.js
   - PostgreSQL avec réplication

### Frontend

1. **Nouveau feature store**
   ```
   store/
   └── courses/
       ├── courses.actions.ts
       ├── courses.effects.ts
       ├── courses.reducer.ts
       └── courses.selectors.ts
   ```

2. **Nouvelle page**
   ```
   pages/
   └── courses/
       └── courses.page.ts
   ```

## 🧪 Testing (À Implémenter)

### Backend
- Jest pour les tests unitaires
- Supertest pour les tests d'intégration
- Coverage > 80%

### Frontend
- Jasmine + Karma pour les tests unitaires
- Protractor/Cypress pour les tests E2E
- Coverage > 80%

## 📚 Ressources

- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [NgRx Best Practices](https://ngrx.io/guide/store)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

**Cette architecture garantit maintenabilité, testabilité et évolutivité ! 🏗️**
