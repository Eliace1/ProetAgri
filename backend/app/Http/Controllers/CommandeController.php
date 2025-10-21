<?php

namespace App\Http\Controllers;

use App\Http\Requests\CommandeRequest;
use App\Models\User;
use App\Models\Commande;
use App\Models\Product;
use Illuminate\Auth\Events\Validated;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class CommandeController extends Controller
{
    public function index(){

        $user=Auth::user();
        $commandesUsers = $user->commandes()->with('products.categorie')->get();
        return response([
            'commandesUsers'=> $commandesUsers,
            'status'=>200
        ],200);
    }

    public function create(CommandeRequest $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json([
                'message' => 'Veuillez vous connecter',
                'status' => 401
            ], 401);
        }

        $data = $request->validated();
        $data['user_id'] = $user->id;

        $commande = Commande::create($data);

        $productsA = [];
        foreach ($data['products'] as $product) {
            $productModel = Product::find($product['product_id']);

            if ($productModel && $productModel->qte >= $product['quantite']) {
                // Diminuer le stock
                 $productModel->qte -= $product['quantite'];
                 $productModel->save();

                $productsA[$product['product_id']] = ['quantite' => $product['quantite']];
            } else {
                return response()->json([
                    'message' => "Produit {$product['product_id']} en rupture de stock ou quantité insuffisante.",
                    'status' => 400
                ], 400);
            }
        }

        $commande->products()->attach($productsA);

        return response()->json([
            'message' => 'Commande créée avec succès',
            'commande' => $commande->load('products'),
            'status' => 201
        ], 201);
    }

    public function destroy($id){
        $commande = Commande::find($id);

        if(!$commande){
            return response()->json([
                "message"=>"commande introuvable",
                "status"=>404
            ],404);
        }
        if($commande->user_id !== Auth::id()){
            return response()->json([
                "message"=>"Veillez vous connecter",
                "status"=>401
            ],401);
        }

        $commande->delete();
        return response()->json([
            "message"=>"commande supprimé",
            "status"=>200,
        ],200);
    }

    public function update(CommandeRequest $request,$id){
        $commande = Commande::find($id);

        if(!$commande){
            return response()->json([
                "message"=>"commande introuvable",
                "status"=>404
            ],404);
        }
        $user = Auth::user();
        if (!$user || $commande->user_id !== $user->id) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }
        $data=$request->validated();

        $data['user_id'] = $user->id;
        $commande->update($data);

        $productsA = [];
        foreach ($data['products'] as $product) {
            $productsA[$product['product_id']] = ['quantite' => $product['quantite']];
        }

        $commande->products()->sync($productsA);
        return response()->json([
        'message' => 'Commande mise à jour avec succès',
        'commande' => $commande->load('products'),
    ], 200);
    }



}
