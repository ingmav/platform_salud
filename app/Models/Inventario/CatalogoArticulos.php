<?php

namespace App\Models\Inventario;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CatalogoArticulos extends Model
{
    use SoftDeletes;
    protected $table = 'catalogo_articulos';
    protected $fillable = [
        'id',
        'catalogo_unidad_id',
        'descripcion',
        'marca',
        'modelo',
        'talla',
        'inventario',
        'min',
        'max',
        'user_id'
    ];

    public function unidad(){
        return $this->belongsto('App\Models\Inventario\CatalogoUnidad', "catalogo_unidad_id", "id");
    }
}
