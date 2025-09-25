<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;




/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Route de test de connexion
Route::get('/test', function () {
    return response()->json([
        'message' => 'API Laravel connectée avec succès!',
        'status' => 'success',
        'timestamp' => now()
    ]);
});

// Route pour les données de la page d'accueil
Route::get('/homepage-data', function () {
    return response()->json([
        'title' => 'Connecter agriculteurs et acheteurs',
        'description' => 'FarmLink est votre marché en ligne dédié aux produits agricoles frais et locaux. Découvrez une large gamme de produits, soutenez les fermes de votre région et savourez la qualité.',
        'features' => [
            'Produits frais et locaux',
            'Soutien aux agriculteurs',
            'Qualité garantie',
            'Livraison rapide'
        ],
        'stats' => [
            'farmers' => 150,
            'products' => 500,
            'customers' => 2500
        ]
    ]);
});

// Route pour obtenir les agriculteurs
Route::get('/farmers', function () {
    return response()->json([
        'data' => [
            [
                'id' => 1,
                'name' => 'Ferme Martin',
                'location' => 'Occitanie',
                'speciality' => 'Légumes bio',
                'rating' => 4.8
            ],
            [
                'id' => 2,
                'name' => 'Domaine des Oliviers',
                'location' => 'Provence',
                'speciality' => 'Huile d\'olive',
                'rating' => 4.9
            ]
        ]
    ]);
});

// Route pour obtenir les produits
Route::get('/products', function () {
    return response()->json([
        'data' => [
            [
                'id' => 1,
                'name' => 'Tomates cerises bio',
                'price' => 4.50,
                'unit' => 'kg',
                'farmer' => 'Ferme Martin',
                'image' => '/images/tomatoes.jpg'
            ],
            [
                'id' => 2,
                'name' => 'Huile d\'olive extra vierge',
                'price' => 12.00,
                'unit' => 'bouteille 500ml',
                'farmer' => 'Domaine des Oliviers',
                'image' => '/images/olive-oil.jpg'
            ]
        ]
    ]);
});

// Routes authentifiées (à implémenter plus tard)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});

// Routes pour les commandes (exemple)
Route::prefix('orders')->group(function () {
    Route::get('/', function () {
        return response()->json(['message' => 'Liste des commandes']);
    });
    
    Route::post('/', function (Request $request) {
        return response()->json([
            'message' => 'Commande créée avec succès',
            'data' => $request->all()
        ], 201);
    });
});

// Routes pour le marché
Route::prefix('market')->group(function () {
    Route::get('/categories', function () {
        return response()->json([
            'data' => [
                ['id' => 1, 'name' => 'Légumes', 'icon' => '🥕'],
                ['id' => 2, 'name' => 'Fruits', 'icon' => '🍎'],
                ['id' => 3, 'name' => 'Céréales', 'icon' => '🌾'],
                ['id' => 4, 'name' => 'Produits laitiers', 'icon' => '🧀'],
                ['id' => 5, 'name' => 'Viandes', 'icon' => '🥩']
            ]
        ]);
    });
});

// Route pour les statistiques du tableau de bord
Route::get('/dashboard/stats', function () {
    return response()->json([
        'total_orders' => 1250,
        'active_farmers' => 150,
        'monthly_revenue' => 45000,
        'customer_satisfaction' => 4.7
    ]);
});