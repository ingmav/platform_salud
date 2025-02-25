<?php

namespace App\Http\Controllers\API\Modulos\Inventario;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use App\Http\Controllers\Controller;

use Validator, DB;

use App\Models\Inventario\CatalogoArticulos;
use App\Models\Inventario\CatalogoUnidad;
use App\Models\Inventario\CatalogoPersonal;
use App\Models\Inventario\Movtos;

class ArticuloController extends Controller
{
    public function index(Request $request){
        try{
            $loggedUser = auth()->userOrFail();

            $parametros = $request->all();
            $obj = CatalogoArticulos::getModel();

            
            //Filtros, busquedas, ordenamiento
            if(isset($parametros['query']) && $parametros['query']){
                $obj = $obj->where(function($query)use($parametros){
                    return $query->where('descripcion','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('marca','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('modelo','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('talla','LIKE','%'.$parametros['query'].'%');
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

    public function show($id, Request $request){
        try{
            $loggedUser = auth()->userOrFail();

            $parametros = $request->all();
            $obj = CatalogoArticulos::find($id);

            return response()->json(['data'=>$obj],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            throw new \App\Exceptions\LogError('Ocurrio un error al intentar obtener la lista de usuarios',0,$e);
        }
    }

    public function store(Request $request){
        try{
            $validation_rules = [
                'descripcion' => 'required',
                'catalogo_unidad_id' => 'required',
                'marca' => 'required',
                'modelo' => 'required',
                'talla' => 'required',
                //'inventario' => 'required',
                'min' => 'required',
                'max' => 'required'
            ];
        
            $validation_eror_messages = [
                'descripcion.required' => 'El nombre es requerido',
                'cargo.required' => 'El cargo es requerido',
            ];

            $parametros = $request->all(); 
            $parametros = $parametros['params']; 
            $resultado = Validator::make($parametros,$validation_rules,$validation_eror_messages);

            if($resultado->passes()){
                DB::beginTransaction();
                $usuario = auth()->userOrFail();
                if(isset($parametros['id']) && $parametros['id']!=0)
                {
                    $obj = CatalogoArticulos::find($parametros['id']);
                }else
                {
                    $obj = new CatalogoArticulos();
                }
                $obj->catalogo_unidad_id    = $parametros['catalogo_unidad_id'];
                $obj->descripcion           = strtoupper($parametros['descripcion']);
                $obj->marca                 = strtoupper($parametros['marca']);
                $obj->modelo                = strtoupper($parametros['modelo']);
                $obj->talla                 = strtoupper($parametros['talla']);
                if(isset($parametros['id']) && $parametros['id']==0)
                {
                    $obj->inventario            = 0;
                }
                $obj->min                   = $parametros['min'];
                $obj->max                   = $parametros['max'];
                $obj->user_id               = $usuario->id;
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
            $rol = CatalogoArticulos::find($id);
            $rol->delete();

            return response()->json(['data'=>'Registro eliminado'], HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            throw new \App\Exceptions\LogError('Ocurrio un error al intentar eliminar el rol',0,$e);
        }
    }
    public function catalogoUnidad(Request $reques)
    {
        try{
            $obj = CatalogoUnidad::getModel()->get();
            
            return response()->json(['data'=>$obj], HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            throw new \App\Exceptions\LogError('Ocurrio un error al intentar eliminar el rol',0,$e);
        }
    }
    
    public function catalogos(Request $request)
    {
        try{
            $articulo = CatalogoArticulos::getModel()->get();
            $personal = CatalogoPersonal::getModel()->get();
            
            return response()->json(['articulo'=>$articulo,'personal'=>$personal], HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            throw new \App\Exceptions\LogError('Ocurrio un error al intentar eliminar el rol',0,$e);
        }
    }

    public function cardex($id, Request $request)
    {
        try{
            $articulo = CatalogoArticulos::find($id);
            $parametros = $request->all();
            $cardex = Movtos::join("movtos_detalles", "movtos_detalles.movtos_id", "movtos.id")
                            ->leftJoin("catalogo_personal", "catalogo_personal.id", "movtos_detalles.catalogo_personal_id")
                            ->leftJoin("rel_trabajador_puesto", "rel_trabajador_puesto.catalogo_personal_id", "catalogo_personal.id")
                            ->leftJoin("catalogo_puesto", "catalogo_puesto.id", "rel_trabajador_puesto.catalogo_puesto_id")
                            ->where("movtos_detalles.articulo_id", $id)
                            ->whereNull("movtos.deleted_at")   
                            ->whereNull("movtos_detalles.deleted_at")   
                            ->select("movtos.proveedor",
                                    "movtos.fecha_movimiento as fecha",
                                    "movtos.tipo_movto",
                                    "catalogo_personal.descripcion",
                                    "catalogo_personal.cargo",
                                    DB::RAW("catalogo_puesto.descripcion as puesto"),
                                    "movtos_detalles.cantidad")
                                    ->orderBy("fecha_movimiento", "desc");

            if(isset($parametros['page'])){
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 10;
    
                $cardex = $cardex->paginate($resultadosPorPagina);
            } else {
                $cardex = $cardex->get();
            }
            return response()->json(['articulo'=>$articulo, "cardex"=>$cardex], HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            throw new \App\Exceptions\LogError('Ocurrio un error al intentar eliminar el rol',0,$e);
        }
    }

    public function SubirImagen(Request $request)
    {
        ini_set('memory_limit', '-1');
        
        $mensajes = [
            
            'required'      => "required",
            'email'         => "email",
            'unique'        => "unique"
        ];
        $inputs = $request->all();
        $reglas = [
            'id'       => 'required',
        ];
        DB::beginTransaction();
        $v = Validator::make($inputs, $reglas, $mensajes);
        if ($v->fails()) {
            return response()->json(['error' => "Hace falta campos obligatorios. ".$v->errors() ], HttpResponse::HTTP_CONFLICT);
        }

        try{  
            if($request->hasFile('archivo')) {
                
                $extension = $request->file('archivo')->getClientOriginalExtension();
                $name = $inputs['id'].".".$extension;
                $request->file("archivo")->storeAs("public/Articulo", $name);
            
                $object_rel = CatalogoArticulos::find($inputs['id']);
                $object_rel->extension = $extension;
                $object_rel->save();

                DB::commit();
            }
            return response()->json(['data'=>1],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            DB::rollback();
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function VerImagen(Request $request)
    {
        $inputs = $request->all();
        try{  
            $object_rel = CatalogoArticulos::find($inputs['id']);
            $image = base64_encode(\Storage::get('public\\Articulo\\'.$inputs['id'].'.'.$object_rel->extension));
            
            return response()->json(['image'=>$image],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            DB::rollback();
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }
}
