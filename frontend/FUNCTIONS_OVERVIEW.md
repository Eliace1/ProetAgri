# Vue d'ensemble des fonctions (frontend/src)

Ce document recense les fonctions exportées dans le frontend, avec une brève description et les fichiers où elles sont utilisées.

Note: la liste des utilisations est extraite statiquement via recherche de symboles. Elle peut omettre certains usages dynamiques.

---

## `src/lib/auth.js`

- **saveUser(user)**
  - Description: Stocke l'objet utilisateur dans `localStorage` sous la clé interne.
  - Utilisé dans: `src/pages/ProfilAgriculteur.jsx`, `src/pages/ProfileSettings.jsx`, `src/components/Navbar.jsx`, `src/pages/ClientDashboard.jsx`, `src/api/orders.js`, `src/api/client.js`, `src/components/Header.jsx`, `src/components/Hero.jsx`, `src/components/HeroSection.jsx`, `src/components/ProductsGrid.jsx`, `src/components/ProtectedRoute.jsx`, `src/components/login.jsx`, `src/components/products.jsx`, `src/pages/Checkout.jsx`, `src/pages/Marketplace.jsx`, `src/pages/Register.jsx`

- **saveAuth(user, token)**
  - Description: Enregistre l'utilisateur et le token d'authentification dans `localStorage`.
  - Utilisé dans: mêmes contextes que `saveUser` (gestion auth dans UI et API).

- **getUser()**
  - Description: Récupère l'utilisateur courant depuis `localStorage` (ou `null`).
  - Utilisé dans: `src/pages/ProfilAgriculteur.jsx`, `src/pages/ProfileSettings.jsx`, `src/components/Navbar.jsx`, `src/pages/ClientDashboard.jsx`, `src/api/orders.js`, `src/api/client.js`, `src/components/Header.jsx`, `src/components/Hero.jsx`, `src/components/HeroSection.jsx`, `src/components/ProductsGrid.jsx`, `src/components/ProtectedRoute.jsx`, `src/components/login.jsx`, `src/components/products.jsx`, `src/pages/Checkout.jsx`, `src/pages/Marketplace.jsx`, `src/pages/Register.jsx`

- **getToken()**
  - Description: Récupère le token d'authentification (chaîne vide si absent).
  - Utilisé dans: `src/api/client.js` (intercepteur Axios), autres composants liés à auth (cf. liste ci-dessus).

- **isLoggedIn()**
  - Description: Retourne `true` si un utilisateur est présent (basé sur `getUser()`).
  - Utilisé dans: composants de navigation/route protégée et pages (cf. liste ci-dessus).

- **logout()**
  - Description: Supprime utilisateur et token, puis émet l'évènement `auth:changed` (UI peut réagir, ex. `Navbar`).
  - Utilisé dans: pages/composants gérant la déconnexion (cf. liste ci-dessus).

- **authHeader()**
  - Description: Construit l'en-tête `Authorization` Bearer à partir du token.
  - Utilisé dans: appels API nécessitant authentification (ex. via Axios custom).

---

## `src/lib/cart.js`

- **getCart()**
  - Description: Lit le panier depuis `localStorage` et retourne un tableau d'items.
  - Utilisé dans: `src/pages/Orders.jsx`, `src/pages/Payment.jsx`, `src/components/ProductsGrid.jsx`, `src/components/products.jsx`, `src/pages/Checkout.jsx`, `src/pages/Marketplace.jsx`

- **saveCart(items)**
  - Description: Sauvegarde le panier (tableau) dans `localStorage`.
  - Utilisé dans: mêmes écrans que `getCart` lors des modifications du panier.

- **addToCart(product, qty = 1)**
  - Description: Ajoute un produit (ou incrémente la quantité) dans le panier puis sauvegarde.
  - Utilisé dans: `src/components/ProductsGrid.jsx`, `src/components/products.jsx`, `src/pages/Checkout.jsx`, `src/pages/Marketplace.jsx`

