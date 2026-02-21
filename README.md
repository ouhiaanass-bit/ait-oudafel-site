# 🤝 Société Ait Oudafel — Site de collecte de dons

## 📁 Structure du projet

```
ait-oudafel-site/
├── index.html          ← Page d'entrée principale
├── vite.config.js      ← Configuration Vite
├── package.json        ← Dépendances du projet
├── public/
│   └── favicon.svg     ← Icône du site
└── src/
    ├── main.jsx        ← Point d'entrée React
    └── App.jsx         ← Application principale
```

---

## 🚀 Installation & Lancement

### Pré-requis
- **Node.js** version 18 ou plus → https://nodejs.org/
- **npm** (inclus avec Node.js)

### Étapes

```bash
# 1. Ouvrez un terminal dans le dossier du projet
cd ait-oudafel-site

# 2. Installez les dépendances
npm install

# 3. Lancez le site en mode développement (prévisualisation locale)
npm run dev
# → Ouvrez http://localhost:5173 dans votre navigateur

# 4. Créez la version finale pour l'hébergement
npm run build
# → Un dossier "dist/" est créé avec le site prêt à déployer
```

---

## 🌐 Déploiement sur Vercel (Recommandé — Gratuit)

### Option A : Drag & Drop (le plus simple)
1. Lancez `npm run build` → un dossier **`dist/`** est créé
2. Allez sur **https://vercel.com** et créez un compte gratuit
3. Sur le dashboard, cliquez **"Add New Project"**
4. Glissez-déposez le dossier **`dist/`** directement
5. ✅ Votre site est en ligne en 2 minutes !

### Option B : Via GitHub (recommandé pour les mises à jour)
1. Créez un compte sur **https://github.com**
2. Créez un nouveau dépôt et uploadez tous les fichiers du projet
3. Sur Vercel, importez le dépôt GitHub
4. Vercel détecte automatiquement Vite et configure tout
5. À chaque modification sur GitHub → le site se met à jour automatiquement !

---

## 💳 Ajouter un vrai système de paiement

### Stripe (recommandé)
1. Créez un compte sur **https://stripe.com**
2. Récupérez votre **clé publique** (`pk_live_...`)
3. Dans `src/App.jsx`, remplacez la section commentée `TODO` par :

```jsx
import { loadStripe } from '@stripe/stripe-js';

const stripe = await loadStripe("pk_live_VOTRE_CLE_ICI");
// Voir documentation : https://stripe.com/docs/payments
```

### PayPal
1. Créez un compte **PayPal Business** sur https://paypal.com
2. Intégrez le bouton PayPal Donate dans le formulaire
3. Documentation : https://developer.paypal.com/docs/donate/

---

## 🌍 Nom de domaine personnalisé

Pour avoir une adresse comme `aitoudafel-charite.org` :
1. Achetez un domaine sur **Namecheap.com** (~10-15€/an)
2. Dans Vercel → Settings → Domains → ajoutez votre domaine
3. Suivez les instructions DNS de Vercel

---

## ✏️ Personnalisation

Dans `src/App.jsx`, vous pouvez modifier :
- `const GOAL = 50000;` → Changez l'objectif de collecte
- `const impacts = [...]` → Mettez à jour vos statistiques réelles
- `const testimonials = [...]` → Ajoutez de vrais témoignages
- `const [donated, setDonated] = useState(27430);` → Montant de départ

---

## 📧 Contact & Support

Pour toute question, contactez votre développeur ou consultez :
- Documentation Vite : https://vitejs.dev
- Documentation React : https://react.dev
- Documentation Vercel : https://vercel.com/docs
