<?php

namespace App\Models\Inventario;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CatalogoUnidad extends Model
{
    use SoftDeletes;
    protected $table = 'catalogo_unidad';
    protected $fillable = [
        'id',
        'descripcion',
        'user_id'
    ];
}
