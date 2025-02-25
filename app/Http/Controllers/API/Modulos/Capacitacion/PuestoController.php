<?php

namespace App\Http\Controllers\API\Modulos\Capacitacion;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use App\Http\Controllers\Controller;
use App\Models\Capacitacion\Capacitacion;
use Validator, DB;

use App\Models\Capacitacion\Puesto;
use App\Models\Capacitacion\RelPuestoCapacitacion;
use App\Models\Inventario\CatalogoPersonal;
use App\Models\Capacitacion\RelTrabajadorCapacitacion;
use Carbon\Carbon;

class PuestoController extends Controller
{
    public function index(Request $request){
        try{
            
            
            $loggedUser = auth()->userOrFail();

            $parametros = $request->all();
            $obj = Puesto::with("capacitaciones");

            
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
    public function show(Request $request, $id){
        try{
            $obj = Puesto::with("capacitaciones")->find($id);

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
                    $obj = Puesto::find($parametros['id']);
                }else
                {
                    $obj = new Puesto();
                }
                $obj->descripcion           = strtoupper($parametros['descripcion']);
                
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
            $rol = Puesto::find($id);
            $rol->delete();

            return response()->json(['data'=>'Registro eliminado'], HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            throw new \App\Exceptions\LogError('Ocurrio un error al intentar eliminar el rol',0,$e);
        }
    }

    public function RelPuestoCapacitacion($id, Request $request)
    {
        try{
            $parametros = $request->all(); 
            $parametros = $parametros['params']; 

            RelPuestoCapacitacion::where("catalogo_puesto_id", $id)->forcedelete();
            foreach ($parametros as $key => $value) {
                $obj = new RelPuestoCapacitacion();
                $obj->catalogo_puesto_id = $id;
                $obj->catalogo_capacitacion_id = $value['id'];
                $obj->save();
            }

            $result = Puesto::with("capacitaciones")->find($id);

            return response()->json(['data'=>$result], HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            throw new \App\Exceptions\LogError('Ocurrio un error al intentar eliminar el rol',0,$e);
        }
    }

    public function RelPersonalCapacitacion($id, Request $request)
    {
        try{
            $parametros = $request->all(); 
            //$parametros = $parametros['params']; 
            
            $obj = CatalogoPersonal::whereRaw("id in (select catalogo_personal_id from rel_trabajador_puesto where deleted_at is null and catalogo_puesto_id in (select catalogo_puesto_id from rel_puesto_capacitacion where deleted_at is null and catalogo_capacitacion_id=$id))")
                            ->whereRaw("id not in (select catalogo_personal_id from rel_trabajador_capacitacion where deleted_at is null and catalogo_capacitacion_id=$id)")
                            ->get();
            
            return response()->json(['data'=>$obj], HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            throw new \App\Exceptions\LogError('Ocurrio un error',0,$e);
        } 
    }

    public function HistoryPersonalCapacitacion($id, Request $request)
    {
        try{
            $parametros = $request->all(); 
            //$parametros = $parametros['params']; 
            
            $obj = CatalogoPersonal::whereRaw("id in (select catalogo_personal_id from rel_trabajador_puesto where deleted_at is null and catalogo_puesto_id in (select catalogo_puesto_id from rel_puesto_capacitacion where deleted_at is null and catalogo_capacitacion_id=$id))")
                            ->with(["capacitaciones" => function($query) use($id){
                                return $query->where('catalogo_capacitacion_id', $id);
            }]);

            if($parametros['estatus'] !=0)
            {
                if($parametros['estatus'] == 1)
                {
                    $obj = $obj->whereRaw("id in (select catalogo_personal_id from rel_trabajador_capacitacion where deleted_at is null and catalogo_capacitacion_id=$id)");
                }else if($parametros['estatus'] == 2)
                {
                    $obj = $obj->whereRaw("id not in (select catalogo_personal_id from rel_trabajador_capacitacion where deleted_at is null and catalogo_capacitacion_id=$id)");
                }
            }

            if($parametros['search'] !='')
            {
                $obj = $obj->where('descripcion','LIKE','%'.$parametros['search'].'%');
            }

            if(isset($parametros['page'])){
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
    
                $obj = $obj->paginate($resultadosPorPagina);
            } else {
                $obj = $obj->get();
            }
            
            return response()->json(['data'=>$obj], HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            throw new \App\Exceptions\LogError('Ocurrio un error',0,$e);
        } 
    }
    
    public function RelTrabajadorCapacitacion(Request $request)
    {
        try{
            $parametros = $request->get('params'); 
            $parametros = $parametros['listado']; 
            
            //$obj = new RelTrabajadorCapacitacion();
            $arreglo_capacitacion_puesto = [];
            foreach ($parametros as $key => $value) {
                $index = count($arreglo_capacitacion_puesto);
                $fecha =  new Carbon($value['fecha']);
                $arreglo_capacitacion_puesto[$index]['catalogo_personal_id'] = $value['catalogo_personal_id']['id'];
                $arreglo_capacitacion_puesto[$index]['catalogo_capacitacion_id'] = $value['catalogo_capacitacion_id']['id'];
                $arreglo_capacitacion_puesto[$index]['fecha'] = $fecha->format("Y-m-d");
            }

            $obj = RelTrabajadorCapacitacion::insertOrIgnore($arreglo_capacitacion_puesto);
            return response()->json(['data'=>$obj], HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            throw new \App\Exceptions\LogError('Ocurrio un error',0,$e);
        } 
    }

    public function VerCapacitaciones($id, Request $request)
    {
        try{
            
            $obj = CatalogoPersonal::with("cargo.puesto_capacitacion.capacitacion", "capacitaciones")->find($id);
            return response()->json(['data'=>$obj], HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            throw new \App\Exceptions\LogError('Ocurrio un error',0,$e);
        } 
    }
}
