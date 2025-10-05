<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function(Blueprint $table){
            $table->id();
            $table->string('name');
            $table->double('price');
            $table->double('qte');
            $table->longText('image');
            $table->longText('description');
            $table->double('reduction');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('categorie_id')->constrained('categories')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
        Schema::table('produits', function (Blueprint $table) {
        $table->dropForeign(['user_id']);
        $table->dropColumn('user_id');
        $table->dropForeign(['categorie_id']);
        $table->dropColumn('categorie_id');
});

    }
};
