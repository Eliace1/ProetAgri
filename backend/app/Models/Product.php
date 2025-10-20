<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable =[
        'name',
        'price',
        'qte',
        'image',
        'description',
        'reduction',
        'user_id',

    ];

    /**
     * Retourne l'agriculteur du produit
     */

     public function user()
    {
        return $this->belongsTo(User::class);
    }

     /**
     *
     * Retourne la liste des catégorie d'un produits
     */
    public function categorie()
{
    return $this->belongsTo(Categorie::class);
}




    /**
     *
     * Retourne la liste des commandes d'un produits
     */
    public function commandes() {
        return $this->belongsToMany(Commande::class, 'commande_products')
                    ->withPivot('quantite')
                    ->withTimestamps();
    }
}
