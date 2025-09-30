<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone')->nullable();
            $table->enum('role', ['agriculteur', 'acheteur'])->default('acheteur');
            $table->string('farm_name')->nullable();
            $table->string('company_name')->nullable();
            $table->string('avatar')->nullable();
            $table->json('identity_docs')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['phone','role','farm_name','company_name','avatar','identity_docs']);
        });
    }
};
