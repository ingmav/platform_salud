<?php

namespace App\Http\Controllers\API\Modulos\Inventario;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use App\Http\Controllers\Controller;

use App\Models\Inventario\CatalogoArticulos;
use App\Models\Inventario\Movtos;
use App\Models\Inventario\MovtosDetalles;

use Validator, DB;

class InventarioController extends Controller
{
    public function index(Request $request){
        try{
            $loggedUser = auth()->userOrFail();

            $parametros = $request->all();
            $obj = CatalogoArticulos::with("unidad")->orderBy("catalogo_articulos.descripcion");

            
            //Filtros, busquedas, ordenamiento
            if(isset($parametros['query']) && $parametros['query']){
                $obj = $obj->where('descripcion','LIKE','%'.$parametros['query'].'%');
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
            $loggedUser = auth()->userOrFail();

            $parametros = $request->all();
            
            $validation_rules = [
                'fecha' => 'required'
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
                    $obj = Movtos::find($parametros['id']);
                }else
                {
                    $obj = new Movtos();
                }
                $obj->proveedor = strtoupper($parametros['proveedor']);
                $obj->fecha_movimiento = $parametros['fecha_movimiento'];
                $cantidad_total = 0;
                
                $obj->tipo_movto = $parametros['tipo_movto'];
                $obj->user_id = $usuario->id;
                $obj->save();
                
                $arreglo_aux = [];
                $arreglo_indices = [];
                
                for ($i=0; $i < count($parametros['articulos']); $i++) {

                    $obj_movto = new MovtosDetalles();
                    $obj_movto->movtos_id = $obj->id;
                    $registro =  $parametros['articulos'][$i];
                    $obj_movto->articulo_id = $registro['articulo']['id'];
                    
                    if($obj->tipo_movto == 2)
                    {
                        $obj_movto->catalogo_personal_id = $registro['persona']['id'];
                    }
                    
                    $obj_movto->cantidad = $registro['cantidad'];
                
                    $obj_movto->save();
                    $cantidad_total += $registro['cantidad'];
                    if(!isset($arreglo_aux[$registro['articulo']['id']]))
                    {
                        $arreglo_aux[$registro['articulo']['id']] = 0;
                    }
                    $arreglo_aux[$registro['articulo']['id']] += $registro['cantidad'];
                    $arreglo_indices [] = $registro['articulo']['id'];
                }
                $obj->cantidad_total = $cantidad_total;
                
                //Descontar de inventario y validar que no de 0 en este proceso
                if($obj->tipo_movto == 1) //Primero veremos que pasa cuando agregamos al inventario
                {
                    //como siempre no validamos nada por que esa agregar
                    //Hacemos un insert para cada uno, no creo que sean muchos
                    foreach ($arreglo_aux as $key => $value) {
                        $obj_insert = CatalogoArticulos::find($key);
                        $obj_insert->inventario += $value;
                        $obj_insert->save();
                    }
                }else if($obj->tipo_movto == 2) //Ahora vamos con el dificil con el de quitar inventario
                {
                    //Hacemos el foreach para recorer todo el arreglo
                    foreach ($arreglo_aux as $key => $value) {
                        $obj_restar = CatalogoArticulos::find($key);
                        //Empezamos validacion
                        $resultado = $obj_restar->inventario - $value;
                        if($resultado < 0)
                        {//Mandamos error si el inventario llega a cero
                            DB::rollback();
                            return response()->json(['message' => 'Inventario Insuficiente', 'error_type'=>'Inventario','articulo_id'=>$key,'articulo'=>$obj_restar->descripcion, 'insuficiencia'=>$resultado], HttpResponse::HTTP_CONFLICT);
                        }else{
                            $obj_restar->inventario -= $value;
                            $obj_restar->save();
                        }
                        
                    }
                }
                //Fin de la validacion
                $obj->save();

                DB::commit();
                return response()->json(['data'=>$obj],HttpResponse::HTTP_OK);
            }else{
                DB::rollback();
                return response()->json(['mensaje' => 'Error en los datos del formulario', 'validacion'=>$resultado->passes(), 'errores'=>$resultado->errors()], HttpResponse::HTTP_CONFLICT);
            }
            
        }catch(\Exception $e){
            DB::rollback();
            throw new \App\Exceptions\LogError('Ocurrio un error al guardar el formulario',0,$e);
        }
    }
}
