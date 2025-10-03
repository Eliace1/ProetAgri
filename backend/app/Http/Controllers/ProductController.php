<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductRequest;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * Affiche la liste de tous les produits avec leur catégorie.
     */
   public function index(): JsonResponse
    {
        $products = Product::with('categorie')->get();

        $transformed = $products->map(function ($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'price' => $product->price,
                'qte' => $product->qte,
                'image' => $product->image,
                'category' => $product->categorie->name ?? null,
                'description' => $product->description,
            ];
        });

        return response()->json($transformed, 200);
    }



    /**
     * Stocke un nouveau produit (réservé aux agriculteurs).
     */
    public function store(ProductRequest $request): JsonResponse
    {
        $user = Auth::user();

        if (!$user || $user->role !== 'agriculteur') {
            return response()->json([
                'message' => 'Accès refusé. Seuls les agriculteurs peuvent ajouter des produits.'
            ], 403);
        }

        $validated = $request->validated();

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('products', 'public');
        }

        $product = Product::create(array_merge($validated, [
            'user_id' => $user->id,
        ]));

        return response()->json([
            'message' => 'Produit ajouté avec succès.',
            'product' => $product
        ], 201);
    }

    /**
     * Affiche les détails d'un produit spécifique.
     */
    public function show(Product $product): JsonResponse
    {
        return response()->json($product, 200);
    }

    /**
     * Met à jour un produit existant (réservé au propriétaire).
     */
    public function update(ProductRequest $request, Product $product): JsonResponse
    {
        if (Auth::id() !== $product->user_id) {
            return response()->json([
                'message' => 'Accès refusé. Vous ne pouvez modifier que vos propres produits.'
            ], 403);
        }

        $validated = $request->validated();

        if ($request->hasFile('image')) {
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $validated['image'] = $request->file('image')->store('products', 'public');
        }

        $product->update($validated);

        return response()->json([
            'message' => 'Produit mis à jour avec succès.',
            'product' => $product
        ], 200);
    }

    /**
     * Supprime un produit (réservé au propriétaire).
     */
    public function destroy(Product $product): JsonResponse
    {
        if (Auth::id() !== $product->user_id) {
            return response()->json([
                'message' => 'Accès refusé. Vous ne pouvez supprimer que vos propres produits.'
            ], 403);
        }

        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();

        return response()->json([
            'message' => 'Produit supprimé avec succès.'
        ], 204);
    }
}