---

## `src/lib/utils.js`

- **cn(...inputs)**
  - Description: Fusion utilitaire de classes CSS en combinant `clsx` et `tailwind-merge`.
  - Utilisé dans: `src/components/ui/card.jsx`, `src/components/ui/button.jsx`

---

## `src/lib/api.js`

- **fetchProducts()**
  - Description: Récupère la liste des produits depuis l'API backend (`GET /products`).
  - Utilisé dans: `src/components/products.jsx`, `src/components/ProductsGrid.jsx`

- **fetchCategories()**
  - Description: Récupère la liste des catégories depuis l'API backend (`GET /categories`).
  - Utilisé dans: `src/components/products.jsx`

---

## `src/api/client.js`

- **api (Axios instance)**
  - Description: Client Axios configuré avec `baseURL` et intercepteurs.
    - Intercepteur requête: Ajoute `Authorization: Bearer <token>` si présent via `getToken()`.
    - Intercepteur réponse: Normalise les erreurs pour l'UI ({ status, data, message, raw }).
  - Utilisé dans: `src/api/auth.js` (post login/register), potentiellement autres modules d'API.

---

## `src/api/auth.js`

- **registerUser(payloadOrFormData, hasFiles = false)**
  - Description: Inscription utilisateur. `hasFiles=true` pour payload multi-part, sinon JSON.
  - Utilisé dans: `src/pages/Register.jsx`

- **loginUser(identifier, password)**
  - Description: Connexion utilisateur via identifiant + mot de passe.
  - Utilisé dans: écrans d'auth et formulaires (ex. `src/pages/Register.jsx` intègre login post-register selon logique UI).

---

## `src/api/orders.js`

- Fonctions internes (non exportées): `load()`, `save(list)`, `buyerKey(u)`.

- **listMyOrders()**
  - Description: Liste des commandes de l'utilisateur courant à partir du stockage local.
  - Utilisé dans: `src/pages/ClientDashboard.jsx`

- **addOrder(order)**
  - Description: Crée et enregistre une commande locale (id, buyerKey, status, total, items, createdAt).
  - Utilisé dans: `src/pages/Payment.jsx`

- **cancelOrder(id)**
  - Description: Annule une commande si son statut est encore "En attente".
  - Utilisé dans: gestion de commandes côté acheteur (ex. Dashboard/Orders).

- **ORDER_STATUS**
  - Description: Enum des statuts: `En attente`, `En préparation`, `Livrée`, `Annulée`.
  - Utilisé dans: `src/pages/ClientDashboard.jsx`, `src/pages/Payment.jsx`

- **updateOrderStatus(id, status)**
  - Description: Met à jour le statut d'une commande si le statut fourni est valide.
  - Utilisé dans: flux futur agriculteur / gestion de commandes.

---

## Fonctions locales dans les pages et composants (handlers/helpers)

Ces fonctions ne sont pas exportées globalement, mais sont importantes pour la logique UI locale.

- **`src/pages/ProfilAgriculteur.jsx`**
  - `saveNotifications(next)`: persiste les notifications (localStorage) et émet `notifications:changed`.
  - `addNotification(title)`: ajoute une notification (si activées dans le profil).
  - `removeNotification(id)`: supprime une notification par id.
  - `markAllRead()`: marque toutes les notifications comme lues.
  - `clearAllNotifications()`: vide la liste des notifications.
  - `saveUser(next)`: helper local pour mettre à jour l'utilisateur, persister via `saveAuth()` et émettre `auth:changed`.
  - `persistProducts(next)`: persiste les produits de l'agriculteur et émet `products:changed`.
  - `persistSales(next)`: persiste les données de ventes (localStorage).
  - `handleAddProduct(prod)`: ajoute un produit, ferme le formulaire, notifie.
  - `handleEditProduct(prod)`: édite un produit existant, ferme le formulaire, notifie.
  - `handleDeleteProduct(id)`: confirme, supprime le produit, notifie.
  - `handleAvatarChange(file, onSaveCallback)`: lit le fichier, met à jour l'avatar, persiste, notifie.
  - `toggleNotifications()`: active/désactive le paramètre notifications de l'utilisateur (persiste via `saveUser`).
  - `handleDeleteAccount()`: confirme et supprime le compte local (clear produits/notifs), logout, navigation.
  - `formatPrice(v)`: formate un nombre en prix "xx,xx€".

