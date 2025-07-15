<?php

namespace App\Models\Capacitacion;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Puesto extends Model
{
    use SoftDeletes;
    protected $table = 'catalogo_puesto';

    public function capacitaciones(){
        return $this->hasMany('App\Models\Capacitacion\RelPuestoCapacitacion','catalogo_puesto_id');
    }
}
