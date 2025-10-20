# FarmLink — Tech Overview

## 1) Architecture rapide
- **Framework**: React + react-router-dom
- **State local**: Hooks (`useState`, `useEffect`, `useMemo`)
- **Stockage**: localStorage (auth, panier), sessionStorage (infos checkout)
- **Styles**: `src/index.css` (CSS utilitaire + composants)

## 2) Routes clés (`src/App.jsx`)
- `/` Accueil (Hero, Categories, Products, Footer)
- `/marche` Marketplace (filtres + grille produits)
- `/commandes` Panier (protégé)
- `/checkout` Adresse + récap commande (protégé)
- `/paiement` Paiement + création commande (protégé)
- `/client` Dashboard client (protégé)
- `/profil` Paramètres du profil (protégé)
- `/login`, `/inscription`, `/apropos`, `/contact`

> Les routes protégées sont enveloppées par `ProtectedRoute`.

## 3) Modules importants
- `src/lib/auth.js`
  - `saveAuth(user, token)`, `getUser()`, `logout()`, `authHeader()`
- `src/lib/cart.js`
  - `getCart()`, `saveCart(items)`, `addToCart(product, qty)`
  - L'événement `cart:add` est déclenché par les composants (`Orders.jsx`, `ProductsGrid.jsx`) lors des actions panier
- `src/api/orders.js`
  - `addOrder(order)`, `listMyOrders()`, `cancelOrder(id)` (mock/locale prêt à brancher backend)
- `src/lib/api.js`
  - `fetchProducts()`, `fetchCategories()` utilisent `import.meta.env.VITE_API_URL` comme base (`/api`)

## 4) Pages et composants
- `Marketplace.jsx` + `FiltersSidebar.jsx` + `ProductsGrid.jsx`
  - Filtres: catégories + prix. Disponibilité retirée.
  - `ProductsGrid` affiche le nom de la ferme via `getFarmName(p)` (robuste à plusieurs champs).
- `Orders.jsx`
  - Gestion du panier (quantités, suppression, total)
- `Checkout.jsx`
  - Formulaire adresse + récapitulatif "Votre commande" (liste + total)
- `Payment.jsx`
  - Choix méthode paiement; `pay()` appelle `addOrder()`, vide panier, redirige `/client`
- `ClientDashboard.jsx`
  - Avatar visible à gauche du titre, cartes KPI, historique commandes
- `ProfileSettings.jsx`
  - Édition du profil (nom, email, adresse, téléphone) + upload avatar (FileReader base64), changement MDP (placeholder), suppression de compte (logout)
- `Register.jsx`
  - Inscription Acheteur/Agriculteur, upload avatar (base64), suppression des uploads de documents
- `Navbar.jsx`
  - Lien "Mon compte" (si connecté), avatar dans header du marché, liens sans soulignement pour les boutons

## 5) Flux de données
- **Auth**
  1. `Register.jsx` ou `Login.jsx` → `saveAuth(user, token)` → `localStorage`
  2. `Navbar.jsx`, `ClientDashboard.jsx`, `ProfileSettings.jsx` lisent `getUser()`
- **Avatar**
  1. Input fichier → `FileReader.readAsDataURL()` → `form.avatar`
  2. Sauvegarde: `saveAuth({...user, avatar: form.avatar})`
  3. Affichage: `<img src={user.avatar || placeholder} />`
- **Panier → Commande**
  1. `ProductsGrid.jsx` → ajout au panier (`lib/cart.js`)
  2. `Orders.jsx` modifie items et calcule total
  3. `Checkout.jsx` montre récap + total, sauvegarde `checkout_info` en session
  4. `Payment.jsx` lit `getCart()` et `checkout_info`, crée ordre via `addOrder()`, vide panier

## 6) Points UX appliqués
- Liens-boutons sans soulignement (ex: `Orders.jsx`) via `textDecoration: 'none'`
- Remplacement du label nav "Acheteur" par "Mon compte"
- Récapitulatif commande visible au checkout

## 7) FAQ techniques
- **Où changer la logique des routes protégées ?** `src/components/ProtectedRoute.jsx`
- **Comment ajouter une route ?** Importer la page dans `App.jsx` et ajouter `<Route path="/x" element={<Composant/>}/>` (avec `ProtectedRoute` si nécessaire)
- **Comment brancher un backend ?**
  - Utiliser `src/lib/api.js` (base `VITE_API_URL`) pour centraliser les appels REST (`/products`, `/categories`).
  - Pour les endpoints nécessitant auth, ajouter `Authorization: Bearer <token>` via `authHeader()` ou l'instance Axios dédiée.
- **Comment limiter la taille des avatars ?**
  - Avant sauvegarde, compresser/redimensionner (ex: canvas) puis convertir en Data URL

## 8) Snippets fréquents
```jsx
// Lire l'utilisateur connecté
import { getUser, saveAuth } from "./lib/auth";
const user = getUser();
saveAuth({ ...user, avatar: newAvatar }, token);
```
```jsx
// Total panier
const total = useMemo(() => items.reduce((s, it) => s + (it.price||0)*(it.qty||1), 0), [items]);
```

## 9) À brancher ensuite
- Auth réelle (API) et stockage token
- Paiements (Stripe/Mobile Money) + facture
- Dashboard producteur complet (stocks/commandes)

---
Ce document sert de guide pour répondre rapidement aux questions de code (où, quoi, comment). 
Si tu veux une version encore plus courte pour un pitch technique, je peux générer un one-pager.