- **`src/pages/ClientDashboard.jsx`**
  - `badge(status)`: renvoie un badge stylé selon le statut de commande.
  - `onChange(e)`: binding contrôlé du formulaire profil.
  - `onSaveProfile(e)`: merge et persiste le profil via `saveAuth`, feedback léger.
  - `onAvatarChange(e)`: charge une image et met à jour l'avatar du formulaire.
  - `onCancelOrder(id)`: annule une commande puis recharge via `listMyOrders()`.
  - `card()`, `cardTitle()`, `thTd(isBody, align)`: helpers de style inline.
  - `polarToCartesian(cx, cy, r, angle)`, `arcPath(...)`: helpers SVG.
  - `Donut({ data, sum })`: petit composant local pour le donut chart.

- **`src/pages/Orders.jsx`**
  - `updateAndPersist(next)`: met à jour le panier, persiste, émet `cart:add`, et si panier vidé enregistre une "vente" locale.
  - `getSalesKey()`: génère une clé locale de ventes liée à l'utilisateur.
  - `inc(id)`, `dec(id)`: incrémente/décrémente la quantité d'un item.
  - `changeQty(id, v)`: met une quantité valide (>=1) et persiste.
  - `removeItem(id)`: retire un item du panier et persiste.
  - `btnQty()`, `btnRemove()`: helpers de style inline pour les contrôles de quantité.

- **`src/pages/Marketplace.jsx`**
  - `getAllProducts()`: agrège les produits depuis toutes les clés `products_*` du localStorage.
  - Gestion du compteur panier via écoute d'événements `cart:add` et `storage`.

- **`src/components/Navbar.jsx`**
  - `isActive(path)`: indique si la route courante correspond au lien.
  - `updateQuery(v)`: met à jour le paramètre de recherche `q` dans l'URL.

- **`src/components/ProductsGrid.jsx`**
  - `formatPrice(p)`: formatage prix.
  - `onAdd(product)`: vérifie l'auth (`isLoggedIn()`), ajoute au panier (`addToCart()`), émet `cart:add`.
  - `getFarmName(p)`: récupère un nom d'exploitation selon plusieurs champs possibles.
  - Note: un loader interne `load()` récupère les produits (via `fetchProducts`) au montage.

- **`src/pages/Checkout.jsx`**
  - `onChange(e)`: binding du formulaire d'adresse.
  - `onSubmit(e)`: valide l'adresse, sauvegarde dans `sessionStorage`, redirige vers `/paiement`.

- **`src/pages/Payment.jsx`**
  - `pay()`: simule un paiement réussi, crée une commande locale via `addOrder()`, vide le panier, redirige vers `/client`.

- **`src/components/ui/button.jsx`**
  - `buttonVariants(...)` (via `cva`): variations de styles de bouton Tailwind.
  - `Button` (forwardRef): composant bouton utilisant `cn()` et `buttonVariants`.

- **`src/components/ui/card.jsx`**
  - `Card`, `CardHeader`, `CardFooter`, `CardTitle`, `CardDescription`, `CardContent` (forwardRef): composants UI de carte utilisant `cn()`.

---

# Notes complémentaires

- Les composants React (export default) ne sont pas listés ici pour garder le focus sur les fonctions utilitaires/API. Si vous souhaitez une cartographie des composants (définition + où ils sont utilisés), dites-le moi et je l'ajouterai.
- Les chemins mentionnés sont relatifs au dossier `frontend/`.
