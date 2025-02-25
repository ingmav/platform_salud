<?php

namespace App\Models\Inventario;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CatalogoCalidad extends Model
{
    use SoftDeletes;
    protected $table = 'catalogo_calidad';
    protected $fillable = [
        'id',
        'descripcion',
        'user_id'
    ];
}
