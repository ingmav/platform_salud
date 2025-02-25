<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTableInventario extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('catalogo_unidad', function (Blueprint $table) {
            $table->smallIncrements("id");
            $table->string("descripcion", 255);
            $table->string("abreviatura", 50);
            $table->bigInteger("user_id")->unsigned();
            
            $table->foreign('user_id')->references('id')->on('users');
            $table->timestamps();
            $table->softDeletes();
        });
        Schema::create('catalogo_articulos', function (Blueprint $table) {
            $table->id();
            $table->smallInteger("catalogo_unidad_id")->unsigned();
            $table->string("descripcion", 255);
            $table->string("marca", 100)->nullable();
            $table->string("modelo", 100)->nullable();
            $table->string("talla", 100)->nullable();
            $table->decimal("inventario", 10,2)->default(0);
            $table->decimal("min", 10,2)->default(0);
            $table->decimal("max", 10,2)->default(0);
            $table->bigInteger("user_id")->unsigned();
            
            $table->foreign('catalogo_unidad_id')->references('id')->on('catalogo_unidad');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('catalogo_calidad', function (Blueprint $table) {
            $table->smallIncrements("id");
            $table->string("descripcion", 100);    
            $table->bigInteger("user_id")->unsigned();
            
            $table->foreign('user_id')->references('id')->on('users');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('catalogo_personal', function (Blueprint $table) {
            $table->id();
            $table->string("descripcion", 100);    
            $table->string("cargo", 150);    
            $table->bigInteger("user_id")->unsigned();

            $table->foreign('user_id')->references('id')->on('users');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('movtos', function (Blueprint $table) {
            $table->id();
            $table->string("proveedor", 150)->nullable();
            $table->date("fecha_movimiento");
            $table->decimal("cantidad_total",10,2);
            $table->smallInteger("tipo_movto")->unsigned()->comment("E = Entrada, S = Salida");
            $table->bigInteger("user_id")->unsigned();
            
            $table->foreign('user_id')->references('id')->on('users');
            $table->timestamps();
            $table->softDeletes();
        });

        /*Schema::create('descripcion_articulo', function (Blueprint $table) {
            $table->id();
            $table->bigInteger("articulo_id")->unsigned();
            $table->smallInteger("catalogo_calidad_id")->unsigned();
            $table->bigInteger("movto_id")->nullable()->unsigned();
            $table->string("estatus")->comment("A = ACTIVO, I =  INACTIVO");
            $table->bigInteger("user_id")->unsigned();
            
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('articulo_id')->references('id')->on('catalogo_articulos');
            $table->foreign('catalogo_calidad_id')->references('id')->on('catalogo_calidad');
            $table->foreign('movto_id')->references('id')->on('movtos');
            $table->timestamps();
            $table->softDeletes();
        });*/

        Schema::create('movtos_detalles', function (Blueprint $table) {
            $table->id();
            $table->bigInteger("movtos_id")->unsigned();
            $table->bigInteger("articulo_id")->unsigned();
            $table->bigInteger("catalogo_personal_id")->unsigned()->nullable();
            $table->smallInteger("cantidad")->unsigned();
            
            $table->foreign('movtos_id')->references('id')->on('movtos');
            $table->foreign('articulo_id')->references('id')->on('catalogo_articulos');
            $table->foreign('catalogo_personal_id')->references('id')->on('catalogo_personal');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //Schema::dropIfExists('descripcion_articulo');
        Schema::dropIfExists('movtos_detalles');
        Schema::dropIfExists('catalogo_articulos');
        Schema::dropIfExists('movtos');
        Schema::dropIfExists('catalogo_unidad');
        Schema::dropIfExists('catalogo_calidad');
        Schema::dropIfExists('catalogo_personal');
        
    }
}
