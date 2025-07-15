<?php

namespace App\Models\Inventario;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MovtosDetalles extends Model
{
    use SoftDeletes;
    protected $table = 'movtos_detalles';
    protected $fillable = [
        'id',
        'movtos_id',
        'ariculo_id',
        'cantidad'
    ];
}
