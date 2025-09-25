<?php

use App\Http\Controllers\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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


// Route::apiResource('/',ProductController::class,'index');
