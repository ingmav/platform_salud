<?php

namespace App\Http\Controllers\API\Modulos\Informacion;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use App\Http\Controllers\Controller;

use Validator, DB;

use App\Models\Informacion\Informacion;

class InformacionController extends Controller
{
    public function index(Request $request)
    {
        try {
            $loggedUser = auth()->userOrFail();

            $parametros = $request->all();
            $obj = Informacion::with("subTema.departamento", "user");

            if($loggedUser->is_superuser != 1)
            {
                $obj->whereRaw("catalogo_subtema_id in (select catalogo_subtema_id from rel_user_subtema where user_id=".$loggedUser->id.")");
            }

            if (isset($parametros['query']) && $parametros['query']) {
                $obj = $obj->where(function ($query) use ($parametros) {
                    return $query->where('descripcion', 'LIKE', '%' . $parametros['query'] . '%');
                });
            }

            if ((isset($parametros['sort']) && $parametros['sort']) && (isset($parametros['direction']) && $parametros['direction'])) {
                $obj = $obj->orderBy($parametros['sort'], $parametros['direction']);
            } else {
                $obj = $obj->orderBy('updated_at', 'desc');
            }

            if (isset($parametros['page'])) {
                $resultadosPorPagina = isset($parametros["per_page"]) ? $parametros["per_page"] : 20;

                $obj = $obj->paginate($resultadosPorPagina);
            } else {
                $obj = $obj->get();
            }

            return response()->json(['data' => $obj], HttpResponse::HTTP_OK);
        } catch (\Exception $e) {
            throw new \App\Exceptions\LogError('Ocurrio un error al intentar obtener la lista de usuarios', 0, $e);
        }
    }


    public function Store(Request $request)
    {
        ini_set('memory_limit', '-1');

        $mensajes = [

            'required' => "required",
            'email' => "email",
            'unique' => "unique"
        ];
        $inputs = $request->all();
        $reglas = [
            'catalogo_subtema_id' => 'required',
            'descripcion' => 'required',
        ];


        try {
            $parametros = $request->all();
            //$parametros = $parametros['params'];
            $resultado = Validator::make($inputs, $reglas, $mensajes);

            \Storage::makeDirectory("public\informacion");
            if ($resultado->passes()) {
                $obj = new Informacion();

                if ($request->hasFile('archivo')) {
                    DB::beginTransaction();
                    $usuario = auth()->userOrFail();


                    $file = $request->File('archivo');
                    $extension = $file->getClientOriginalExtension();


                    $obj->catalogo_subtema_id = strtoupper($inputs['catalogo_subtema_id']);
                    $obj->user_id = $usuario->id;
                    $obj->nombre_archivo = strtoupper($inputs['descripcion']);
                    $obj->extension = $extension;

                    $obj->save();

                    $fileName = $obj->id;
                    $name = $fileName . "." . $extension;
                    $request->file("archivo")->storeAs("public/informacion", $obj->id.".".$obj->extension);
                    $tamano = $file->getSize();
                    $type = $file->getClientMimeType();
                    $obj->peso = ($tamano / 1000000);
                    $obj->type = $type;
                    $obj->save();
                    DB::commit();
                }
                return response()->json(['data' => $obj], HttpResponse::HTTP_OK);
            } else {
                return response()->json(['mensaje' => 'Error en los datos del formulario', 'validacion' => $resultado->passes(), 'errores' => $resultado->errors()], HttpResponse::HTTP_CONFLICT);
            }

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => ['message' => $e->getMessage(), 'line' => $e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }
    public function destroy($id)
    {
        try {
            $obj = Informacion::find($id);
            $obj->delete();

            return response()->json(['data' => 'Registro eliminado'], HttpResponse::HTTP_OK);
        } catch (\Exception $e) {
            throw new \App\Exceptions\LogError('Ocurrio un error al intentar eliminar el rol', 0, $e);
        }
    }

    public function Download(Request $reques, $id)
    {

        ini_set('memory_limit', '-1');

        try {
            $obj = Informacion::find($id);
            return \Storage::download("public//informacion//" . $id . ".".$obj->extension);
        } catch (\Exception $e) {
            return response()->json(['error' => ['message' => $e->getMessage(), 'line' => $e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }
}
