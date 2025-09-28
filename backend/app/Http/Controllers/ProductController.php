<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductRequest;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     * Affiche la liste de TOUS les produits (accessible à tous).
     */
    public function index()
    {
        // Récupère tous les produits disponibles de la base de données.
        return response()->json(Product::all(), 200);
    }

    /**
     * Store a newly created resource in storage.
     * Stocke un nouveau produit (Vérification : Rôle 'agriculteur').
     */
    public function store(ProductRequest $request)
    {
        // Récupère l'utilisateur connecté
        $user = Auth::user();

        // 1. VÉRIFICATION DU RÔLE : Seuls les agriculteurs peuvent ajouter des produits.
        if (!$user || $user->role !== 'agriculteur') {
            return response()->json(['message' => 'Accès refusé. Seuls les agriculteurs sont autorisés à ajouter des produits.'], 403);
        }
        
        // 2. Création du produit
        // Nous fusionnons les données validées de la requête avec l'ID de l'utilisateur connecté.
        $product = Product::create(array_merge($request->validated(), [
            'user_id' => $user->id,
        ]));
        
        return response()->json([
            'message' => 'Produit ajouté avec succès.',
            'product' => $product
        ], 201); // Code 201 pour "Created"
    }

    /**
     * Display the specified resource.
     * Affiche les détails d'un produit spécifique.
     */
    public function show(Product $product)
    {
        //  Retourne simplement le produit trouvé.
        return response()->json($product, 200);
    }

    /**
     * Update the specified resource in storage.
     * Met à jour un produit existant (Vérification : Propriété de l'auteur).
     */
    public function update(ProductRequest $request, Product $product)
    {
        // 1. VÉRIFICATION D'AUTEUR : L'utilisateur connecté est-il le créateur (propriétaire) du produit ?
        if (Auth::id() !== $product->user_id) {
            return response()->json(['message' => 'Accès refusé. Vous ne pouvez modifier que vos propres produits.'], 403);
        }

        // 2. Mise à jour du produit
        $product->update($request->validated());

        return response()->json([
            'message' => 'Produit mis à jour avec succès.',
            'product' => $product
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     * Supprime un produit (Vérification : Propriété de l'auteur).
     */
    public function destroy(Product $product)
    {
        // 1. VÉRIFICATION D'AUTEUR
        if (Auth::id() !== $product->user_id) {
            return response()->json(['message' => 'Accès refusé. Vous ne pouvez supprimer que vos propres produits.'], 403);
        }

        // 2. Suppression du produit
        $product->delete();

        return response()->json([
            'message' => 'Produit supprimé avec succès.'
        ], 204); // Code 204 pour "No Content" (suppression réussie)
    }
}
