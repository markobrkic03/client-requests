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
        Schema::create('requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained()->restrictOnDelete();
            $table->string('title', 120);
            $table->text('description')->nullable();
            $table->enum('status', ['open', 'in_progress', 'done'])->default('open');
            $table->enum('priority', ['low', 'medium', 'high']);
            $table->date('due_date')->nullable();
            $table->text('resolution')->nullable();
            $table->index(['client_id', 'status']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('requests');
    }
};
