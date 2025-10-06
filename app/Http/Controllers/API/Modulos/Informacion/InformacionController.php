<?php
namespace App\Http\Controllers\API\Modulos\Informacion;

use App\Http\Controllers\Controller;
use App\Models\Informacion\Departamento;
use App\Models\Informacion\Informacion;
use App\Models\Informacion\SubTema;
use Carbon\Carbon;
use DB;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Validator;
use Illuminate\Support\Facades\Storage;

class InformacionController extends Controller
{
    public function index(Request $request)
    {
        try {
            $loggedUser = auth()->userOrFail();

            $parametros = $request->all();
            $obj = Informacion::with("subTema.departamento", "user");

            if ($loggedUser->is_superuser != 1) {
                $obj->whereRaw("catalogo_subtema_id in (select catalogo_subtema_id from rel_user_subtema where user_id=" . $loggedUser->id . ")");
            }

            if (isset($parametros['query']) && $parametros['query']) {
                $obj = $obj->where(function ($query) use ($parametros) {
                    return $query->where('nombre_archivo', 'LIKE', '%' . $parametros['query'] . '%');
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
            'unique' => "unique",
        ];
        $inputs = $request->all();
        $reglas = [
            //'catalogo_subtema_id' => 'required',
            //'descripcion'         => 'required',
        ];

        try {
            $parametros = $request->all();

            //$parametros = $parametros['params'];
            $resultado = Validator::make($inputs, $reglas, $mensajes);
            if (!$request->hasFile('archivo')) {
                dd("sin archivo");
            }
            \Storage::makeDirectory("public//informacion");
            if ($resultado->passes()) {
                $usuario = auth()->userOrFail();
                if ((int) $inputs['id'] != 0) {
                    $obj = Informacion::find($inputs['id']);
                } else {
                    $obj = new Informacion();
                    $obj->user_id = $usuario->id;
                }

                DB::beginTransaction();

                if ($request->hasFile('archivo')) {
                    $registro = New Carbon();
                    $file = $request->File('archivo');
                    $extension = $file->getClientOriginalExtension();
                    $tamano = $file->getSize();
                    $type = $file->getClientMimeType();
                    $obj->peso = ($tamano / 1000000);
                    $obj->type = $type;
                    $obj->extension = $extension;
                    $obj->catalogo_subtema_id = strtoupper($inputs['catalogo_subtema_id']);
                    $obj->nombre_archivo = strtoupper($inputs['descripcion']);
                    $obj->registro = $registro->format("Y-m-d");

                    $obj->save();

                    $fileName = $obj->id;
                    $name = $fileName . "." . $extension;
                    $request->file('archivo')->storeAs('public//informacion', $name);

                }

                DB::commit();

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

    public function Download(Request $request, $id)
    {

        ini_set('memory_limit', '-1');

        try {
            $obj = Informacion::find($id);
            return \Storage::download("public//informacion//" . $id . "." . $obj->extension);
        } catch (\Exception $e) {
            return response()->json(['error' => ['message' => $e->getMessage(), 'line' => $e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function Catalogos(Request $reques)
    {
        try {
            $loggedUser = auth()->userOrFail();
            if ($loggedUser->is_superuser == 1) {
                $depto = Departamento::where("catalogo_departamento.seleccionable", 1)->get();
            } else {
                $depto = Departamento::join("catalogo_subtema", "catalogo_subtema.catalogo_departamento_id", "catalogo_departamento.id")
                    ->join("rel_user_subtema", "rel_user_subtema.catalogo_subtema_id", "catalogo_subtema.id")
                    ->where("rel_user_subtema.user_id", $loggedUser->id)
                    ->where("catalogo_departamento.seleccionable", 1)
                    ->select("catalogo_departamento.id", "catalogo_departamento.descripcion")
                    ->groupBy("catalogo_departamento.id")
                    ->get();
            }
            return response()->json(['data' => $depto], HttpResponse::HTTP_OK);

        } catch (\Exception $e) {
            return response()->json(['error' => ['message' => $e->getMessage(), 'line' => $e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }
    public function subTema(Request $request)
    {
        try {
            $parametros = $request->all();
            $loggedUser = auth()->userOrFail();

            if ($loggedUser->is_superuser == 1) {
                $subTema = SubTema::where("catalogo_subtema.catalogo_departamento_id", $parametros['params'])->groupBy("catalogo_subtema.id")
                    ->get();
            } else {
                $subTema = SubTema::join("rel_user_subtema", "rel_user_subtema.catalogo_subtema_id", "catalogo_subtema.id")
                    ->where("rel_user_subtema.user_id", $loggedUser->id)
                    ->where("catalogo_subtema.catalogo_departamento_id", $parametros['params'])
                    ->groupBy("catalogo_subtema.id")
                    ->select("catalogo_subtema.id", "catalogo_subtema.descripcion")
                    ->get();
            }

            return response()->json(['data' => $subTema], HttpResponse::HTTP_OK);

        } catch (\Exception $e) {
            return response()->json(['error' => ['message' => $e->getMessage(), 'line' => $e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }
}
