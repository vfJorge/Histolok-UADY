<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('preguntas', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('title');
            $table->string('question');
            $table->integer('n_opcions')->default('4');
            $table->unsignedBigInteger('answer_id');
            $table->foreign('answer_id')->references('id')->on('opcions');
            $table->foreignIdFor(\App\Models\Foto::class);
            $table->foreignIdFor(\App\Models\User::class);
            $table->integer('difficulty');
            $table->string('access')->default('private');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('preguntas');
    }
};
