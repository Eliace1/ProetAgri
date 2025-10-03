<?php

// Déclare le namespace du contrôleur, qui permet à Laravel de l'organiser correctement
namespace App\Http\Controllers;

// On importe les classes nécessaires pour ce contrôleur
use App\Http\Requests\ProductRequest; // Pour valider les données envoyées lors de la création ou modification d’un produit
use App\Models\Product;               // Le modèle Eloquent qui représente la table "products"
use Illuminate\Http\JsonResponse;    // Pour retourner des réponses JSON
use Illuminate\Support\Facades\Auth; // Pour gérer l’authentification de l’utilisateur
use Illuminate\Support\Facades\Storage; // Pour gérer les fichiers (images) stockés

// Déclaration du contrôleur qui hérite du contrôleur de base Laravel
class ProductController extends Controller
{
    /**
     * Méthode pour afficher tous les produits avec leur catégorie associée.
     * Accessible à tous les utilisateurs.
     */
    public function index(): JsonResponse
    {
        // Récupère tous les produits en incluant leur relation "categorie"
        $products = Product::with('categorie')->get();

        // Transforme chaque produit pour ne retourner que les champs utiles au frontend
        $transformed = $products->map(function ($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'price' => $product->price,
                'qte' => $product->qte,
                'image' => $product->image,
                'category' => $product->categorie->name ?? null, // Si la catégorie existe, on retourne son nom
                'description' => $product->description,
            ];
        });

        // Retourne la liste des produits transformés en JSON avec le code HTTP 200 (OK)
        return response()->json($transformed, 200);
    }

    /**
     * Méthode pour ajouter un nouveau produit.
     * Seuls les utilisateurs ayant le rôle "agriculteur" peuvent le faire.
     */
    public function store(ProductRequest $request): JsonResponse
    {
        // Récupère l’utilisateur actuellement connecté
        $user = Auth::user();

        // Vérifie que l’utilisateur est bien un agriculteur
        if (!$user || $user->role !== 'agriculteur') {
            return response()->json([
                'message' => 'Accès refusé. Seuls les agriculteurs peuvent ajouter des produits.'
            ], 403); // Code HTTP 403 = accès interdit
        }

        // Valide les données envoyées par le formulaire
        $validated = $request->validated();

        // Si une image est envoyée, on la stocke dans le dossier "products" du disque "public"
        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('products', 'public');
        }

        // Crée le produit en associant l’utilisateur connecté comme propriétaire
        $product = Product::create(array_merge($validated, [
            'user_id' => $user->id,
        ]));

        // Retourne une réponse JSON avec le produit créé et un message de succès
        return response()->json([
            'message' => 'Produit ajouté avec succès.',
            'product' => $product
        ], 201); // Code HTTP 201 = ressource créée
    }

    /**
     * Méthode pour afficher les détails d’un produit spécifique.
     */
    public function show(Product $product): JsonResponse
    {
        // Retourne le produit en JSON avec le code HTTP 200
        return response()->json($product, 200);
    }

    /**
     * Méthode pour modifier un produit existant.
     * Seul le propriétaire du produit peut le modifier.
     */
    public function update(ProductRequest $request, Product $product): JsonResponse
    {
        // Vérifie que l’utilisateur connecté est bien le propriétaire du produit
        if (Auth::id() !== $product->user_id) {
            return response()->json([
                'message' => 'Accès refusé. Vous ne pouvez modifier que vos propres produits.'
            ], 403);
        }

        // Valide les nouvelles données envoyées
        $validated = $request->validated();

        // Si une nouvelle image est envoyée, on remplace l’ancienne
        if ($request->hasFile('image')) {
            // Supprime l’ancienne image du stockage
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            // Stocke la nouvelle image
            $validated['image'] = $request->file('image')->store('products', 'public');
        }

        // Met à jour le produit avec les nouvelles données
        $product->update($validated);

        // Retourne une réponse JSON avec le produit mis à jour
        return response()->json([
            'message' => 'Produit mis à jour avec succès.',
            'product' => $product
        ], 200);
    }

    /**
     * Méthode pour supprimer un produit.
     * Seul le propriétaire du produit peut le supprimer.
     */
    public function destroy(Product $product): JsonResponse
    {
        // Vérifie que l’utilisateur connecté est bien le propriétaire du produit
        if (Auth::id() !== $product->user_id) {
            return response()->json([
                'message' => 'Accès refusé. Vous ne pouvez supprimer que vos propres produits.'
            ], 403);
        }

        // Supprime l’image du produit du stockage si elle existe
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        // Supprime le produit de la base de données
        $product->delete();

        // Retourne une réponse JSON avec un code 204 (pas de contenu, suppression réussie)
        return response()->json([
            'message' => 'Produit supprimé avec succès.'
        ], 204);
    }
}