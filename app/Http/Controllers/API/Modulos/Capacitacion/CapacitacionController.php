<?php

namespace App\Http\Controllers\API\Modulos\Capacitacion;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use App\Http\Controllers\Controller;

use Validator, DB;

use App\Models\Capacitacion\Capacitacion;

class CapacitacionController extends Controller
{
    public function index(Request $request){
        try{
            $loggedUser = auth()->userOrFail();

            $parametros = $request->all();
            $obj = Capacitacion::getModel();

            
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

    public function store(Request $request){
        try{
            $validation_rules = [
                'descripcion' => 'required',
            ];
        
            $validation_eror_messages = [
                'descripcion.required' => 'La Descripcion es requerido',
            ];

            $parametros = $request->all(); 
            $parametros = $parametros['params']; 
            $resultado = Validator::make($parametros,$validation_rules,$validation_eror_messages);

            if($resultado->passes()){
                DB::beginTransaction();
                $usuario = auth()->userOrFail();
                if(isset($parametros['id']) && $parametros['id']!=0)
                {
                    $obj = Capacitacion::find($parametros['id']);
                }else
                {
                    $obj = new Capacitacion();
                }
                $obj->catalogo_tipo_categoria           = strtoupper($parametros['catalogo_tipo_categoria']);
                $obj->norma                             = strtoupper($parametros['norma']);
                $obj->descripcion                       = strtoupper($parametros['descripcion']);
                
                $obj->save();
                DB::commit();
                return response()->json(['data'=>$obj],HttpResponse::HTTP_OK);
            }else{
                return response()->json(['mensaje' => 'Error en los datos del formulario', 'validacion'=>$resultado->passes(), 'errores'=>$resultado->errors()], HttpResponse::HTTP_CONFLICT);
            }
        }catch(\Exception $e){
            DB::rollback();
            throw new \App\Exceptions\LogError('Ocurrio un error al intentar guardar el rol',0,$e);
        }
    }

    public function destroy($id)
    {
        try{
            $rol = Capacitacion::find($id);
            $rol->delete();

            return response()->json(['data'=>'Registro eliminado'], HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            throw new \App\Exceptions\LogError('Ocurrio un error al intentar eliminar el rol',0,$e);
        }
    }
}
