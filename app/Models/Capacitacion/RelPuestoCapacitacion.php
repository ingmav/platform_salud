<?php

namespace App\Models\Capacitacion;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RelPuestoCapacitacion extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $table = 'rel_puesto_capacitacion';

    public function puesto()
    {
        return $this->belongsTo('App\Models\Capacitacion\Puesto', 'catalogo_puesto_id');
    }
    
    public function capacitacion()
    {
        return $this->belongsTo('App\Models\Capacitacion\Capacitacion', 'catalogo_capacitacion_id');
    }
}
