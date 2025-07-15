<?php

namespace App\Models\Capacitacion;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;


class Capacitacion extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $table = 'catalogo_capacitacion';
    protected $fillable = [
        'descripcion',
    ];
}
