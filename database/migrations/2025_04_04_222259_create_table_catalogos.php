<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTableCatalogos extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        
        Schema::create('catalogo_departamento', function (Blueprint $table) {
            $table->id();
            $table->string("descripcion");
            $table->bigInteger("id_padre");
            $table->mediumInteger("seleccionable")->unsigned();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('rel_user_departamento', function (Blueprint $table) {
            $table->id();
            $table->bigInteger("catalogo_departamento_id")->unsigned();
            $table->bigInteger("user_id")->unsigned();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('catalogo_departamento_id')->references('id')->on('catalogo_departamento');
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
        
        Schema::dropIfExists('rel_user_departamento');
        Schema::dropIfExists('catalogo_departamento');
    }
}
