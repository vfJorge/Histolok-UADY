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
        Schema::create('examen_palabclv', function (Blueprint $table) {
            $table->timestamps();
            $table->foreignIdFor(\App\Models\Examen::class);
            $table->foreignIdFor(\App\Models\Palabclv::class);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('examen_palabclv');
    }
};
