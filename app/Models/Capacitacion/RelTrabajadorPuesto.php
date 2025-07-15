<?php

namespace App\Models\Capacitacion;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RelTrabajadorPuesto extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $table = 'rel_trabajador_puesto';

    public function puesto(){
        return $this->belongsto('App\Models\Capacitacion\Puesto', "catalogo_puesto_id", "id");
    }

    public function puesto_capacitacion()
    {
        return $this->hasMany('App\Models\Capacitacion\RelPuestoCapacitacion', 'catalogo_puesto_id', 'catalogo_puesto_id');
    }
}
