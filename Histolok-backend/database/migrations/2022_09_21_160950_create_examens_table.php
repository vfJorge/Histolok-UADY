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
        Schema::create('examens', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('title');
            $table->string('description');
            $table->integer('n_questions')->nullable();
            //$table->integer('n_correct')->default('0');
            $table->integer('difficulty');
            //$table->timestamp('start_time')->nullable();
            //$table->timestamp('end_time')->nullable();
            $table->time('duration')->default('00:15:00');
            $table->string('mode');
            $table->string('access')->default('private');
            $table->foreignIdFor(\App\Models\User::class);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('examens');
    }
};
