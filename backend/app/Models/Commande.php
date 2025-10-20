<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Commande extends Model
{
    protected $fillable=[
        'total_amount',
        'delivery_address',
        'payment_method',
        'user_id'
    ];

    /**
     * retourne l'utilisateur d'une commande
     */
    public function user() {
        return $this->belongsTo(User::class);
    }

    /**
     *
     * Retourne la liste des produits d'une commande
     */
    public function products() {
        return $this->belongsToMany(Product::class,'commande_products')
                    ->withPivot('quantite')
                    ->withTimestamps();
    }
}
