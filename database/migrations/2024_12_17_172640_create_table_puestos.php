<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTablePuestos extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('catalogo_puesto', function (Blueprint $table) {
            $table->id();
            $table->string("descripcion",250);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('catalogo_tipo_categoria', function (Blueprint $table) {
            $table->id();
            $table->string("descripcion",250);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('catalogo_capacitacion', function (Blueprint $table) {
            $table->id();
            $table->bigInteger("catalogo_tipo_categoria")->unsigned();
            $table->string("norma",100);
            $table->string("descripcion",300);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('catalogo_tipo_categoria')->references('id')->on('catalogo_tipo_categoria');
        });

        Schema::create('rel_puesto_capacitacion', function (Blueprint $table) {
            $table->bigInteger("catalogo_puesto_id")->unsigned();
            $table->bigInteger("catalogo_capacitacion_id")->unsigned();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('catalogo_puesto_id')->references('id')->on('catalogo_puesto');
            $table->foreign('catalogo_capacitacion_id')->references('id')->on('catalogo_capacitacion');
        });
        
        Schema::create('rel_trabajador_puesto', function (Blueprint $table) {
            $table->bigInteger("catalogo_personal_id")->unsigned();
            $table->bigInteger("catalogo_puesto_id")->unsigned();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('catalogo_personal_id')->references('id')->on('catalogo_personal');
            $table->foreign('catalogo_puesto_id')->references('id')->on('catalogo_puesto');
        });

        Schema::create('rel_trabajador_capacitacion', function (Blueprint $table) {
            $table->bigInteger("catalogo_personal_id")->unsigned();
            $table->bigInteger("catalogo_capacitacion_id")->unsigned();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('catalogo_personal_id')->references('id')->on('catalogo_personal');
            $table->foreign('catalogo_capacitacion_id')->references('id')->on('catalogo_capacitacion');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('rel_trabajador_capacitacion');
        Schema::dropIfExists('rel_trabajador_puesto');
        Schema::dropIfExists('rel_puesto_capacitacion');
        Schema::dropIfExists('catalogo_capacitacion');
        Schema::dropIfExists('catalogo_tipo_categoria');
        Schema::dropIfExists('catalogo_puesto');
    }
}
