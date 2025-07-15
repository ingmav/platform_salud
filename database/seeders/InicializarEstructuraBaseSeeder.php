<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class InicializarEstructuraBaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $basic_unidades = [
            [ 'id'=>1, 'descripcion'=>'PIEZAS', 'abreviatura'=>'PZS', 'user_id'=>1],
            [ 'id'=>2, 'descripcion'=>'KILOS', 'abreviatura'=>'KG', 'user_id'=>1],
            [ 'id'=>3, 'descripcion'=>'LITROS', 'abreviatura'=>'LTRS', 'user_id'=>1],
            [ 'id'=>4, 'descripcion'=>'PAQUETE', 'abreviatura'=>'PQ', 'user_id'=>1]
            ];

        foreach ($basic_unidades as $unidades) {
            \App\Models\Inventario\CatalogoUnidad::create($unidades);
        }

        $basic_articulos = [
            [ 'catalogo_unidad_id'=>1,'descripcion'=>'BARBOQUEJO PARA CASCO', 'marca'=>'', 'modelo'=>'', 'talla'=>'','inventario'=>0, 'min'=>0,'max'=>0,'user_id'=>1],
            [ 'catalogo_unidad_id'=>1,'descripcion'=>'BOTAS CONTRA IMPACTOS ANTIDERRAPANTE', 'marca'=>'', 'modelo'=>'', 'talla'=>'','inventario'=>0, 'min'=>0,'max'=>0,'user_id'=>1],
            [ 'catalogo_unidad_id'=>1,'descripcion'=>'BOTAS DIELÉCTRICAS', 'marca'=>'', 'modelo'=>'', 'talla'=>'','inventario'=>0, 'min'=>0,'max'=>0,'user_id'=>1],
            [ 'catalogo_unidad_id'=>1,'descripcion'=>'BOTAS IMPERMEABLES', 'marca'=>'', 'modelo'=>'', 'talla'=>'','inventario'=>0, 'min'=>0,'max'=>0,'user_id'=>1],
            [ 'catalogo_unidad_id'=>1,'descripcion'=>'CAMISA TIPO FILIPINA 100% ALGODÓN', 'marca'=>'', 'modelo'=>'', 'talla'=>'','inventario'=>0, 'min'=>0,'max'=>0,'user_id'=>1],
            [ 'catalogo_unidad_id'=>1,'descripcion'=>'CAPUCHA', 'marca'=>'', 'modelo'=>'', 'talla'=>'','inventario'=>0, 'min'=>0,'max'=>0,'user_id'=>1],
            [ 'catalogo_unidad_id'=>1,'descripcion'=>'CARETA DE SEGURIDAD', 'marca'=>'', 'modelo'=>'', 'talla'=>'','inventario'=>0, 'min'=>0,'max'=>0,'user_id'=>1],
            [ 'catalogo_unidad_id'=>1,'descripcion'=>'CARETA DE SOLDADURA', 'marca'=>'', 'modelo'=>'', 'talla'=>'','inventario'=>0, 'min'=>0,'max'=>0,'user_id'=>1],
            [ 'catalogo_unidad_id'=>1,'descripcion'=>'CASCO CLASE E DIELÉCTRICO (ALTA TENSIÓN ELÉCTRICA DE HASTA 20 000 V FASE A TIERRA)', 'marca'=>'', 'modelo'=>'', 'talla'=>'','inventario'=>0, 'min'=>0,'max'=>0,'user_id'=>1],
            [ 'catalogo_unidad_id'=>1,'descripcion'=>'CASCO CON OREJERAS ', 'marca'=>'', 'modelo'=>'', 'talla'=>'','inventario'=>0, 'min'=>0,'max'=>0,'user_id'=>1],
            [ 'catalogo_unidad_id'=>1,'descripcion'=>'CASCO CONTRA IMPACTO CLASE G GENERAL (BAJA TENSIÓN ELÉCTRICA DE HASTA 2 200 V FASE A TIERRA)', 'marca'=>'', 'modelo'=>'', 'talla'=>'','inventario'=>0, 'min'=>0,'max'=>0,'user_id'=>1],
            [ 'catalogo_unidad_id'=>1,'descripcion'=>'CHALECO', 'marca'=>'', 'modelo'=>'', 'talla'=>'','inventario'=>0, 'min'=>0,'max'=>0,'user_id'=>1],
            [ 'catalogo_unidad_id'=>1,'descripcion'=>'COFIA', 'marca'=>'', 'modelo'=>'', 'talla'=>'','inventario'=>0, 'min'=>0,'max'=>0,'user_id'=>1],
            [ 'catalogo_unidad_id'=>1,'descripcion'=>'EQUIPO DE PROTECCIÓN CONTRA CAÍDAS DE ALTURA (ARNÉS + LÍNEA DE VIDA)', 'marca'=>'', 'modelo'=>'', 'talla'=>'','inventario'=>0, 'min'=>0,'max'=>0,'user_id'=>1],
            [ 'catalogo_unidad_id'=>1,'descripcion'=>'FAJAS', 'marca'=>'', 'modelo'=>'', 'talla'=>'','inventario'=>0, 'min'=>0,'max'=>0,'user_id'=>1],
            [ 'catalogo_unidad_id'=>1,'descripcion'=>'GUANTES ANTICORTES', 'marca'=>'', 'modelo'=>'', 'talla'=>'','inventario'=>0, 'min'=>0,'max'=>0,'user_id'=>1],
            [ 'catalogo_unidad_id'=>1,'descripcion'=>'GUANTES CONTRA TEMPERATURAS EXTREMAS (CARNAZA)', 'marca'=>'', 'modelo'=>'', 'talla'=>'','inventario'=>0, 'min'=>0,'max'=>0,'user_id'=>1],
            [ 'catalogo_unidad_id'=>1,'descripcion'=>'GUANTES DE LÁTEX PARA LIMPIEZA', 'marca'=>'', 'modelo'=>'', 'talla'=>'','inventario'=>0, 'min'=>0,'max'=>0,'user_id'=>1],
            [ 'catalogo_unidad_id'=>1,'descripcion'=>'GUANTES DE LÁTEX PARA USO DE SUSTANCIAS QUÍMICAS', 'marca'=>'', 'modelo'=>'', 'talla'=>'','inventario'=>0, 'min'=>0,'max'=>0,'user_id'=>1],
            [ 'catalogo_unidad_id'=>1,'descripcion'=>'GUANTES DE USO GENERAL (TELA)', 'marca'=>'', 'modelo'=>'', 'talla'=>'','inventario'=>0, 'min'=>0,'max'=>0,'user_id'=>1],
            [ 'catalogo_unidad_id'=>1,'descripcion'=>'GUANTES DIELÉCTRICOS', 'marca'=>'', 'modelo'=>'', 'talla'=>'','inventario'=>0, 'min'=>0,'max'=>0,'user_id'=>1],
            [ 'catalogo_unidad_id'=>1,'descripcion'=>'GUANTES PARA SOLDADURA', 'marca'=>'', 'modelo'=>'', 'talla'=>'','inventario'=>0, 'min'=>0,'max'=>0,'user_id'=>1],
            [ 'catalogo_unidad_id'=>1,'descripcion'=>'IMPERMEABLES', 'marca'=>'', 'modelo'=>'', 'talla'=>'','inventario'=>0, 'min'=>0,'max'=>0,'user_id'=>1],
            [ 'catalogo_unidad_id'=>1,'descripcion'=>'LENTES DE PROTECCIÓN ', 'marca'=>'', 'modelo'=>'', 'talla'=>'','inventario'=>0, 'min'=>0,'max'=>0,'user_id'=>1],
            [ 'catalogo_unidad_id'=>1,'descripcion'=>'LENTES PARA SOLDAR', 'marca'=>'', 'modelo'=>'', 'talla'=>'','inventario'=>0, 'min'=>0,'max'=>0,'user_id'=>1],
            [ 'catalogo_unidad_id'=>1,'descripcion'=>'MANDIL CONTRA ALTAS TEMPERATURAS CARNAZA', 'marca'=>'', 'modelo'=>'', 'talla'=>'','inventario'=>0, 'min'=>0,'max'=>0,'user_id'=>1],
            [ 'catalogo_unidad_id'=>1,'descripcion'=>'MANDIL DE ALGODÓN ', 'marca'=>'', 'modelo'=>'', 'talla'=>'','inventario'=>0, 'min'=>0,'max'=>0,'user_id'=>1],
            [ 'catalogo_unidad_id'=>1,'descripcion'=>'MANGAS DE CARNAZA', 'marca'=>'', 'modelo'=>'', 'talla'=>'','inventario'=>0, 'min'=>0,'max'=>0,'user_id'=>1],
            [ 'catalogo_unidad_id'=>1,'descripcion'=>'MANGAS DE TELA', 'marca'=>'', 'modelo'=>'', 'talla'=>'','inventario'=>0, 'min'=>0,'max'=>0,'user_id'=>1],
            [ 'catalogo_unidad_id'=>1,'descripcion'=>'OREJERAS', 'marca'=>'', 'modelo'=>'', 'talla'=>'','inventario'=>0, 'min'=>0,'max'=>0,'user_id'=>1],
            [ 'catalogo_unidad_id'=>1,'descripcion'=>'OVEROL COMPLETO DE MANGA LARGA 100% ALGODÓN', 'marca'=>'', 'modelo'=>'', 'talla'=>'','inventario'=>0, 'min'=>0,'max'=>0,'user_id'=>1],
            [ 'catalogo_unidad_id'=>1,'descripcion'=>'PANTALÓN DE MEZCLILLA', 'marca'=>'', 'modelo'=>'', 'talla'=>'','inventario'=>0, 'min'=>0,'max'=>0,'user_id'=>1],
            [ 'catalogo_unidad_id'=>1,'descripcion'=>'PLAYERA 100 % ALGODÓN ', 'marca'=>'', 'modelo'=>'', 'talla'=>'','inventario'=>0, 'min'=>0,'max'=>0,'user_id'=>1],
            [ 'catalogo_unidad_id'=>1,'descripcion'=>'PROTECTOR FACIAL CALIBRE 8 MM', 'marca'=>'', 'modelo'=>'', 'talla'=>'','inventario'=>0, 'min'=>0,'max'=>0,'user_id'=>1],
            [ 'catalogo_unidad_id'=>1,'descripcion'=>'RESPIRADOR CONTRA GASES Y VAPORES ORGÁNICOS CON ACEITE', 'marca'=>'', 'modelo'=>'', 'talla'=>'','inventario'=>0, 'min'=>0,'max'=>0,'user_id'=>1],
            [ 'catalogo_unidad_id'=>1,'descripcion'=>'RESPIRADOR DE PARTÍCULAS', 'marca'=>'', 'modelo'=>'', 'talla'=>'','inventario'=>0, 'min'=>0,'max'=>0,'user_id'=>1],
            [ 'catalogo_unidad_id'=>1,'descripcion'=>'RESPIRADOR PARA SOLDADURA', 'marca'=>'', 'modelo'=>'', 'talla'=>'','inventario'=>0, 'min'=>0,'max'=>0,'user_id'=>1],
            [ 'catalogo_unidad_id'=>1,'descripcion'=>'BALONES DE FUTBOL', 'marca'=>'', 'modelo'=>'', 'talla'=>'','inventario'=>0, 'min'=>0,'max'=>0,'user_id'=>1],
            [ 'catalogo_unidad_id'=>1,'descripcion'=>'BALONES DE BASQUETBALL', 'marca'=>'', 'modelo'=>'', 'talla'=>'','inventario'=>0, 'min'=>0,'max'=>0,'user_id'=>1],
            [ 'catalogo_unidad_id'=>1,'descripcion'=>'CASACAS DE FUTBOL (AZUL)', 'marca'=>'', 'modelo'=>'', 'talla'=>'','inventario'=>0, 'min'=>0,'max'=>0,'user_id'=>1],
            [ 'catalogo_unidad_id'=>1,'descripcion'=>'CASACAS DE FUTBOL (ROJO)', 'marca'=>'', 'modelo'=>'', 'talla'=>'','inventario'=>0, 'min'=>0,'max'=>0,'user_id'=>1],
            ];

        foreach ($basic_articulos as $articulos) {
            \App\Models\Inventario\CatalogoArticulos::create($articulos);
        }

        $basic_calidad = [
            [ 'id'=>1, 'descripcion'=>'BUENO', 'user_id'=>1],
            [ 'id'=>2, 'descripcion'=>'REGULAR', 'user_id'=>1],
            [ 'id'=>3, 'descripcion'=>'MALO', 'user_id'=>1]
            ];

        foreach ($basic_calidad as $calidad) {
            \App\Models\Inventario\CatalogoCalidad::create($calidad);
        }
    }
}
