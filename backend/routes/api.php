<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;




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


//Route::apiResource('/',ProductController::class,'index');
Route::get('/', [ProductController::class, 'index']); // GET /api/ -> index()

// Accès public pour la liste et les détails des produits
Route::get('products', [ProductController::class, 'index']); // GET /api/products -> index()
Route::get('products/{product}', [ProductController::class, 'show']); // GET /api/products/1 -> show(1)

//  3. CRUD PRODUITS (ROUTES PROTÉGÉES) 
// Ces routes nécessitent d'être connecté (authentifié via le token Sanctum).
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});

// Auth
Route::post('/auth/register', [AuthController::class, 'register']);

