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
        Schema::table('blogs', function (Blueprint $table) {
            $table->string('categories')->nullable(); 
            $table->unsignedInteger('likes')->default(0); 
            $table->unsignedInteger('comments_count')->default(0); 
            $table->string('short_description', 500)->nullable(); 
            $table->timestamp('published_at')->nullable(); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('blogs', function (Blueprint $table) {
            $table->dropColumn(['categories', 'likes', 'comments_count', 'short_description', 'published_at']);
        });
    }
};
