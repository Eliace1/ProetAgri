<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable =[
        'name',
        'description',
        'reduction',
        'price',
        'image'
    ];

    /**
     * Retourne l'agriculteur du produit
     */
    public function agriculteur() {
        return $this->belongsTo(User::class);
    }


    /**
     *
     * Retourne la liste des commandes d'un produits
     */
    public function commandes() {
        return $this->belongsToMany(Commande::class, 'commande_produit')
                    ->withPivot('quantite')
                    ->withTimestamps();
    }
}
