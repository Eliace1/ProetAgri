<?php

namespace App\Http\Controllers;

use App\Models\Categorie;
use Illuminate\Http\JsonResponse;

class CategorieController extends Controller
{
    /**
     * Affiche toutes les catégories.
     */
    public function index(): JsonResponse
    {
        $categories = Categorie::select('id', 'name', 'description')->get();

        return response()->json($categories);
    }
}