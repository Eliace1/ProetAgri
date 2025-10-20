# Backend — Overview (Laravel)

Ce document résume l’API backend, les routes, contrôleurs, modèles, middlewares et validations.

---

## Stack et Auth
- **Framework**: Laravel (Sanctum pour tokens API)
- **Auth**: `AuthController` émet un token via `Sanctum` et le renvoie (avec un cookie `jwt`).
- **E-mails**: envoi de mail de bienvenue via `WelcomeMails` (cf. `App\Mail\WelcomeMails`).

---

## Routes
Fichier: `backend/routes/api.php`

- **GET `/api/test`**
  - Santé API. Retourne un JSON de confirmation.

- **GET `/api/products`** → `ProductController@index`
  - Liste des produits (avec catégorie) transformés pour le frontend.

- **GET `/api/products/{product}`** → `ProductController@show`
  - Détail d’un produit.

- **GET `/api/categories`** → `CategorieController@index`
  - Liste des catégories (id, name, description).

- Zone protégée `auth:sanctum` (token requis):
  - **POST `/api/products`** → `ProductController@store`
  - **PUT/PATCH `/api/products/{product}`** → `ProductController@update`
  - **DELETE `/api/products/{product}`** → `ProductController@destroy`

- **POST `/api/register`** → `AuthController@signUp`
- **POST `/api/login`** → `AuthController@signIn`

Fichier: `backend/routes/web.php`
- **GET `/`** → Vue `welcome`

---

## Contrôleurs

### `App\Http\Controllers\AuthController`
- **signUp(RegisterRequest $request)**
  - Valide, gère upload `profile` (disque `public`, défaut `profiles/default.png`), crée `User`, envoie mail de bienvenue.
  - Réponse: `{ message, user, status: 201 }` (HTTP 201)

- **signIn(LoginRequest $request)**
  - `Auth::attempt(email, password)`, génère un token Sanctum et le renvoie.
  - Réponse: `{ token, type: 'Bearer', message, status: 200 }` + cookie `jwt`.

### `App\Http\Controllers\ProductController`
- **index()**
  - `Product::with('categorie')->get()` puis mapping des champs: `id, name, price, qte, image, category (categorie.name), description`.

- **store(ProductRequest $request)** [protégée]
  - Requiert utilisateur `role === 'agriculteur'` (via `Auth::user()->role`).
  - Valide champs, upload image (`public/products`), crée `Product` (associe `user_id`).
  - Réponse 201 avec `{ message, product }`.

- **show(Product $product)**
  - Retourne le produit (200).

- **update(ProductRequest $request, Product $product)** [protégée]
  - Vérifie ownership: `Auth::id() === $product->user_id` sinon 403.
  - Valide, remplace image si fournie (supprime l’ancienne via `Storage::disk('public')`).
  - Réponse 200 avec `{ message, product }`.

- **destroy(Product $product)** [protégée]
  - Vérifie ownership, supprime image si besoin, supprime le produit.
  - Réponse 204 avec `{ message }`.

### `App\Http\Controllers\CategorieController`
- **index()**
  - Sélectionne `id, name, description` et retourne la liste.

---

## Form Requests (Validation)

### `App\Http\Requests\RegisterRequest`
- Règles principales:
  - `name: required|min:4`
  - `email: required|min:4|unique:users,email|email`
  - `password: required|confirmed|min:8|regex:[A-Z]|regex:[0-9]|regex:[@$!%*?&]`
  - `address: required|min:4`
  - `phone: required|regex:^0[1-9][0-9]{8}$`
  - `first_name: required|min:4`
  - `farmer, customer, admin`: boolean
- Messages personnalisés: `email.unique`, `password.confirmed|min|regex`, `phone`.

### `App\Http\Requests\LoginRequest`
- `email: required|email`
- `password: required|min:3`

### `App\Http\Requests\ProductRequest`
- Base:
  - `name: required|string|min:3|max:100`
  - `description: required|string|min:10|max:500`
  - `price: required|numeric|min:0.01`
  - `stock_quantity: required|integer|min:0`
  - `unit: required|string|in:kg,piece,litre,pack,botte`
  - `reduction: nullable|integer|min:0|max:100`
  - `image: nullable|image|max:2048`
- En `PUT/PATCH`: `name`/`description` deviennent `sometimes`.

---

## Middleware

### `App\Http\Middleware\RoleMiddlewareMiddleware`
- Vérifie `auth('sanctum')->check()` sinon 401.
- Autorise selon rôle:
  - `admin` → requiert `user()->admin`
  - `customer` → requiert `user()->customer`
  - `farmer` → requiert `user()->farmer`
- Sinon 403.

---

## Modèles (Eloquent)

### `App\Models\User`
- `fillable`: name, email, password, address, phone, first_name, farmer, customer, admin, profile, company_name, farm_address
- `hidden`: password, remember_token
- Relations:
  - `products()` → hasMany `Product`
  - `commandes()` → hasMany `Commande`

### `App\Models\Product`
- `fillable`: name, price, qte, image, description, reduction, user_id
- Relations:
  - `user()` → belongsTo `User`
  - `categorie()` → belongsTo `Categorie`
  - `commandes()` → belongsToMany `Commande` via pivot `commande_produit` (pivot: `quantite`, timestamps)

### `App\Models\Categorie`
- `fillable`: id, name, description

### `App\Models\Commande`
- `fillable`: total_amount, delivery_address, payment_method
- Relations:
  - `user()` → belongsTo `User`
  - `products()` → belongsToMany `Product` via `commande_produit` (pivot `quantite`, timestamps)

---

## Migrations détectées (aperçu)
- `0001_01_01_000000_create_users_table.php`
- `0001_01_01_000001_create_cache_table.php`
- `0001_01_01_000002_create_jobs_table.php`
- `2025_09_09_035335_create_categories_table.php`
- `2025_09_22_160038_products.php`
- `2025_10_01_102524_create_commandes_table.php`
- `2025_10_01_105606_create_commandes_products_table.php`

Remarque: ouvrir ces fichiers pour les colonnes exactes si besoin.

---

## Exemples d’appels (cURL)

- Authentification (login):
```bash
curl -X POST http://127.0.0.1:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"secret"}'
```

- Liste des produits (public):
```bash
curl http://127.0.0.1:8000/api/products
```

- Création produit (protégé):
```bash
curl -X POST http://127.0.0.1:8000/api/products \
  -H "Authorization: Bearer <TOKEN>" \
  -F name='Tomates' \
  -F description='Tomates bio' \
  -F price=3.5 \
  -F stock_quantity=10 \
  -F unit=kg \
  -F image=@/chemin/vers/image.jpg
```

---

## Intégration Frontend
- Le frontend utilise `src/lib/api.js` pour `fetchProducts()` et `fetchCategories()` pointant vers `VITE_BACKEND_URL`.
- L’instance Axios `src/api/client.js` utilise `VITE_API_URL` et attache `Authorization: Bearer <token>` depuis le storage (cf. `getToken()`).

---

## À valider / TODO
- Vérifier la cohérence des champs entre `ProductRequest` (stock_quantity, unit, reduction) et `Product` (qte, reduction) + migrations.
- Ajouter des endpoints pour commandes si besoin côté backend (création, listing par utilisateur) pour aligner avec le frontend.
