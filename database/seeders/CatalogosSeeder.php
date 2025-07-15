<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class CatalogosSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
         $archivo_puesto = storage_path().'/app/seeds/CATALOGO_PUESTOS.csv';
         $query_puesto = sprintf("
             LOAD DATA local INFILE '%s' 
             INTO TABLE catalogo_puesto
             FIELDS TERMINATED BY ',' 
             OPTIONALLY ENCLOSED BY '\"' 
             ESCAPED BY '\"' 
             LINES TERMINATED BY '\\n' 
             IGNORE 1 LINES", addslashes($archivo_puesto));
         \DB::connection()
         ->getpdo()
         ->exec($query_puesto);

        $archivo_csv = storage_path().'/app/seeds/CATALOGO_CAPACITACIONES.csv';
        $query = sprintf("
            LOAD DATA local INFILE '%s' 
            INTO TABLE catalogo_capacitacion
            FIELDS TERMINATED BY ',' 
            OPTIONALLY ENCLOSED BY '\"' 
            ESCAPED BY '\"' 
            LINES TERMINATED BY '\\n' 
            IGNORE 1 LINES", addslashes($archivo_csv));
        \DB::connection()->getpdo()->exec($query);

        $archivo_puesto_capacitacion = storage_path().'/app/seeds/rel_puesto_capacitacion.csv';
        $query_puesto_capacitacion = sprintf("
            LOAD DATA local INFILE '%s' 
            INTO TABLE rel_puesto_capacitacion
            FIELDS TERMINATED BY ',' 
            OPTIONALLY ENCLOSED BY '\"' 
            ESCAPED BY '\"' 
            LINES TERMINATED BY '\\n' 
            IGNORE 1 LINES", addslashes($archivo_puesto_capacitacion));
        \DB::connection()->getpdo()->exec($query_puesto_capacitacion);
    }
}
