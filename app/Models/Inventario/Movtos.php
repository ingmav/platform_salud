<?php

namespace App\Models\Inventario;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Movtos extends Model
{
    use SoftDeletes;
    protected $table = 'movtos';
    protected $fillable = [
        'id',
        'catalogo_personal_id',
        'empresa',
        'fecha_movimiento',
        'cantidad_total',
        'tipo_movto',
        'user_id'
    ];
}
