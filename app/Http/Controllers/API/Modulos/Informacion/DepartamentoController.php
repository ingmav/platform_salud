<?php

namespace App\Http\Controllers\API\Modulos\Informacion;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use App\Http\Controllers\Controller;

use Validator, DB;

use App\Models\Informacion\Departamento;

class DepartamentoController extends Controller
{
    public function index(Request $request){
        try{
            $loggedUser = auth()->userOrFail();

            $parametros = $request->all();
            
            if($loggedUser->is_superuser != 1)
            {
                $obj = Departamento::with(["departamento_padre","subTema" => function($query) use($loggedUser)
                {
                    $query->whereRaw("id in (select catalogo_subtema_id from rel_user_subtema where user_id=".$loggedUser->id." and deleted_at is null)");
                }])->where("seleccionable", 1);
                $obj->whereRaw("id in (select catalogo_departamento_id from catalogo_subtema where id in (select catalogo_subtema_id from rel_user_subtema where user_id=".$loggedUser->id."))");
            }else{
                $obj = Departamento::with("departamento_padre","subTema")->where("seleccionable", 1);
            }
            //Filtros, busquedas, ordenamiento
            if(isset($parametros['query']) && $parametros['query']){
                $obj = $obj->where(function($query)use($parametros){
                    return $query->where('descripcion','LIKE','%'.$parametros['query'].'%');
                });
            }

            if((isset($parametros['sort']) && $parametros['sort']) && (isset($parametros['direction']) && $parametros['direction'])){
                $obj = $obj->orderBy($parametros['sort'],$parametros['direction']);
            }else{
                $obj = $obj->orderBy('updated_at','desc');
            }

            if(isset($parametros['page'])){
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
    
                $obj = $obj->paginate($resultadosPorPagina);
            } else {
                $obj = $obj->get();
            }

            return response()->json(['data'=>$obj],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            throw new \App\Exceptions\LogError('Ocurrio un error al intentar obtener la lista de usuarios',0,$e);
        }
    }
}
