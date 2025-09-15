<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTablasFinales extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        /*Schema::create('catalogo_subtema', function (Blueprint $table) {
            $table->id();
            $table->bigInteger("catalogo_departamento_id")->unsigned();
            $table->string("descripcion",250);
            $table->timestamps();
            $table->softDeletes();
            
            $table->foreign('catalogo_departamento_id')->references('id')->on('catalogo_departamento');
        });*/

        Schema::create('informacion', function (Blueprint $table) {
            $table->id();
            $table->bigInteger("catalogo_subtema_id")->unsigned();
            $table->bigInteger("user_id")->unsigned();
            $table->string("nombre_archivo", 200);
            $table->string("extension", 200);
            $table->string("type", 250);
            $table->decimal("peso", 19,2);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('catalogo_subtema_id')->references('id')->on('catalogo_subtema');
            $table->foreign('user_id')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('informacion');
        Schema::dropIfExists('catalogo_subtema');
    }
}
