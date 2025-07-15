<?php

namespace App\Models\Inventario;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DescripcionArticulo extends Model
{
    use SoftDeletes;
    protected $table = 'descripcion_articulo';
    protected $fillable = [
        'id',
        'articulo_id',
        'catalogo_calidad_id',
        'movto_id',
        'estatus',
        'user_id',
    ];
}
