<?php

use App\Http\Controllers\ProductController;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategorieController;
use App\Http\Controllers\CommandeController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Route de test de connexion
Route::get('/test', function (Request $request) {
        return response()->json([
        'message' => 'API Laravel connectée avec succès!',
        'status' => 'success',
        'timestamp' => now()
    ]);
});


// Accès public pour la liste et les détails des produits

Route::get('products', [ProductController::class, 'index']); // GET /api/products -> index()
Route::get('products/{product}', [ProductController::class, 'show']); // GET /api/products/1 -> show(1)
Route::get('/categories', [CategorieController::class, 'index']);
//  3. CRUD PRODUITS (ROUTES PROTÉGÉES)
// Ces routes nécessitent d'être connecté (authentifié via le token Sanctum).
Route::middleware('auth:sanctum')->group(function () {

    // Routes pour la gestion des produits (Création, Modification, Suppression)
    Route::apiResource('products', ProductController::class)->only([
        'store',    // POST /api/products -> Crée un nouveau produit
        'update',   // PUT/PATCH /api/products/1 -> Met à jour un produit
        'destroy'   // DELETE /api/products/1 -> Supprime un produit
    ]);
    Route::get('/commandes',[CommandeController::class,'index']);
    Route::post('/createCommande',[CommandeController::class,'create']);
    Route::delete('/commande/{id}',[CommandeController::class,'destroy']);
    Route::put('/commande/{id}',[CommandeController::class,'update']);
    Route::post('/user/update',[AuthController::class,'update']);
    Route::post('/user/delete',[AuthController::class,'delete']);

});

//Route pour l'enregistrement
Route::post('/register',[AuthController::class,'signUp']);

//route pour le login
Route::post('/login',[AuthController::class,'signIn']);

Route::get('/createUser',[AuthController::class,'createUser']);

