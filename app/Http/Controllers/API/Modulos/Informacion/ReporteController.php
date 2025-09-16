<?php

namespace App\Http\Controllers\API\Modulos\Informacion;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use App\Http\Controllers\Controller;

use Validator, DB;

use App\Models\Informacion\Departamento;
use App\Models\Informacion\Informacion;

class ReporteController extends Controller
{
    public function Acumulado(Request $request){
        try{
            $loggedUser = auth()->userOrFail();

            $parametros = $request->all();
            
            $obj = Departamento::select("descripcion", 
            DB::RAW("(select count(*) from informacion where catalogo_subtema_id in 
            (select id from catalogo_subtema where catalogo_departamento_id in (select id from catalogo_departamento a where a.id_padre=catalogo_departamento.id  and informacion.deleted_at is null)) and deleted_at is null) as cantidad"))
            ->where("id", "!=",1)
            ->whereRaw("id IN (SELECT id_padre FROM catalogo_departamento WHERE id_padre!=0)");
            $obj = $obj->get();


            $obj_general = Informacion::leftJoin("catalogo_subtema as b", "b.id", "informacion.catalogo_subtema_id")
                                        ->leftJoin("catalogo_departamento as c", "c.id", "b.catalogo_departamento_id")
                                        ->leftJoin("catalogo_departamento as d", "c.id_padre", "d.id")
                                        ->select(
                                            DB::RAW("d.id AS departamento_padre_id"),
                                            DB::RAW("d.`descripcion` AS departamento_padre"),
                                            DB::RAW("c.`id` AS departamento_id"),
                                            DB::RAW("c.`descripcion` AS departamento"),
                                            DB::RAW("b.id AS subtema_id"),
                                            DB::RAW("b.`descripcion` AS subtema"),
                                            DB::RAW("MONTH(informacion.registro) AS mes"),
                                            DB::RAW("YEAR(informacion.registro) AS anio"),
                                            DB::RAW("informacion.registro"),
                                            DB::RAW("COUNT(*) AS cantidad"),
                                            )->groupBy("informacion.registro")
                                            ->groupBy("informacion.catalogo_subtema_id")
                                            ->orderBy("informacion.registro", "asc")
                                            ->get();

            $obj_ultimo = Departamento::with("subTema.informacion.user")
                                            ->where("catalogo_departamento.seleccionable",1)
                                            ->get();


            return response()->json(['data'=>$obj, 'detalle'=>$obj_general, "ultimo"=>$obj_ultimo],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            throw new \App\Exceptions\LogError('Ocurrio un error al intentar obtener la lista de usuarios',0,$e);
        }
    }

    /*public function Acumulado(Request $request){
        try{
            $loggedUser = auth()->userOrFail();

            $parametros = $request->all();
            
            $obj = Departamento::select("descripcion", 
            DB::RAW("(select count(*) from informacion where catalogo_subtema_id in 
            (select id from catalogo_subtema where catalogo_departamento_id in (select id from catalogo_departamento a where a.id_padre=catalogo_departamento.id  and informacion.deleted_at is null)) and deleted_at is null) as cantidad"))
            ->where("id", "!=",1)
            ->whereRaw("id IN (SELECT id_padre FROM catalogo_departamento WHERE id_padre!=0)");
            $obj = $obj->get();


            
            return response()->json(['data'=>$obj],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            throw new \App\Exceptions\LogError('Ocurrio un error al intentar obtener la lista de usuarios',0,$e);
        }
    }*/
}
