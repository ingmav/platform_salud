<?php

namespace App\Models\Capacitacion;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RelTrabajadorCapacitacion extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $table = 'rel_trabajador_capacitacion';

   
}
