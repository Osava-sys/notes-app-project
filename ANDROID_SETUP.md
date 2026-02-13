# 📱 Configuration Android

Guide complet pour configurer et builder l'application Android.

## 🔧 Prérequis

### 1. Installer Android Studio

Téléchargez et installez Android Studio : https://developer.android.com/studio

### 2. Installer Java JDK

```bash
# Vérifier l'installation
java -version

# Doit afficher Java 17 ou supérieur
```

### 3. Variables d'environnement

Ajoutez ces variables à votre système :

**Windows:**
```
ANDROID_HOME=C:\Users\VotreNom\AppData\Local\Android\Sdk
JAVA_HOME=C:\Program Files\Java\jdk-17
```

**macOS/Linux:**
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-17.jdk/Contents/Home
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

## 🚀 Premier Build

### 1. Initialiser le projet Android

```bash
cd frontend

# Build du projet web
npm run build:prod

# Ajouter la plateforme Android (première fois seulement)
npx cap add android

# Synchroniser les fichiers
npx cap sync
```

### 2. Configurer les icônes et splash screen

#### Icônes de l'app

Placez vos icônes dans :
```
frontend/android/app/src/main/res/
├── mipmap-hdpi/
├── mipmap-mdpi/
├── mipmap-xhdpi/
├── mipmap-xxhdpi/
└── mipmap-xxxhdpi/
```

Tailles recommandées :
- mdpi: 48x48px
- hdpi: 72x72px
- xhdpi: 96x96px
- xxhdpi: 144x144px
- xxxhdpi: 192x192px

#### Splash Screen

Créez les splash screens dans :
```
frontend/android/app/src/main/res/
└── drawable/
    └── splash.png (1080x1920px)
```

### 3. Build APK Debug

```bash
# Méthode 1 : Avec npm script
npm run android:build

# Méthode 2 : Manuellement
cd android
./gradlew assembleDebug
cd ..
```

**APK généré dans :** `android/app/build/outputs/apk/debug/app-debug.apk`

### 4. Build APK Release (Signé)

#### a. Créer un keystore

```bash
keytool -genkey -v -keystore notes-app.keystore -alias notes-app -keyalg RSA -keysize 2048 -validity 10000
```

Sauvegardez précieusement :
- Le fichier `notes-app.keystore`
- Le mot de passe du keystore
- Le mot de passe de la clé

#### b. Configurer Gradle

Créez `frontend/android/key.properties` :

```properties
storePassword=votre_mot_de_passe_keystore
keyPassword=votre_mot_de_passe_cle
keyAlias=notes-app
storeFile=../notes-app.keystore
```

⚠️ **N'ajoutez JAMAIS ce fichier dans Git !**

#### c. Modifier build.gradle

Éditez `frontend/android/app/build.gradle` :

```gradle
// Avant android {
def keystorePropertiesFile = rootProject.file("key.properties")
def keystoreProperties = new Properties()
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    ...
    
    signingConfigs {
        release {
            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
            storeFile file(keystoreProperties['storeFile'])
            storePassword keystoreProperties['storePassword']
        }
    }
    
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

#### d. Build release

```bash
npm run android:release

# Ou manuellement
cd android
./gradlew assembleRelease
```

**APK signé dans :** `android/app/build/outputs/apk/release/app-release.apk`

## 🎨 Personnalisation

### Nom de l'application

Éditez `frontend/android/app/src/main/res/values/strings.xml` :

```xml
<resources>
    <string name="app_name">Notes App</string>
    <string name="title_activity_main">Notes App</string>
</resources>
```

### Package name

⚠️ À faire AVANT le premier build !

1. Éditez `frontend/capacitor.config.ts` :
```typescript
appId: 'com.votreentreprise.notesapp'
```

2. Renommez les dossiers dans `android/app/src/main/java/` pour correspondre

### Permissions

Éditez `frontend/android/app/src/main/AndroidManifest.xml` :

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

### Version de l'app

Éditez `frontend/android/app/build.gradle` :

```gradle
android {
    defaultConfig {
        versionCode 1      // Incrémentez à chaque release
        versionName "1.0.0"  // Version affichée
    }
}
```

## 🔍 Debugging

### Logs Android

```bash
# Terminal 1: Démarrer l'app
npx cap run android

# Terminal 2: Voir les logs
adb logcat | grep "Capacitor"
```

### Chrome DevTools

1. Lancez l'app sur un appareil/émulateur
2. Ouvrez Chrome : `chrome://inspect`
3. Cliquez sur "inspect" sous votre app

## 📱 Test sur Appareil

### 1. Activer le mode développeur

Sur votre téléphone Android :
1. Paramètres > À propos du téléphone
2. Appuyez 7 fois sur "Numéro de build"
3. Paramètres > Options pour les développeurs
4. Activez "Débogage USB"

### 2. Connecter et tester

```bash
# Vérifier la connexion
adb devices

# Installer l'APK
adb install android/app/build/outputs/apk/debug/app-debug.apk

# Ou lancer directement
npx cap run android
```

## 🚀 Publication Play Store

### 1. Préparer les assets

- Icône haute résolution (512x512px)
- Screenshots (phone, tablette, TV si applicable)
- Bannière (1024x500px)
- Vidéo de présentation (optionnel)

### 2. Informations requises

- Description courte (80 caractères max)
- Description complète (4000 caractères max)
- Catégorie de l'app
- Classification du contenu
- Politique de confidentialité (URL)

### 3. Upload de l'APK

1. Créez un compte Google Play Console
2. Créez une nouvelle application
3. Uploadez l'APK signé
4. Remplissez toutes les informations
5. Soumettez pour révision

### 4. App Bundle (recommandé)

Au lieu d'un APK, créez un AAB :

```bash
cd android
./gradlew bundleRelease
```

**AAB dans :** `android/app/build/outputs/bundle/release/app-release.aab`

## 🔧 Dépannage

### Erreur de build Gradle

```bash
cd android
./gradlew clean
./gradlew build
```

### Problèmes de certificat

```bash
# Lister les certificats
keytool -list -v -keystore notes-app.keystore
```

### Capacitor non synchronisé

```bash
npx cap sync android
```

### Erreur de SDK

Ouvrez Android Studio > SDK Manager et installez :
- Android SDK Platform 33 (ou supérieur)
- Android SDK Build-Tools
- Android SDK Command-line Tools

## 📊 Optimisation

### Réduire la taille de l'APK

Dans `android/app/build.gradle` :

```gradle
android {
    buildTypes {
        release {
            minifyEnabled true
            shrinkResources true
        }
    }
    
    splits {
        abi {
            enable true
            reset()
            include 'armeabi-v7a', 'arm64-v8a'
            universalApk false
        }
    }
}
```

### Obfuscation ProGuard

Créez/éditez `android/app/proguard-rules.pro` pour protéger votre code.

## 📝 Checklist Pre-Release

- [ ] Version incrémentée dans build.gradle
- [ ] APK signé avec le keystore de production
- [ ] Testé sur plusieurs appareils/versions Android
- [ ] Permissions minimales dans AndroidManifest
- [ ] Icônes et splash screen personnalisés
- [ ] Pas de console.log sensibles dans le code
- [ ] Variables d'environnement de production configurées
- [ ] Tests de performance effectués
- [ ] Backup du keystore en lieu sûr

---

**Bonne chance pour votre publication ! 🚀**
