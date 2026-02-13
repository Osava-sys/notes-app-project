# 🚀 Guide de Démarrage Rapide

Ce guide vous permet de lancer l'application en moins de 10 minutes.

## ⚡ Installation Express

### 1. Prérequis

Vérifiez que vous avez :
```bash
node --version   # doit être >= 20
npm --version    # doit être >= 10
```

### 2. Backend en 3 commandes

```bash
cd backend
npm install
docker-compose up -d && npm run prisma:generate && npm run prisma:migrate && npm run dev
```

✅ Backend démarré sur http://localhost:3000

### 3. Frontend en 2 commandes

Ouvrez un nouveau terminal :

```bash
cd frontend
npm install && ionic serve
```

✅ Frontend démarré sur http://localhost:8100

## 🎯 Premier Test

1. Ouvrez http://localhost:8100
2. Cliquez sur "S'inscrire"
3. Créez un compte
4. Ajoutez votre première note !

## 📱 Build APK Rapide

```bash
cd frontend
npm run build:prod
npm run cap:sync
npm run android:build
```

APK disponible dans : `frontend/android/app/build/outputs/apk/debug/`

## 🔑 Comptes de Test

Si vous voulez tester sans créer de compte :

**Utilisateur 1**
- Email: `etudiant@test.com`
- Mot de passe: `password123`

(Créez ce compte via l'inscription)

## 🐛 Problèmes Courants

### Le backend ne démarre pas ?

```bash
# Vérifier que PostgreSQL est lancé
docker ps

# Si non, relancer
docker-compose up -d
```

### Le frontend affiche une erreur de connexion ?

Vérifiez que :
1. Le backend tourne sur le port 3000
2. Dans `frontend/src/environments/environment.ts`, l'URL est correcte

### Erreur Prisma ?

```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
```

## 📊 Variables d'Environnement

### Backend (.env)

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/notes_app"
JWT_SECRET="votre-secret-super-securise"
PORT=3000
```

### Frontend (environment.ts)

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

## 🎨 Personnalisation Rapide

### Changer les couleurs

Éditez `frontend/tailwind.config.js` :

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#votre-couleur',
      }
    }
  }
}
```

### Changer le nom de l'app

1. `frontend/capacitor.config.ts` : `appName`
2. `frontend/src/index.html` : `<title>`
3. `frontend/src/manifest.json` : `name`

## 📖 Prochaines Étapes

1. ✅ Lisez le README.md complet
2. ✅ Explorez l'architecture du code
3. ✅ Testez toutes les fonctionnalités
4. ✅ Personnalisez l'interface
5. ✅ Générez votre APK final

## 💡 Astuces Pro

### Développement rapide

Utilisez deux terminaux en parallèle :
- Terminal 1 : `cd backend && npm run dev`
- Terminal 2 : `cd frontend && ionic serve`

### Rechargement automatique

Les deux serveurs se rechargent automatiquement à chaque modification !

### Debugging

- Backend : Console logs + Prisma Studio (`npm run prisma:studio`)
- Frontend : Chrome DevTools (F12)

## 🎓 Pour Aller Plus Loin

- Ajoutez des tests unitaires
- Implémentez la pagination
- Ajoutez des graphiques avec Chart.js
- Intégrez les notifications push
- Créez une version web (PWA)

---

**Bon développement ! 🚀**
